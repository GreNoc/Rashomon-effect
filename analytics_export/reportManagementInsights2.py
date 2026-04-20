import json
import pandas as pd
import pytz

from datetime import datetime, timezone
from sqlmodel import Field, Session, SQLModel, create_engine, select


berlin_tz = pytz.timezone("Europe/Berlin")
EXPERIMENT_START = berlin_tz.localize(datetime(2024, 11, 6, 21, 37))
EXPERIMENT_END = berlin_tz.localize(datetime(2024, 11, 6, 23, 34))


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
                ][5].get("userInput"),
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
                **{
                    key: val
                    for key, val in payload_event["evaluationContext"][
                        "perceivedUsefulnessAnswer"
                    ].items()
                },
                **{
                    key: val
                    for key, val in payload_event["evaluationContext"][
                        "perceivedEaseOfUseAnswer"
                    ].items()
                },
                **{
                    key: val
                    for key, val in payload_event["evaluationContext"][
                        "perceivedCognitiveEffortAnswer"
                    ].items()
                },
                **{
                    key: val
                    for key, val in payload_event["evaluationContext"][
                        "perceivedInformativenessAnswer"
                    ].items()
                },
                **{
                    key: val
                    for key, val in payload_event["evaluationContext"][
                        "mentalModelGoalAnswer"
                    ].items()
                },
            }
        case _:
            raise NotImplementedError


engine = create_engine("sqlite:///analytics_store_exports/1730967808.db")

experiment_start_timestamp = datetime_to_unix(EXPERIMENT_START)
experiment_end_timestamp = datetime_to_unix(EXPERIMENT_END)

with Session(engine) as session:
    experiment_query = select(AnalyticsEvents).where(
        AnalyticsEvents.timestamp > datetime_to_unix(EXPERIMENT_START),
        AnalyticsEvents.timestamp < datetime_to_unix(EXPERIMENT_END),
        AnalyticsEvents.type == "EvaluationCompleted",
        # AnalyticsEvents.experimentTag == "managementInsights2",
    )

    personalization_info_query = select(AnalyticsEvents).where(
        AnalyticsEvents.timestamp > datetime_to_unix(EXPERIMENT_START),
        AnalyticsEvents.timestamp < datetime_to_unix(EXPERIMENT_END),
        AnalyticsEvents.type == "EvaluationCompleted",
    )

    experiment_query_result = session.exec(experiment_query)
    personalization_info_query_result = session.exec(personalization_info_query)

    # print(json.dumps(json.loads(experiment_query_result.first().payload), indent=2))
    report_records = [parse_event(event) for event in experiment_query_result]

    management_insights_report = pd.DataFrame.from_records(report_records)
    management_insights_report.to_excel("managementInsights2_experiment_results.xlsx")

    personalizationContextByUser = {
        event.userid: json.loads(event.payload)["context"]["personalizationContext"]
        for event in personalization_info_query_result
    }
    with open("managementInsights2_personalization_context.json", "w") as fp:
        json.dump(personalizationContextByUser, fp)

    personalizationContextByUser = {
        event.userid: json.loads(event.payload)["context"]["personalizationContext"]
        for event in personalization_info_query_result
    }
    with open("managementInsights2_personalization_context.json", "w") as fp:
        json.dump(personalizationContextByUser, fp)
