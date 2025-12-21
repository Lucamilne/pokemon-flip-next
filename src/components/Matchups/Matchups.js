import React from 'react';
import gameData from '@/data/game-data.json';
import styles from "./matchups.module.css"
import { typeTiles } from '@/utils/typeIcons'

export default function Matchups() {
    const getEffectiveness = (attackingType, defendingType) => {
        const matchup = gameData.typeMatchups[attackingType];

        if (matchup.superEffective.includes(defendingType)) {
            return 'super';
        } else if (matchup.immune.includes(defendingType)) {
            return 'immune';
        } else if (matchup.notEffective.includes(defendingType)) {
            return 'not-effective';
        }
        return 'normal';
    };

    const getBgStyle = (type) => {
        return { backgroundColor: `var(--color-${type}-400)` };
    };

    return (
        <div className='grid grid-cols-19 grid-rows-19 bg-neutral-200 gap-0.5'>
            {/* Empty corner cell */}
            <div className="bg-white" />

            {/* Header row - defending types */}
            {gameData.types.map((type) => (
                <div key={`header-${type}`} className="flex justify-center items-center" style={getBgStyle(type)}>
                    <img draggable={false} width={48} height={18} src={typeTiles[type]} title={type} alt={`${type} type`} />
                </div>
            ))}

            {/* Each row: attacking type + effectiveness cells */}
            {gameData.types.map((attackingType) => (
                <React.Fragment key={attackingType}>
                    {/* Row header - attacking type */}
                    <div className='flex justify-center items-center' style={getBgStyle(attackingType)}>
                        <img draggable={false} width={48} height={18} src={typeTiles[attackingType]} title={attackingType} alt={`${attackingType} type`} />
                    </div>

                    {/* Effectiveness cells for this attacking type */}
                    {gameData.types.map((defendingType) => {
                        const effectiveness = getEffectiveness(attackingType, defendingType);
                        return (
                            <div
                                key={`${attackingType}-${defendingType}`}
                                className="aspect-square bg-white m-0 flex justify-center items-center"
                            >
                                {effectiveness === "super" && (
                                    <span title="Super Effective" className={styles.check}></span>
                                )}
                                {effectiveness === "immune" && (
                                    <span title="No effect" className={styles.cross}></span>
                                )}
                            </div>
                        );
                    })}
                </React.Fragment>
            ))}
        </div>
    )
}