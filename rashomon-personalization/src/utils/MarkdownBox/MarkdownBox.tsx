import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import styles from './index.module.css';

interface MarkdownBoxProps {
    markdown: string;
}
const MarkdownBox : React.FC<MarkdownBoxProps> = ({markdown}) => {
    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} className={styles.markdown}>
        {markdown}
        </ReactMarkdown>
    )
}

export default MarkdownBox