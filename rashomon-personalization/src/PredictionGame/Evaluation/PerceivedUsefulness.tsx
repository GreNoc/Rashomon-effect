import React from "react";
import {Encoding} from "../Personalization/bandit.ts";
import BackgroundContainer from "../../utils/BackgroundContainer/BackgroundContainer.tsx";
import BoxCol from "../../utils/BoxCol/BoxCol.tsx";
import {LikertQuestion, LikertScale} from "../../utils/LikertScale/types.ts";
import {MultiQuestionLikertForm} from "../../utils/LikertScale/MultiQuestionLikertForm.tsx";
import MarkdownBox from "../../utils/MarkdownBox/MarkdownBox.tsx";

interface ManagementInsightProps {
    encoding?: Encoding
    onNext: (answer: object) => void
}

const questions : LikertQuestion[] = [
    {id: "PU1", question: "1. **Using the AI prediction model would enable me to accomplish generating insights more quickly.**", isAttentionCheck: false},
    {id: "PU2", question: "2. **Using the AI prediction model would improve my performance in generating insights.**", isAttentionCheck: false},
    {id: "PU3", question: "3. **Using the AI prediction model would increase my productivity in generating insights.**", isAttentionCheck: false},
    {id: "PU4", question: "4. **Using the AI prediction model would enhance my effectiveness in generating insights.**", isAttentionCheck: false},
    {id: "PU5", question: "5. **Using the AI prediction model would make it easier to generate insights.**", isAttentionCheck: false},
    {id: "AC1", question: "6. **Please select 'strongly agree' for this item to show that you are reading carefully.**", isAttentionCheck: false},
    {id: "PU6", question: "7. **I would find the AI prediction model useful for generating insights.**", isAttentionCheck: false},
]

const scale: LikertScale = {
    options: ["1", "2", "3", "4", "5", "6", "7"],
    leftLabel: "*Strongly disagree*",
    rightLabel: "*Strongly agree*",
  };

const mdMessage = `
We are interested in understanding your views on your personalized AI prediction model and its potential impact on 
generating insights. Below are several statements about using this AI prediction model.

### Please indicate your agreement with the following statements.
`

const HelpfulnessQuestion : React.FC<ManagementInsightProps> = (
    {
        onNext,
    }) => {

    const handleSubmit = (answer: object) => {
        onNext(answer)
    };

    return (
        <div>
            <BackgroundContainer>
                <div>
                    <BoxCol>
                        <MarkdownBox markdown={mdMessage}/>
                         <MultiQuestionLikertForm
                             questions={questions}
                             scale={scale}
                             onSubmit={handleSubmit}
                         />
                    </BoxCol>
                </div>
            </BackgroundContainer>
        </div>
    )
}
export default HelpfulnessQuestion