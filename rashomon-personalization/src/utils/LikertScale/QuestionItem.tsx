import React from 'react';
import { LikertQuestion, LikertScale } from './types';
import { LikertScaleInput } from './LikertScaleInput';
import MarkdownBox from '../../utils/MarkdownBox/MarkdownBox';
import styles from './styles.module.css';

interface QuestionItemProps {
  question: LikertQuestion;
  scale: LikertScale;
  value: string | null;
  onChange: (questionId: string, value: string) => void;
}

export const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  scale,
  value,
  onChange,
}) => {
  return (
    <div className={styles.questionItem}>
      <div>
        <MarkdownBox markdown={question.question} />
      </div>
      <LikertScaleInput
        options={scale.options}
        leftLabel={scale.leftLabel}
        rightLabel={scale.rightLabel}
        selectedValue={value}
        onSelect={(value) => onChange(question.id, value)}
      />
    </div>
  );
};