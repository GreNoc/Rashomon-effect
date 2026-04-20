import React, { useState } from "react";
import Dashboard from "./dashboard.tsx";
import {type Encoding, type UserContext, updateContext, sampleEncoding, initializeContext} from "./bandit.ts";
import {type DashboardDataByConfiguration, normalizedData} from "./data.tsx";
import './DashboardBandit.css'

interface FeedbackComponentProps {
    onSubmit: (reward: number) => void;
}

interface DashboardBanditProps {
    onNext: () => void;
    FeedbackComponent: React.FC<FeedbackComponentProps>;
}

const DashboardBandit: React.FC<DashboardBanditProps> = ({onNext, FeedbackComponent}: DashboardBanditProps) : JSX.Element=> {

    const configurationLookup = normalizedData.configurationData

    const sampleFromRashomonSet = (
        userContext: UserContext,
        configurationLookup: DashboardDataByConfiguration): Encoding => {

        const encodingCandidate = sampleEncoding(userContext)

        return JSON.stringify(encodingCandidate) in configurationLookup ?
            encodingCandidate :
            sampleFromRashomonSet(userContext, configurationLookup)

    }

    const handleButtonClick = (reward: number) => {
        onNext()
        console.log("click")
        setUserContext(updateContext(userContext, encoding, reward))
        setEncoding(sampleFromRashomonSet(userContext, configurationLookup))
    }

    const initialUserContext : UserContext = initializeContext()
    const initialEncoding : Encoding = sampleFromRashomonSet(initialUserContext, configurationLookup)

    const [userContext, setUserContext] = useState(initialUserContext)
    const [encoding, setEncoding] = useState(initialEncoding)

    return (
        <div>
            <div className="Background">
                <div className="button-container">
                    <FeedbackComponent onSubmit={handleButtonClick}/>
                </div>
                <div>
                    <Dashboard {...configurationLookup[JSON.stringify(encoding)]}/>
                </div>
            </div>
        </div>
    );
};

export default DashboardBandit;