import { useEffect, useState } from 'react';
import blueCoin from '../../assets/textures/blue-coin.webp';
import redCoin from '../../assets/textures/red-coin.webp';
import styles from './Coin.module.css';

export default function Coin({ isPlayerTurn }) {
    const [showTextToDiplay, setShowTextToDisplay] = useState(false);

    const textToDiplay = isPlayerTurn ? "Blue start!" : "Red start!";

    useEffect(() => {
        setTimeout(() => setShowTextToDisplay(true), 1500);
    }, []);

    return (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className='relative w-full flex items-center justify-center pb-14'>
                {showTextToDiplay &&
                    (
                        <h2 className={`${styles['slide-in-elliptic-top-fwd']} uppercase absolute bottom-0 left-1/2 -translate-x-1/2 header-text text-xl lg:text-3xl text-hop`}>
                            {textToDiplay.split('').map((char, index) => (<span key={index} style={{
                                animationDelay: `${(index + 1) * 50}ms`
                            }}>{char}</span>))}
                        </h2>
                    )}
                <div className="drop-shadow-lg/60">
                    <div className={`${styles.coin} ${styles['flip-scale-2-hor-bottom']}`}>
                        <img src={blueCoin} alt="Blue coin face" className={styles.coinFace} />
                        <img src={redCoin} alt="Red coin back" className={styles.coinBack} />
                    </div>
                </div>
            </div>
        </div >
    )
}