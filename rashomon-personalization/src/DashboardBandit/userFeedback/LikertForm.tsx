import React, { useState } from 'react';
import classNames from "classnames";
import styles from "./styles.module.css"
import MarkdownBox from "../../utils/MarkdownBox/MarkdownBox.tsx";
import NextButton from "../../utils/NextButton/NextButton.tsx";
import {Reward} from "../../Experiment/Personalization/bandit.ts";


interface LikertScaleProps {
  question: string;
  options: string[];
  onSubmit: (reward: Reward) => void;
  isAttentionCheck: boolean;
}

const mdQuestion = (isAttentionCheck: boolean) => isAttentionCheck ?
    'Rate this configuration with *4* to show that you are paying attention to this question.' :
    'Rate this configuration based on how well you think it would help you generate insights and answer management questions:'

const LikertForm: React.FC<LikertScaleProps> = ({ options, onSubmit, isAttentionCheck }) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleOptionClick = (value: string) => {
    setSelectedValue(value);
  };

  const isSelected = () => selectedValue !== null

  const handleSubmit = () => {

    const feedbackMapping = (value: string) : Reward => options.slice(0,4).includes(value) ? "-1" : "+1"


    if (selectedValue !== null) {
      onSubmit(feedbackMapping(selectedValue));
      setSelectedValue(null)
    } else {
      console.log("No option selected.");
    }
  };

  const buttonClassName = (option: string) => classNames(styles.button, {
      [styles.selected]: selectedValue === option
  });

  return (
      <div className={styles.likertScale}>
          <div>
              <MarkdownBox markdown={mdQuestion(isAttentionCheck)}/>
          </div>
          <div className={styles.likertScaleContainer}>

                  <div className={styles.leftLikertLabel}>
                      <MarkdownBox markdown={"Not at all helpful"}/>
                  </div>
                  <div>
                      {options.map((option, index) => (
                          <button
                              key={index}
                              className={buttonClassName(option)}
                              onClick={() => handleOptionClick(option)}
                          >
                              {option}
                          </button>
                      ))}
                  </div>
                  <div className={styles.rightLikertLabel}>
                      <MarkdownBox markdown={"Very helpful"}/>
                  </div>
              </div>
              <div className="submit-section">
              </div>
              <NextButton isValid={isSelected()} onNext={handleSubmit} label={"Rate the helpfulness to proceed."}/>
          </div>
          );
          };

          export default LikertForm;
