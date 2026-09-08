import { memo } from 'react';
import styles from '@/retro.module.css';

const ResultActions = memo(function ResultActions({ onShowBoard, onPlayAgain }) {
    return <div className="relative group text-center font-press-start text-lg flex flex-col md:flex-row justify-center gap-2 md:gap-4"><button className={`${styles['nes-btn']} cursor-pointer font-press-start`} onClick={onShowBoard}>Show Board</button><button className={`${styles['nes-btn']} ${styles['is-success']} cursor-pointer`} onClick={onPlayAgain}>Play Again</button></div>;
});

export default ResultActions;
