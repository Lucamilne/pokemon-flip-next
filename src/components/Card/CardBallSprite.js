import React from 'react';
import PokemonBallSprite from '@/assets/icons/tiers/Bag_Poké_Ball_Sprite.png'
import GreatBallSprite from '@/assets/icons/tiers/Bag_Great_Ball_Sprite.png'
import UltraBallSprite from '@/assets/icons/tiers/Bag_Ultra_Ball_Sprite.png'
import MasterBallSprite from '@/assets/icons/tiers/Bag_Master_Ball_Sprite.png'

const getBallSprite = (statWeight) => {
    if (statWeight < 395) return PokemonBallSprite;
    if (statWeight < 500) return GreatBallSprite;
    if (statWeight < 600) return UltraBallSprite;
    return MasterBallSprite;
};

function CardBallSprite({ isOwned, statWeight }) {
    if (!isOwned) return null;

    return (
        <img
            width={24}
            height={24}
            alt="Player owned card"
            className="size-[14px] md:size-[24px] absolute bottom-0 right-0"
            src={getBallSprite(statWeight)}
            style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
        />
    );
}

export default CardBallSprite;
