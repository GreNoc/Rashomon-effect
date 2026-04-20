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
    {id: "PCE1", question: "1. **The task of generating insights using the AI prediction model was very frustrating.**", isAttentionCheck: false},
    {id: "PCE2", question: "2. **Using the AI prediction model, I easily found the information I wanted to generate insights.**", isAttentionCheck: false},
    {id: "PCE3", question: "3. **The task of generating insights using the AI prediction model took too much time.**", isAttentionCheck: false},
    {id: "PCE4", question: "4. **The task of generating insights using the AI prediction model was easy.**", isAttentionCheck: false},
    {id: "PCE5", question: "5. **Generating insights using the AI prediction model required too much effort.**", isAttentionCheck: false},
    {id: "PCE6", question: "6. **The task of generating insights using the AI prediction model was too complex.**", isAttentionCheck: false},
]

const scale: LikertScale = {
    options: ["1", "2", "3", "4", "5", "6", "7"],
    leftLabel: "*Strongly disagree*",
    rightLabel: "*Strongly agree*",
  };

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
                        <MarkdownBox markdown={"### Please indicate your agreement with the following statements."}/>
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