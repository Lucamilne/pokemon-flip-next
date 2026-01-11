import React from 'react';
import gameData from '@/data/game-data.json';
import styles from "./matchups.module.css"
import { typeTiles } from '@/utils/typeIcons'

export default function Matchups({ isOpen, onClose }) {
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

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="relative w-full aspect-square max-w-4xl m-2 lg:max-h-[660px] default-tile border-4 border-black shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className='grid grid-cols-17 grid-rows-17 bg-neutral-500 gap-[1px]'>
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
                                            <span title="Super Effective" className={`${styles.check} scale-50 md:scale-100 !-left-1/2 !-top-1/2 !translate-x-1/2 !translate-y-1/2`}></span>
                                        )}
                                        {effectiveness === "immune" && (
                                            <span title="No effect" className={`${styles.cross} scale-50 md:scale-100 !-left-1/2 !-top-1/2 !translate-x-1/2 !translate-y-1/2`}></span>
                                        )}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>


                {/* <button onClick={onClose} className='cursor-pointer text-neutral-600 hover:text-neutral-900 leading-none w-8 h-8 flex justify-center items-center absolute top-5 right-4 font-press-start leading-none'>
                    <span>X</span>
                </button> */}
            </div>
        </div >
    )
}