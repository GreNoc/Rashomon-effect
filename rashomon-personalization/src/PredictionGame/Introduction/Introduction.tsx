import {stateMachine} from "./stateMachine.ts";
import {useMachine} from "@xstate/react";
import Welcome from "./Welcome.tsx";
import EnterProlificId from "./EnterProlificId.tsx";
import IntroTask1 from "./IntroTask1.tsx";
import IntroTask2 from "./IntroTask2.tsx";
import IntroTask3 from "./IntroTask3.tsx";
import IntroTask4 from "./IntroTask4.tsx";
import IntroTask5 from "./IntroTask5.tsx";
import IntroTask6 from "./IntroTask6.tsx";
import YourTask from "./YourTask.tsx";
import {Input} from "../stateMachine.ts";
import GreatInsights from "./GreatInsights.tsx";
import WelcomeToCityRide from "./WelcomeToCityRide.tsx";

interface IntroductionProps {
    onNext: (introductionContext: object) => void;
    machineInput: Input
}


const Error: React.FC<{ stateValue: string }> = ({stateValue}): JSX.Element => {
    return (
        <div>
            <h1>Error</h1>
            Error: no component for state {stateValue} found!
        </div>
    )
}


const Introduction: React.FC<IntroductionProps> = ({onNext, machineInput}) : JSX.Element => {

    const [snapshot, send] = useMachine(stateMachine, {input: machineInput});

    const stateToScreen = () => {
        const mapping : Array<[string, JSX.Element]> = [

            ["Welcome", <Welcome onNext={ () =>
                send({ type: "toEnterProlificId" }) }/>],

            ["EnterProlificId", <EnterProlificId onNext={ (prolificId) =>
                send({ type: "toWelcomeToCityRide", prolificId: prolificId }) }/>],

            ["WelcomeToCityRide", <WelcomeToCityRide onNext={ () =>
                send({ type: "toIntroTask1" }) }/>],

            ["IntroTask1", <IntroTask1 onNext={ (introTask1Answer: object) =>
                send({ type: "toIntroTask2", introTask1Answer: introTask1Answer}) }/>],

            ["IntroTask2", <IntroTask2 onNext={ (introTask2Answer: object) =>
                send({ type: "toIntroTask3", introTask2Answer: introTask2Answer }) }/>],

            ["IntroTask3", <IntroTask3 onNext={ (introTask3Answer: object) =>
                send({ type: "toIntroTask4", introTask3Answer: introTask3Answer }) }/>],

            ["IntroTask4", <IntroTask4 onNext={ (introTask4Answer: object) =>
                send({ type: "toIntroTask5", introTask4Answer: introTask4Answer }) }/>],

            ["IntroTask5", <IntroTask5 onNext={ (introTask5Answer: object) =>
                send({ type: "toIntroTask6", introTask5Answer: introTask5Answer }) }/>],

            ["IntroTask6", <IntroTask6 onNext={ (introTask6Answer: object) =>
                send({ type: "toGreatInsights" , introTask6Answer: introTask6Answer })}/>],

            ["GreatInsights", <GreatInsights onNext={ () => send({ type: "toYourTask" }) }/>],

            ["YourTask", <YourTask onNext={ () => {
                onNext(snapshot.context)
            } }/>],
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
            <div className="Background">
                {stateToScreen()}
            </div>
        </div>
    );
};

export default Introduction;