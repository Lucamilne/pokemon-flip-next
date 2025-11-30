import React from 'react';
import gameData from '@/data/game-data.json';
import Image from 'next/image'
import { typeIcons } from '@/utils/typeIcons'

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
        return { backgroundColor: `var(--color-${type}-500)` };
    };

    return (
        <div className='grid grid-cols-18 grid-rows-18'>
            {/* Empty corner cell */}
            <div />

            {/* Header row - defending types */}
            {gameData.types.map((type) => (
                <div key={`header-${type}`} className='flex justify-center items-center'>
                    <Image draggable={false} key={type} width={48} height={18} src={typeIcons[type]} alt={`${type} type`} />
                </div>
            ))}

            {/* Each row: attacking type + effectiveness cells */}
            {gameData.types.map((attackingType) => (
                <React.Fragment key={attackingType}>
                    {/* Row header - attacking type */}
                    <div className='flex justify-center items-center'>
                        <Image draggable={false} key={attackingType} width={48} height={18} src={typeIcons[attackingType]} alt={`${attackingType} type`} />
                    </div>

                    {/* Effectiveness cells for this attacking type */}
                    {gameData.types.map((defendingType) => {
                        const effectiveness = getEffectiveness(attackingType, defendingType);
                        return (
                            <div
                                key={`${attackingType}-${defendingType}`}
                                className={`aspect-square rounded text-[10px] text-center m-0 flex justify-center items-center text-white ${effectiveness === 'super' ? 'grass-tile' :
                                    effectiveness === 'immune' ? 'steel-tile' :
                                        ''
                                    }`}
                            >
                                {effectiveness === 'super' ? 'Effective' :
                                    effectiveness === 'immune' ? 'No Effect' : '' }
                            </div>
                        );
                    })}
                </React.Fragment>
            ))}
        </div>
    )
}