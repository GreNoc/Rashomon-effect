import React, {useState} from "react";
import styles from './index.module.css'
import classNames from "classnames";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";

interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

interface ValidatedInputProps {
  validate: (value: string) => ValidationResult;
  placeholder?: string;
  className?: string;
  onChange: (value: string) => void;
  error?: string | null;
  indicatedValidInput?: boolean;
  rows?: number;
}

const ValidatedInput : React.FC<ValidatedInputProps> = ({
  //@ts-expect-error leave unused arg
  validate = (value) => ({ isValid: true, error: null }),
  placeholder = "Enter text",
  //@ts-expect-error leave unused arg
  className = "",
  onChange = () => {},
  //@ts-expect-error leave unused arg
  error = null,
  indicatedValidInput = true,
  rows = 1,
}) => {
  const [value, setValue] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);
  
  const { isValid, error: validationError } = validate(value);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setTouched(true);
    onChange(newValue);
  };

  const inputClassName = classNames(styles.inputField, {
    [styles.untouched]: !touched,
    [styles.valid]: touched && isValid && indicatedValidInput,
    [styles.invalid]: touched && !isValid
  });

  return (
      <div>
        {touched && validationError && (
            <ErrorMessage message={validationError}/>
        )}
        <textarea
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={inputClassName}
            rows={rows}
        />

      </div>
  );
};

export default ValidatedInput;