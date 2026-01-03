import { fetchCardById } from "@/utils/cardHelpers.js";
import Card from '../../Card/Card.js';

export default function C({ nextSlide }) {
    const pokemonCards = [fetchCardById(39), fetchCardById(133), fetchCardById(143)];

    return (
        <div className="w-full grid gap-1 md:gap-2 place-content-center grid-cols-[repeat(3,72px)] md:grid-cols-[repeat(3,124px)] bg-linear-to-r from-theme-blue via-white to-theme-blue p-2 md:p-4 border-y-6 border-black">
            {pokemonCards.map((pokemonCard, index) => (
                <div className="relative aspect-square w-[72px] md:w-[124px] rounded-md my-3" key={index}>
                    <Card index={index} pokemonCard={pokemonCard} isPlayerCard={true} isDraggable={true} startsFaceUp={true} />
                </div>
            ))}
        </div>
    )
}