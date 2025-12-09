import React from 'react';
import styles from './ResetButton.module.css';

interface ResetButtonProps {
    onClick: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onClick }) => {
    return (
        <button className={styles.learnMore} onClick={onClick}>
            <span className={styles.circle} aria-hidden="true">
                <span className={`${styles.icon} ${styles.arrow}`} />
            </span>
            <span className={styles.buttonText}>RESET SYSTEM</span>
        </button>
    );
};

export default ResetButton;
