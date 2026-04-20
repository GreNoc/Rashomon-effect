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
    {id: "PEOU1", question: "1. **Learning to operate the AI prediction model would be easy for me.**", isAttentionCheck: false},
    {id: "PEOU2", question: "2. **I would find it easy to get the AI prediction model to do what I want it to do.**", isAttentionCheck: false},
    {id: "PEOU3", question: "3. **My interaction with the AI prediction model would be clear and understandable.**", isAttentionCheck: false},
    {id: "PEOU4", question: "4. **I would find the AI prediction model to be flexible to interact with.**", isAttentionCheck: false},
    {id: "PEOU5", question: "5. **It would be easy for me to become skillful at using the AI prediction model.**", isAttentionCheck: false},
    {id: "PEOU6", question: "6. **I would find the AI prediction model easy to use.**", isAttentionCheck: false},
]

const scale: LikertScale = {
    options: ["1", "2", "3", "4", "5", "6", "7"],
    leftLabel: "*Strongly disagree*",
    rightLabel: "*Strongly agree*",
  };

const PerceivedEaseOfUse : React.FC<ManagementInsightProps> = (
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
export default PerceivedEaseOfUse