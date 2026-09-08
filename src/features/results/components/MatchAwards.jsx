import { memo } from 'react';
import Card from '@/components/Card/Card.js';
import { resultPresentation } from '../resultUtils.js';

const MatchAwards = memo(function MatchAwards({ awards, resultType }) {
    if (awards.length === 0) return null;
    const { headingClass } = resultPresentation[resultType];

    return <section className="bg-white border-4 border-block shadow-lg/30"><h2 className={`${headingClass} header-text text-white py-4 text-2xl font-press-start text-center`}>Match Awards</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-8">{awards.map((award, index) => <div key={`${award.label}-${award.card.id}-${index}`} className="default-tile p-4 md:pb-6 border-4 border-black"><div className="text-center mb-4"><span className="font-press-start text-xs line-clamp-2 min-h-[34px]">{award.label}</span></div><div className="flex justify-center"><div className="w-[72px] md:w-[124px] drop-shadow-md/15"><Card pokemonCard={award.card} isDraggable={false} /></div></div></div>)}</div></section>;
});

export default MatchAwards;
