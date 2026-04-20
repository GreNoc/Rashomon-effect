import React from "react";
import {DashboardPlot} from "../../Dashboard/dashboard.tsx";
import {iceCreamPlotData} from "./iceCreamData.tsx";
import MarkdownBox from "../../utils/MarkdownBox/MarkdownBox.tsx";
import Box from "../../utils/Box/Box.tsx";
import BoxCol from "../../utils/BoxCol/BoxCol.tsx";
import BoxRow from "../../utils/BoxRow/BoxRow.tsx";
import NextButton from "../../utils/NextButton/NextButton.tsx";
import BackgroundContainer from "../../utils/BackgroundContainer/BackgroundContainer.tsx";

const markdownHeader = "# What Makes a Great Insight?"

const mdYourChallenge = `
## Your Challenge 

As a CityRide resource manager, you'll generate 5 insights from the data plots. The quality of your insights determines 
your bonus payment, with the top 25% of participants earning double compensation.
`

const mdLevel1 = `
## Level 1: Basic Observation
- Describes what you see in a single plot
`

const mdLevel2 = `
## Level 2: Connected Observation
- Links two different plots together
- Uses specific values 
`

const mdLevel3 = `
## Level 3: Deep Understanding
- Shows how effects modify each other
- Points out where relationships change
- Uses the interaction plot as evidence 
`

interface GreatInsightsProps {
    onNext: () => void

}

const GreatInsights: React.FC<GreatInsightsProps> = ({onNext}) : JSX.Element => {


    const handleSubmit = async (): Promise<void> => {
        onNext()
    };

    return (
        <BackgroundContainer>
            <MarkdownBox markdown={markdownHeader}/>
            <BoxCol>
                <BoxRow>
                    <Box color={"grey"}>
                        <MarkdownBox markdown={mdYourChallenge}/>
                    </Box>
                </BoxRow>
                <BoxRow>
                    <BoxCol>
                        <div className="chart-item">
                            <DashboardPlot dashboardData={iceCreamPlotData["Hour"]}/>
                        </div>
                    </BoxCol>
                    <BoxCol>
                        <div className="chart-item">
                            <DashboardPlot dashboardData={iceCreamPlotData["Workday"]}/>
                        </div>
                    </BoxCol>
                    <BoxCol>
                        <div className="chart-item">
                            <DashboardPlot dashboardData={iceCreamPlotData["Temperature"]}/>
                        </div>
                    </BoxCol>
                    <BoxCol>
                        <div className="chart-item">
                            <DashboardPlot dashboardData={iceCreamPlotData["Temperature x Hour"]}/>
                        </div>
                    </BoxCol>
                </BoxRow>
                <BoxRow>
                    <BoxCol>
                        <Box color={"blue"}>
                            <Box color={"transparent"}>
                                <MarkdownBox markdown={mdLevel1}/>
                            </Box>
                            <Box color={"white"}>
                                <MarkdownBox markdown={"*Sales increase with higher temperatures.*"}/>
                            </Box>
                        </Box>
                    </BoxCol>
                    <BoxCol>
                        <Box color={"yellow"}>
                            <Box color={"transparent"}>
                                <MarkdownBox markdown={mdLevel2}/>
                            </Box>
                            <Box color={"white"}>
                                <MarkdownBox markdown={"*The morning peak (9-12) has a stronger effect when temperatures " +
                                    "are above 20°C.*"}/>
                            </Box>
                        </Box>
                    </BoxCol>
                    <BoxCol>
                        <Box color={"green"}>
                            <Box color={"transparent"}>
                                <MarkdownBox markdown={mdLevel3}/>
                            </Box>
                            <Box color={"white"}>
                                <MarkdownBox markdown={"*While temperature generally increases sales, this effect " +
                                    "doubles in strength during morning hours (9-12). The interaction plot shows this " +
                                    "clearly with red regions, particularly between 20-25°C.*"}/>
                            </Box>
                        </Box>
                    </BoxCol>
                </BoxRow>
            </BoxCol>
            <div>
                <NextButton
                    isValid={true}
                    onNext={handleSubmit}
                    isLoading={false} // Add loading state management if needed
                />
            </div>
        </BackgroundContainer>
    )
}

export default GreatInsights