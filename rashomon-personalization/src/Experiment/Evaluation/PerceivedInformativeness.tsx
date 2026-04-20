import React from "react";
import {Encoding} from "../Personalization/bandit.ts";
import BackgroundContainer from "../../utils/BackgroundContainer/BackgroundContainer.tsx";
import BoxCol from "../../utils/BoxCol/BoxCol.tsx";
import {LikertQuestion, LikertScale } from "../../utils/LikertScale/types.ts";
import {MultiQuestionLikertForm} from "../../utils/LikertScale/MultiQuestionLikertForm.tsx";
import MarkdownBox from "../../utils/MarkdownBox/MarkdownBox.tsx";

interface ManagementInsightProps {
    encoding?: Encoding
    onNext: (answer: object) => void
}

const questions : LikertQuestion[] = [
    {id: "PIN1", question: "1. **The AI prediction model provided relevant information for generating insights.**", isAttentionCheck: false},
    {id: "PIN2", question: "3. **The AI prediction model provided *complete* information for generating insights.**", isAttentionCheck: false},
    {id: "PIN3", question: "4. **The AI prediction model provided *accurate* information for generating insights.**", isAttentionCheck: false},
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
                    <MarkdownBox markdown={"### Please indicate your agreement with the following statements."}/>
                    <BoxCol>
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