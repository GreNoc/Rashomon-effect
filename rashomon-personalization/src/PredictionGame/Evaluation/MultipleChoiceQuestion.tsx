import React, { useState } from 'react';
import './index.css'


// Define the type for props
interface MultipleChoiceQuestionProps {
  question: string;
  options: string[];
  correctAnswers: string[];
  onSubmit: () => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  options,
  correctAnswers,
  onSubmit,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>('');

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedValue = event.target.value;

    if (event.target.checked) {
      setSelectedAnswers([...selectedAnswers, selectedValue]);
    } else {
      setSelectedAnswers(selectedAnswers.filter((answer) => answer !== selectedValue));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const isCorrect =
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every((answer) => correctAnswers.includes(answer));

    if (isCorrect) {
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect! The correct answers are: ${correctAnswers.join(', ')}`);
    }
    onSubmit()
  };

  return (
    <div className="multiple-choice-question">
      <h3>{question}</h3>
      <form onSubmit={handleSubmit}>
        {options.map((option, index) => (
          <div key={index} className="option-group">
            <label>
              <input
                type="checkbox"
                value={option}
                checked={selectedAnswers.includes(option)}
                onChange={handleOptionChange}
              />
              {option}
            </label>
          </div>
        ))}
        <div>
          <button type="submit" disabled={selectedAnswers.length === 0}>
            Submit
          </button>
        </div>
      </form>
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default MultipleChoiceQuestion;
