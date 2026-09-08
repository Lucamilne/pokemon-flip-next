import { memo } from 'react';
import Card from '@/components/Card/Card.js';
import { resultPresentation } from '../resultUtils.js';

function ResultCardGrid({ children }) {
    return <div className="grid grid-cols-[repeat(auto-fit,72px)] md:grid-cols-[repeat(auto-fit,124px)] place-content-center gap-1 md:gap-4 mt-8">{children}</div>;
}

function RewardOutcome({ rewardCards, victoryMessage }) {
    if (rewardCards.length === 0) {
        return <div className="md:py-18 text-center font-press-start text-sm md:text-base"><p>You already own all the cards you captured!</p></div>;
    }

    return <><div className="font-press-start text-center text-sm md:text-base"><p>{victoryMessage}</p></div><ResultCardGrid>{rewardCards.map((pokemonCard, index) => <div className="relative aspect-square drop-shadow-md/15" key={pokemonCard.id ?? index}><Card pokemonCard={pokemonCard} isPlayerCard index={index} isDraggable startsFaceUp={false} /></div>)}</ResultCardGrid></>;
}

function PenaltyOutcome({ penaltyCard, penaltyCardRef }) {
    if (!penaltyCard) {
        return <div className="md:py-18 text-center font-press-start text-sm md:text-base"><p>Your opponent couldn't find a card worth taking...</p></div>;
    }

    return <><div className="font-press-start text-center text-sm md:text-base"><p>Your opponent claimed the <span className="capitalize">{penaltyCard.name}</span> card from your collection!</p></div><ResultCardGrid><div className="relative aspect-square"><div className="absolute top-1 left-1 bottom-1 right-1 rounded-md m-1 bg-black/15" /><div ref={penaltyCardRef} className="drop-shadow-md/15"><Card pokemonCard={penaltyCard} index={0} isDraggable startsFaceUp /></div></div></ResultCardGrid></>;
}

const ResultOutcome = memo(function ResultOutcome({ resultType, hasPlayerCards, rewardCards, penaltyCard, penaltyCardRef, victoryMessage, tieMessage }) {
    const { heading, headingClass } = resultPresentation[resultType];

    return (
        <section className="bg-white border-4 border-block shadow-lg/30">
            <h2 className={`${headingClass} header-text text-white py-4 text-2xl font-press-start text-center`}>{heading}</h2>
            <div className="p-8">
                {resultType === 'victory' && hasPlayerCards ? <RewardOutcome rewardCards={rewardCards} victoryMessage={victoryMessage} /> : resultType === 'defeat' ? <PenaltyOutcome penaltyCard={penaltyCard} penaltyCardRef={penaltyCardRef} /> : <div className="md:py-18 text-center font-press-start text-sm md:text-base"><p>{tieMessage}</p></div>}
            </div>
        </section>
    );
});

export default ResultOutcome;
