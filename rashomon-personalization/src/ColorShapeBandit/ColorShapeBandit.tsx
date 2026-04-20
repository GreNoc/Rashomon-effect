import React, { useState } from "react";
import Shape from "./content/Shape.tsx";
import {type Configuration} from "./configuration.ts";
import {type UserContext, updateContext, sampleConfig, initializeContext} from "./bandit.ts";
import HomeButton from "../HomeButton/HomeButton.tsx";
import {BinaryButtons} from "../DashboardBandit/userFeedback/BinaryButtons.tsx";
import BackgroundContainer from "../utils/BackgroundContainer/BackgroundContainer.tsx";



const ColorShapeBandit: React.FC = () => {

    const initialUserContext : UserContext = initializeContext()
    const initialConfig : Configuration = sampleConfig(initialUserContext)

    const [userContext, setUserContext] = useState(initialUserContext)
    const [config, setConfig] = useState(initialConfig)

    const handleButtonClick = (reward: number) => {
        setUserContext(updateContext(userContext, config, reward))
        setConfig(sampleConfig(userContext))
        console.log({userContext})
    }

    return (
        <div>
        <BackgroundContainer>
            <h1>Color and Shape Bandit</h1>
            <div className="shape-container">
                <Shape
                    color={config.color}
                    shape={config.shape}
                />
            </div>
            <BinaryButtons handleClick={handleButtonClick}/>
        </BackgroundContainer>
            <HomeButton/>
        </div>

    );
};

export default ColorShapeBandit;