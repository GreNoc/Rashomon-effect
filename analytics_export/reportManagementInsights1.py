import json
import pandas as pd
import pytz

from datetime import datetime, timezone
from sqlmodel import Field, Session, SQLModel, create_engine, select


berlin_tz = pytz.timezone("Europe/Berlin")
EXPERIMENT_START = berlin_tz.localize(datetime(2024, 11, 5, 21, 59))
EXPERIMENT_END = berlin_tz.localize(datetime(2024, 11, 6, 0, 58))


def datetime_to_unix(dt: datetime) -> int:
    if dt.tzinfo is None:
        raise ValueError("The datetime object must be timezone-aware")
    return int(dt.timestamp() * 1000)


def unix_to_datetime(timestamp: int, tz: timezone) -> datetime:
    return datetime.fromtimestamp(timestamp / 1000, tz)


class AnalyticsEvents(SQLModel, table=True):
    timestamp: int = Field(primary_key=True)
    userid: str = Field(primary_key=True)
    experimentTag: str
    commitHash: str
    type: str
    payload: str


def isPerceivedHelpfulnessEvent(event: AnalyticsEvents) -> bool:
    return json.loads(event.payload)["event"]["type"] == "toPerceivedEaseOfUse"


def isMentalModelGoalEvent(event: AnalyticsEvents) -> bool:
    return json.loads(event.payload)["event"]["type"] == "finishEvaluation"


def parse_event(event: AnalyticsEvents) -> dict:
    match event.type:
        case "EvaluationCompleted":
            payload_context = json.loads(event.payload)["context"]
            payload_event = json.loads(event.payload)["event"]
            return {
                "internalId": event.userid,
                "prolificId": payload_context["introContext"]["prolificId"],
                "group": payload_context["group"],
                "finishTime": str(unix_to_datetime(event.timestamp, berlin_tz)),
                "personalizationAC": payload_context["personalizationContext"][
                    "requestStack"
                ][5]["reward"],
                "finalEncoding": payload_context["personalizationContext"][
                    "responseStack"
                ][0]["encoding"],
                "evaluationHelpfulnessRating": payload_event["evaluationContext"][
                    "helpfulnessAnswer"
                ]["helfulnessAnswer"]["helpfulness-personalization"],
                **{
                    f"intro_{key}": val
                    for key, val in payload_context["introContext"][
                        "introTask6Answer"
                    ].items()
                },
                **{
                    key: val
                    for key, val in payload_event["evaluationContext"][
                        "managementInsightAnswer"
                    ].items()
                },
                "optionalFeedback": payload_event["evaluationContext"][
                    "optionalFeedbackAnswer"
                ].get("feedback"),
                # note that these are the values for perceivedEaseOfUse that
                # overwrote the values of perceivedUsefulness in the context by
                # mistake
                **{
                    key: val
                    for key, val in payload_event["evaluationContext"][
                        "perceivedUsefulnessAnswer"
                    ].items()
                },
                **{
                    key: val
                    for key, val in payload_event["evaluationContext"][
                        "perceivedCognitiveEffortAnswer"
                    ].items()
                },
                # fix for wrong question id for second attention check
                **{
                    (key if key != "AC1" else "AC2"): val
                    for key, val in payload_event["evaluationContext"][
                        "perceivedInformativenessAnswer"
                    ].items()
                },
            }
        case _:
            raise NotImplementedError


engine = create_engine("sqlite:///analytics_store_exports/1730885524.db")

experiment_start_timestamp = datetime_to_unix(EXPERIMENT_START)
experiment_end_timestamp = datetime_to_unix(EXPERIMENT_END)

with Session(engine) as session:
    experiment_query = select(AnalyticsEvents).where(
        AnalyticsEvents.timestamp > datetime_to_unix(EXPERIMENT_START),
        AnalyticsEvents.timestamp < datetime_to_unix(EXPERIMENT_END),
        AnalyticsEvents.type == "EvaluationCompleted",
    )
    evaluation_event_query = select(AnalyticsEvents).where(
        AnalyticsEvents.timestamp > datetime_to_unix(EXPERIMENT_START),
        AnalyticsEvents.timestamp < datetime_to_unix(EXPERIMENT_END),
        AnalyticsEvents.type == "EventTransition-Evaluation",
    )

    personalization_info_query = select(AnalyticsEvents).where(
        AnalyticsEvents.timestamp > datetime_to_unix(EXPERIMENT_START),
        AnalyticsEvents.timestamp < datetime_to_unix(EXPERIMENT_END),
        AnalyticsEvents.type == "EvaluationCompleted",
    )

    experiment_query_result = session.exec(experiment_query)
    evaluation_event_query_result = session.exec(evaluation_event_query)
    personalization_info_query_result = session.exec(personalization_info_query)

    perceivedUsefulnessAnswers = {
        event.userid: json.loads(event.payload)["event"]["perceivedUsefulnessAnswer"]
        for event in evaluation_event_query_result
        if isPerceivedHelpfulnessEvent(event)
    }

    evaluation_event_query_result = session.exec(evaluation_event_query)
    mentalModelGoalAnswers = {
        event.userid: json.loads(event.payload)["event"]["mentalModelGoalAnswer"]
        for event in evaluation_event_query_result
        if isMentalModelGoalEvent(event)
    }

    report_records = [
        {
            **parse_event(event),
            **perceivedUsefulnessAnswers[event.userid],
            **mentalModelGoalAnswers[event.userid],
        }
        for event in experiment_query_result
    ]

    management_insights_report = pd.DataFrame.from_records(report_records)
    management_insights_report.to_excel("managementInsights_experiment_results.xlsx")

    personalizationContextByUser = {
        event.userid: json.loads(event.payload)["context"]["personalizationContext"]
        for event in personalization_info_query_result
    }
    with open("managementInsights1_personalization_context.json", "w") as fp:
        json.dump(personalizationContextByUser, fp)
