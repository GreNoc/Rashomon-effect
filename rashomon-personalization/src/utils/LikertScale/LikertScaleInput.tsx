import React from 'react';
import classNames from 'classnames';
import MarkdownBox from "../MarkdownBox/MarkdownBox.tsx";
import styles from './styles.module.css';

interface LikertScaleInputProps {
  options: string[];
  leftLabel: string;
  rightLabel: string;
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

export const LikertScaleInput: React.FC<LikertScaleInputProps> = ({
  options,
  leftLabel,
  rightLabel,
  selectedValue,
  onSelect,
}) => {
  const buttonClassName = (option: string) =>
    classNames(styles.button, {
      [styles.selected]: selectedValue === option,
    });

  return (
    <div className={styles.likertScaleContainer}>
      <div className={styles.leftLikertLabel}>
        <MarkdownBox markdown={leftLabel} />
      </div>
      <div style={{
          whiteSpace: "nowrap",
          overflowX: "auto",
      }}>
        {options.map((option, index) => (
          <button
            key={index}
            className={buttonClassName(option)}
            onClick={() => onSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <div className={styles.rightLikertLabel}>
        <MarkdownBox markdown={rightLabel} />
      </div>
    </div>
  );
};