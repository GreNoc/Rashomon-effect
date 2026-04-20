import styles from './index.module.css'

const BoxCol : React.FC<React.PropsWithChildren> = ({children}) => {
    return (
        <div className={styles.boxCol}>
            {children}
        </div>
    )
}

export default BoxCol