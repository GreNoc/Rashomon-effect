import {stateMachine} from "./stateMachine.ts";
import {useMachine} from "@xstate/react";
import ManagementInsightQuestion from "./ManagementInsightQuestion.tsx";
import {Encoding} from "../Personalization/bandit.ts";
import TaskReminder from "./TaskReminder.tsx";
import HelpfulnessQuestion from "./HelpfulnessQuestion.tsx";
import OptionalFeedback from "./OptionalFeedback.tsx";
import PerceivedCognitiveEffort from "./PerceivedCognitiveEffort.tsx";
import PerceivedInformativeness from "./PerceivedInformativeness.tsx";
import MentalModelGoal from "./MentalModelGoal.tsx";
import PerceivedUsefulness from "./PerceivedUsefulness.tsx";
import {Input} from "../stateMachine.ts";
import PerceivedEaseOfUse from "./PerceivedEaseOfUse.tsx";


const Error: React.FC<{ stateValue: string }> = ({stateValue}): JSX.Element => {
    return (
        <div>
            <h1>Error</h1>
            Error: no component for state {stateValue} found!
        </div>
    )
}

interface EvaluationProps {
    onNext: (evaluationContext: object) => void,
    machineInput: Input
    finalEncoding: Encoding,
}

const Evaluation: React.FC<EvaluationProps> = ({onNext, machineInput, finalEncoding}) : JSX.Element => {

    const [snapshot, send] = useMachine(stateMachine, {input: machineInput});


    const stateToScreen = () => {
        const mapping : Array<[string, JSX.Element]> = [
            ["TaskReminder", <TaskReminder onNext={ () => send({ type: "toManagementInsightQuestion" }) }/>],

            ["ManagementInsightQuestion", <ManagementInsightQuestion
                onNext={(answer: object) => send({type: "toHelpfulnessQuestion", managementInsightAnswer: answer})}
                encoding={finalEncoding} />],

            ["HelpfulnessQuestion", <HelpfulnessQuestion
                onNext={(answer) => send({type: "toOptionalFeedback", helpfulnessAnswer: answer})}
                encoding={finalEncoding} />],

            ["OptionalFeedback", <OptionalFeedback
                onNext={(answer) => send({type: "toPerceivedUsefulness", optionalFeedbackAnswer: answer})}
                encoding={finalEncoding} />],

            ["PerceivedUsefulness", <PerceivedUsefulness
                onNext={(answer) => {
                    send({type: "toPerceivedEaseOfUse", perceivedUsefulnessAnswer: answer})
                }}/>],

            ["PerceivedEaseOfUse", <PerceivedEaseOfUse
                onNext={(answer) => {
                    send({type: "toPerceivedCognitiveEffort", perceivedEaseOfUseAnswer: answer})
                }}/>],

            ["PerceivedCognitiveEffort", <PerceivedCognitiveEffort
                onNext={(answer)=>send({type: "toPerceivedInformativeness", perceivedCognitiveEffortAnswer: answer, onNext: onNext})}/>],

            ["PerceivedInformativeness", <PerceivedInformativeness
                onNext={(answer)=>send({type: "toMentalModelGoal", perceivedInformativenessAnswer: answer})}/>],

            ["MentalModelGoal", <MentalModelGoal
            onNext={(answer) => {
            send({type: "finishEvaluation", mentalModelGoalAnswer: answer, onNext: onNext})
        }}/>],

        ]
        for (const [key, component] of mapping) {
            if( snapshot.matches(key) ){
                return component
            }
        }
        return <Error stateValue={snapshot.value as string}/>
    }

    return (
        <div>
                {stateToScreen()}
        </div>
    );
};

export default Evaluation;