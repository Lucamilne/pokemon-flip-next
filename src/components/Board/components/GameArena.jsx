import Balance from '@/components/Balance/Balance.js';
import Coin from '@/components/Coin/Coin.js';
import Grid from '@/components/Grid/Grid.js';
import styles from '../background.module.css';
import BoardControls from './BoardControls.jsx';

export default function GameArena({ cells, score, isPlayerTurn, hasWonCoinToss, isMobile, onOpenHowToPlay, onOpenMatchups }) {
    return (
        <div className={`grow ${styles.arena} flex items-center justify-center overflow-hidden`}>
            <div className={styles.wrap}>
                <div className={styles['top-plane']} />
                <div className={styles['bottom-plane']} />
            </div>
            <Balance score={score} />
            <Grid cells={cells} isPlayerTurn={isPlayerTurn} hasWonCoinToss={hasWonCoinToss} />
            <BoardControls isMobile={isMobile} onOpenHowToPlay={onOpenHowToPlay} onOpenMatchups={onOpenMatchups} />
            {hasWonCoinToss !== null && <Coin hasWonCoinToss={hasWonCoinToss} />}
        </div>
    );
}
