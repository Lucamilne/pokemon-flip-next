import PixelChevronDown from '@/assets/svg/PixelChevronDown';

const pokemonTypes = new Set([
    'bug', 'dark', 'dragon', 'electric', 'fairy', 'fighting', 'fire', 'flying',
    'ghost', 'grass', 'ground', 'ice', 'normal', 'poison', 'psychic', 'rock',
    'steel', 'water',
]);



export default function CardHoverOverlay({ type }) {
    return (
        <div className="absolute inset-1 md:inset-2 animate-[bounce_0.8s_ease-out_infinite] [animation-delay:-0.4s] pointer-events-none z-10">
            <div className="size-full border-5 border-dashed border-neutral-700">
                <div
                    className="relative flex size-full items-center justify-center border-neutral-600 bg-neutral-200/75 p-1 md:p-2"
                >
                    <PixelChevronDown className="size-24 text-neutral-700" />
                </div>
            </div>
        </div>
    );
}
