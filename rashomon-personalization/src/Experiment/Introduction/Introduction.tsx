import {stateMachine} from "./stateMachine.ts";
import {useMachine} from "@xstate/react";
import Welcome from "./Welcome.tsx";
import EnterProlificId from "./EnterProlificId.tsx";
import YourTask from "./YourTask.tsx";
import {Input} from "../stateMachine.ts";
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
                send({ type: "toYourTask" }) }/>],

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