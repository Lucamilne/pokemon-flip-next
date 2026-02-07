import React from 'react';
import gameData from '@/data/game-data.json';
import PixelX from '@/assets/svg/PixelX';
import styles from "./matchups.module.css";

import { typeTiles } from '@/utils/typeIcons'

export default function Matchups({ isOpen, onClose }) {
    const [hoveredRow, setHoveredRow] = React.useState(null);
    const [hoveredCol, setHoveredCol] = React.useState(null);

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

    const getDiagonalGradient = (defendingType, attackingType) => {
        return {
            background: `linear-gradient(225deg,
                var(--color-${defendingType}-400) 0%,
                var(--color-${defendingType}-400) calc(50% - 1px),
                var(--color-${attackingType}-400) calc(50% + 1px),
                var(--color-${attackingType}-400) 100%)`
        };
    };

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 md:p-0" onClick={onClose}>
            <div className="font-press-start default-tile p-1 md:p-2 relative w-full max-w-4xl max-h-[90vh] border-4 md:border-8 border-black shadow-2xl overflow-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
                <h2 className="py-4 md:py-8 font-bold text-lg md:text-2xl text-center">Type Matchups</h2>
                <div className="flex flex-col pr-4 md:pr-8 pb-4 md:pb-8">
                    {/* X-axis label */}
                    <div className="flex items-center justify-center h-4 md:h-8 ml-4 md:ml-8">
                        <span className="text-[9px] md:text-sm">
                            Defending Type
                        </span>
                    </div>
                    <div className="flex">
                        {/* Y-axis label */}
                        <div className="flex w-4 md:w-8 items-center justify-center">
                            <span className="text-[9px] md:text-sm whitespace-nowrap" style={{ transform: 'rotate(-90deg)' }}>
                                Attacking Type
                            </span>
                        </div>
                        <div className={`grid rounded md:rounded-md grid-cols-17 gap-[1px] md:gap-1 grid-rows-17 ${styles['blue-red-divide-dark']} p-1 md:p-1 flex-1`}>
                            {/* Empty corner cell */}
                            <div className={`${styles['blue-red-divide']} rounded md:rounded-md`} />

                            {/* Header row - defending types */}
                            {gameData.types.map((type) => (
                                <div
                                    key={`header-${type}`}
                                    className={`flex justify-center items-center transition-all rounded md:rounded-md ${hoveredCol === type ? '' : 'bg-pokedex-red'
                                        }`}
                                    style={hoveredCol === type ? getBgStyle(type) : undefined}
                                >
                                    <img draggable={false} width={170} height={170} src={typeTiles[type]} title={type} alt={`${type} type`} />
                                </div>
                            ))}

                            {/* Each row: attacking type + effectiveness cells */}
                            {gameData.types.map((attackingType, rowIndex) => (
                                <React.Fragment key={attackingType}>
                                    {/* Row header - attacking type */}
                                    <div
                                        className={`flex justify-center items-center transition-all rounded md:rounded-md ${hoveredRow === attackingType ? '' : 'bg-pokedex-blue'
                                            }`}
                                        style={hoveredRow === attackingType ? getBgStyle(attackingType) : undefined}
                                    >
                                        <img draggable={false} width={170} height={170} src={typeTiles[attackingType]} title={attackingType} alt={`${attackingType} type`} />
                                    </div>

                                    {/* Effectiveness cells for this attacking type */}
                                    {gameData.types.map((defendingType, colIndex) => {
                                        const effectiveness = getEffectiveness(attackingType, defendingType);
                                        const isHoveredCell = hoveredRow === attackingType && hoveredCol === defendingType;

                                        const hoveredRowIndex = gameData.types.indexOf(hoveredRow);
                                        const hoveredColIndex = gameData.types.indexOf(hoveredCol);

                                        const isInHoveredRow = hoveredRow === attackingType && colIndex < hoveredColIndex;
                                        const isInHoveredCol = hoveredCol === defendingType && rowIndex < hoveredRowIndex;

                                        const isDiagonal = rowIndex === colIndex;
                                        const isUpperTriangle = colIndex > rowIndex;
                                        const isLowerTriangle = colIndex < rowIndex;

                                        let bgClass = "";

                                        if (isDiagonal) {
                                            bgClass = styles['blue-red-divide'];
                                        } else if (isUpperTriangle) {
                                            bgClass = "bg-pokedex-red";
                                        } else if (isLowerTriangle) {
                                            bgClass = "bg-pokedex-blue";
                                        }

                                        let cellStyle = undefined;
                                        let appliedBgClass = bgClass;

                                        if (isHoveredCell) {
                                            cellStyle = getDiagonalGradient(defendingType, attackingType);
                                            appliedBgClass = "";
                                        } else if (isInHoveredRow) {
                                            cellStyle = getBgStyle(attackingType);
                                            appliedBgClass = "";
                                        } else if (isInHoveredCol) {
                                            cellStyle = getBgStyle(defendingType);
                                            appliedBgClass = "";
                                        }

                                        return (
                                            <div
                                                key={`${attackingType}-${defendingType}`}
                                                className={`aspect-square rounded md:rounded-md m-0 flex justify-center items-center transition-all cursor-crosshair ${appliedBgClass}`}
                                                style={cellStyle}
                                                title={
                                                    effectiveness === "super" ? "Super Effective" :
                                                        effectiveness === "immune" ? "No Effect" :
                                                            ""
                                                }
                                                onMouseEnter={() => {

                                                    setHoveredRow(attackingType);
                                                    setHoveredCol(defendingType);
                                                }}
                                                onMouseLeave={() => {
                                                    setHoveredRow(null);
                                                    setHoveredCol(null);
                                                }}
                                            >
                                                {effectiveness === "super" && (
                                                    <span className={`${styles.check} scale-40 md:scale-100`}></span>
                                                )}
                                                {effectiveness === "immune" && (
                                                    <span className={`${styles.cross} scale-40 md:scale-100`}></span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                <button onClick={onClose} className='cursor-pointer text-neutral-600 hover:text-neutral-900 leading-none flex justify-center items-center absolute top-3 right-3 md:top-5 md:right-5 font-press-start leading-none'>
                    <PixelX className="size-6 md:size-7 stroke-neutral-600 hover:stroke-neutral-900 fill-neutral-600 hover:fill-neutral-900" />
                </button>
            </div>
        </div >
    )
}