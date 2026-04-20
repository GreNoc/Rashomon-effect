import React, { useState } from 'react';
import { LikertQuestion, LikertScale, Answer } from './types';
import { QuestionItem } from './QuestionItem';
import NextButton from '../../utils/NextButton/NextButton';
import styles from './styles.module.css';

interface MultiQuestionLikertFormProps {
  questions: LikertQuestion[];
  scale: LikertScale;
  onSubmit: (answers: object) => void;
}

export const MultiQuestionLikertForm: React.FC<MultiQuestionLikertFormProps> = ({
  questions,
  scale,
  onSubmit,
}) => {
  const [answers, setAnswers] = useState<Answer[]>([]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionId === questionId);
      if (existing !== -1) {
        return prev.map((a) =>
          a.questionId === questionId ? { ...a, value } : a
        );
      }
      return [...prev, { questionId, value }];
    });
  };

  const isComplete = answers.length === questions.length;

  const handleSubmit = () => {
    if (!isComplete) return;
    const answerObj = Object.fromEntries(answers.map(a => [a.questionId, a.value]))
    onSubmit(answerObj)
    setAnswers([]);
  };

  return (
    <div className={styles.likertForm}>
      {questions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          scale={scale}
          value={answers.find((a) => a.questionId === question.id)?.value ?? null}
          onChange={handleAnswerChange}
        />
      ))}
      <NextButton
        isValid={isComplete}
        onNext={handleSubmit}
        label="Enter your rating to proceed."
      />
    </div>
  );
};