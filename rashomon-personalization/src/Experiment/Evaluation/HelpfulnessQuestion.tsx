import MarkdownBox from "../../utils/MarkdownBox/MarkdownBox.tsx";
import React from "react";
import Dashboard from "../../Dashboard/dashboard.tsx";
import {Encoding} from "../Personalization/bandit.ts";
import {normalizedData} from "../Personalization/data.tsx";
import BackgroundContainer from "../../utils/BackgroundContainer/BackgroundContainer.tsx";
import BoxCol from "../../utils/BoxCol/BoxCol.tsx";
import BoxRow from "../../utils/BoxRow/BoxRow.tsx";
import Box from "../../utils/Box/Box.tsx";
import {MultiQuestionLikertForm} from "../../utils/LikertScale/MultiQuestionLikertForm.tsx";

interface ManagementInsightProps {
    encoding?: Encoding
    onNext: (answer: object) => void
}

const configurationLookup = normalizedData.configurationData

const mdHelpfulnessIntro = `
## Rate Your Dashboard's Helpfulness
Now that you've generated insights, please rate how helpful you found your personalized dashboard.
`

const HelpfulnessQuestion : React.FC<ManagementInsightProps> = (
    {
        onNext,
        encoding=JSON.parse(Object.keys(configurationLookup)[0])
    }) => {

    return (
        <div>
            <BackgroundContainer>
                <div>
                    <BoxCol>
                        <BoxRow>
                            <Dashboard {...configurationLookup[JSON.stringify(encoding)]}/>
                        </BoxRow>
                        <BoxRow>
                            <BoxCol>
                                <Box color={"transparent"}>
                                    <MarkdownBox markdown={mdHelpfulnessIntro}/>
                                </Box>
                            </BoxCol>
                            <BoxCol>
                                <Box color={"transparent"}>
                                    <MultiQuestionLikertForm
                                        questions={[{
                                            id: "helpfulness-personalization",
                                            question: "**How *helpful* was this dashboard configuration for generating insights?**",
                                            isAttentionCheck: false
                                        }]}
                                        scale={{
                                            options: ["1", "2", "3", "4", "5", "6", "7"],
                                            leftLabel: "Not at all helpful",
                                            rightLabel: "Very helpful"
                                        }}
                                        onSubmit={(answers) => onNext({helfulnessAnswer: answers})}
                                    />
                                </Box>
                            </BoxCol>
                        </BoxRow>
                    </BoxCol>
                </div>
            </BackgroundContainer>
        </div>
    )
}
export default HelpfulnessQuestion