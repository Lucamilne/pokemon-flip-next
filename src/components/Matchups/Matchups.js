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

    return (
        <div className='grid grid-cols-18 grid-rows-18'>
            {/* Empty corner cell */}
            <div className='border'></div>

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
                                className={`border p-2 text-center ${effectiveness === 'super' ? 'bg-green-500' :
                                    effectiveness === 'immune' ? 'bg-gray-500' :
                                        effectiveness === 'not-effective' ? 'bg-red-500' :
                                            'bg-white'
                                    }`}
                            >
                                {effectiveness === 'super' ? '2x' :
                                    effectiveness === 'immune' ? '0x' :
                                        effectiveness === 'not-effective' ? '0.5x' :
                                            '1x'}
                            </div>
                        );
                    })}
                </React.Fragment>
            ))}
        </div>
    )
}