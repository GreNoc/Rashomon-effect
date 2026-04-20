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
    {id: "GOAL1", question: "1. **I characterize my understanding of the advantages of using the AI prediction model as high.**", isAttentionCheck: false},
    {id: "GOAL2", question: "2. **I characterize my understanding of the benefits of the AI prediction model as high.**", isAttentionCheck: false},
    {id: "GOAL3", question: "3. **I characterize my understanding of the purpose the AI prediction model should serve as high.**", isAttentionCheck: false},
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