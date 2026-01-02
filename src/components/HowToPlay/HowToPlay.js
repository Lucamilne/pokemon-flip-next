import { useState } from 'react'
import SlideA from "@/components/HowToPlay/Slides/A";
import SlideB from "@/components/HowToPlay/Slides/B";
import SlideC from "@/components/HowToPlay/Slides/C";
import SlideD from "@/components/HowToPlay/Slides/D";
import SlideE from "@/components/HowToPlay/Slides/E";
import SlideF from "@/components/HowToPlay/Slides/F";

import PokemonBallSprite from '@/assets/icons/tiers/Bag_Poké_Ball_Sprite.png'
import GreatBallSprite from '@/assets/icons/tiers/Bag_Great_Ball_Sprite.png'
import UltraBallSprite from '@/assets/icons/tiers/Bag_Ultra_Ball_Sprite.png'
import MasterBallSprite from '@/assets/icons/tiers/Bag_Master_Ball_Sprite.png'

export default function HowToPlay({ isOpen, onClose }) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const totalSlides = 7

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="relative w-full max-w-4xl h-full lg:max-h-[660px] default-tile border-8 border-black shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div
                    className="flex h-full transition-transform duration-300 ease-in-out text-base"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {/* Slide A */}
                    <div className="min-w-full h-full flex flex-col gap-16 md:gap-8 justify-center md:justify-between p-8 md:px-24 md:p-14">
                        <div className='font-press-start grid grid-cols-1 gap-8 text-sm md:text-base'>
                            <h2 className='font-bold text-lg md:text-2xl text-center'>Game Objective</h2>
                            <p>Control more cards than your opponent by placing yours strategically to capture Pokémon and dominate the arena.
                            </p>
                            <p>
                                On your turn, drag a card to any empty space on the 3x3 grid, where it will battle adjacent opponent cards — choose wisely!
                            </p>
                        </div>
                        <SlideA nextSlide={nextSlide} />
                    </div>

                    {/* Slide B */}
                    <div className="min-w-full h-full flex flex-col gap-16 md:gap-8 justify-center md:justify-between p-8 md:px-24 md:p-14">
                        <div className='font-press-start grid grid-cols-1 gap-8 text-sm md:text-base'>
                            <h2 className='font-bold text-lg md:text-2xl text-center'>Core Combat</h2>
                            <p>Each card has four directional stats; when adjacent cards compare facing stats, the higher stat captures the other card.
                            </p>
                        </div>
                        <SlideB nextSlide={nextSlide} />
                    </div>

                    {/* Slide C */}
                    <div className="min-w-full h-full flex flex-col gap-16 md:gap-8 justify-center md:justify-between p-8 md:px-24 md:p-14">
                        <div className='font-press-start grid grid-cols-1 gap-8 text-sm md:text-base'>
                            <h2 className='font-bold text-lg md:text-2xl text-center'>Elemental Tiles</h2>
                            <p>Some grid spaces have elemental symbols. Placing a card on a
                                matching elemental tile boosts its stats by <span className="text-green-600">+1</span>. Non-matching types
                                get <span className="text-red-500">-1</span>.
                            </p>
                            <p>
                                <span className="text-white py-1 px-3"
                                    style={{ backgroundColor: `var(--color-normal-500)` }}
                                >Normal</span> type Pokemon ignore tile effects.</p>
                        </div>
                        <SlideC nextSlide={nextSlide} />
                    </div>

                    {/* Slide D */}
                    <div className="min-w-full h-full flex flex-col gap-16 md:gap-8 justify-center md:justify-between p-8 md:px-24 md:p-14">
                        <div className='font-press-start grid grid-cols-1 gap-8 text-sm md:text-base'>
                            <h2 className='font-bold text-lg md:text-2xl text-center'>Card Abilities</h2>
                            <p>All Pokémon cards have special abilities that change how they play.</p>
                            <p>Hover over a card with an ability to see what it does!</p>
                        </div>
                        <SlideD nextSlide={nextSlide} />
                    </div>

                    {/* Slide E */}
                    <div className="min-w-full h-full flex flex-col gap-16 md:gap-8 justify-center md:justify-between p-8 md:px-24 md:p-14">
                        <div className='font-press-start grid grid-cols-1 gap-8 text-sm md:text-base'>
                            <h2 className='font-bold text-lg md:text-2xl text-center'>Type Advantages</h2>
                            <p className='font-press-start'>Pokemon types matter! Super-effective attacks (like
                                <span className="text-white py-1 px-3 ml-2"
                                    style={{ backgroundColor: `var(--color-water-500)` }}
                                >Water</span> vs <span className="text-white py-1 px-3"
                                    style={{ backgroundColor: `var(--color-fire-500)` }}
                                >Fire</span>) give you a stat advantage.
                            </p>
                            <p>
                                You will be able to flip a defending card with equal or higher facing stats.
                            </p>
                        </div>
                        <SlideE nextSlide={nextSlide} />
                    </div>
                    {/* Slide F */}
                    <div className="min-w-full h-full flex flex-col gap-16 md:gap-8 justify-center md:justify-between p-8 md:px-24 md:p-14">
                        <div className='font-press-start grid grid-cols-1 gap-8 text-sm md:text-base'>
                            <h2 className='font-bold text-lg md:text-2xl text-center'>Type Immunities</h2>
                            <p>Some types have no effect (like
                                <span className="text-white py-1 px-3 ml-2"
                                    style={{ backgroundColor: `var(--color-ground-500)` }}
                                >Ground</span> vs <span className="text-white py-1 px-3"
                                    style={{ backgroundColor: `var(--color-flying-500)` }}
                                >Flying</span>), and cannot flip defending cards regardless of the stat advantage.</p>
                        </div>
                        <SlideF nextSlide={nextSlide} />
                    </div>
                    {/* Slide G */}
                    <div className="min-w-full h-full p-8 md:px-24 md:p-14 flex flex-col justify-center md:justify-between">
                        <div className='font-press-start grid grid-cols-1 gap-8 text-sm md:text-base'>
                            <h2 className='font-bold text-lg md:text-2xl text-center'>Winning the Game</h2>
                            <p>The game ends when all 9 spaces are filled. The player controlling
                                the most cards wins!
                            </p>
                            <p>
                                Win a round to add all your opponent's cards to your permanent collection. Lose the round, and you must forfeit one of your own cards.
                            </p>
                            <p>Cards you own are marked with a <img className="inline md:size-[24px]" src={PokemonBallSprite} /> icon in the bottom right hand corner.</p>
                            {/* <p>Plan your moves carefully. Every card placed can trigger a rapid change of fortunes!</p> */}
                        </div>
                    </div>
                </div>

                <button onClick={onClose} className='cursor-pointer text-neutral-600 hover:text-neutral-900 leading-none w-8 h-8 flex justify-center items-center absolute top-5 right-4 font-press-start leading-none'>
                    <span>X</span>
                </button>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="cursor-pointer absolute left-4 bottom-3 md:top-1/2 md:-translate-y-1/2 h-10 flex items-center justify-center w-10 disabled:opacity-50 disabled:cursor-auto"
                >
                    <div className='arrow-relative rotate-180' />
                </button>

                <button
                    onClick={nextSlide}
                    disabled={currentSlide === totalSlides - 1}
                    className="cursor-pointer absolute right-4 bottom-3 md:top-1/2 md:-translate-y-1/2 h-10 flex items-center justify-center w-10 disabled:opacity-50 disabled:cursor-auto"
                >
                    <div className='arrow-relative' />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 items-center">
                    {Array.from({ length: totalSlides }, (_, i) => (
                        i === currentSlide ? (
                            <div key={i} className="pokeball-bullet shadow-sm/30" />

                        ) : (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className="cursor-pointer w-4 h-4 rounded-full bg-neutral-400"
                            />
                        )
                    ))}
                </div>
            </div>
        </div >
    )
}