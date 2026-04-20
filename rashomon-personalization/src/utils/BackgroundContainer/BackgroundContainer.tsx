import styles from './styles.module.css';

const BackgroundContainer : React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <div className={styles.pageWrapper}>
      <div
          className={styles.containerWrapper}>
        <div className={styles.container}>
          <div className={styles.scrollArea}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundContainer;