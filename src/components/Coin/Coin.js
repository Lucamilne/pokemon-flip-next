import { useEffect, useState } from 'react';
import blueCoin from '../../assets/textures/blue-coin.webp';
import redCoin from '../../assets/textures/red-coin.webp';
import styles from './coin.module.css';

export default function Coin({ hasWonCoinToss }) {
    const [showTextToDiplay, setShowTextToDisplay] = useState(false);

    const textToDiplay = hasWonCoinToss ? "Blue start!" : "Red start!";

    useEffect(() => {
        setTimeout(() => setShowTextToDisplay(true), 1500);
    }, []);

    return (
        <div className={`${styles['fade-in']} absolute inset-0 bg-black/60 flex items-center justify-center`}>
            <div className='relative w-full flex items-center justify-center pb-16'>
                {showTextToDiplay &&
                    (
                        <h2 className={`${styles['slide-in-elliptic-top-fwd']} uppercase absolute bottom-0 left-1/2 -translate-x-1/2 header-text text-xl lg:text-4xl text-hop`}>
                            {textToDiplay.split('').map((char, index) => {
                                let color;
                                if (hasWonCoinToss) {
                                    color = index < 4 ? 'text-theme-blue' : 'text-white';
                                } else {
                                    color = index < 3 ? 'text-theme-red' : 'text-white';
                                }

                                return (
                                    <span
                                        key={index}
                                        className={color}
                                        style={{ animationDelay: `${(index + 1) * 50}ms` }}
                                    >
                                        {char}
                                    </span>
                                );
                            })}
                        </h2>
                    )}
                <div className="drop-shadow-lg/60">
                    <div className={`${styles.coin} ${styles['flip-scale-2-hor-bottom']}`}>
                        <img src={hasWonCoinToss ? blueCoin : redCoin} alt="Blue coin face" className={styles.coinFace} />
                        <img src={hasWonCoinToss ? redCoin : blueCoin} alt="Red coin back" className={styles.coinBack} />
                    </div>
                </div>
            </div>
        </div >
    )
}