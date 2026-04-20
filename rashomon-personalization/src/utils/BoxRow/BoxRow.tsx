import styles from './index.module.css'

const BoxRow : React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <div className={styles.boxRow}>
            {children}
        </div>
    )
}

export default BoxRow