import { memo } from 'react';
import { resultPresentation } from '../resultUtils.js';

const ResultHero = memo(function ResultHero({ resultType }) {
    const { image } = resultPresentation[resultType];

    return <img loading="eager" draggable={false} width={1315} height={777} alt="Pokemon Flip logo" className="md:w-1/2 mx-auto drop-shadow-md/30" src={image} />;
});

export default ResultHero;
