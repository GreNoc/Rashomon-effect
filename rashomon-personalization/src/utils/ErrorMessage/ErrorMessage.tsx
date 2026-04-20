import ReactMarkdown from "react-markdown";
import styles from './index.module.css'

interface ErrorMessageProps {
    message?: string;
}
const ErrorMessage : React.FC<ErrorMessageProps> = ({message}) => {
   const fmtMessage = `***${message}***`
   return message !== undefined ? (
        <ReactMarkdown className={styles.markdown}>
        {fmtMessage}
        </ReactMarkdown>) : (<></>)
}

export default ErrorMessage