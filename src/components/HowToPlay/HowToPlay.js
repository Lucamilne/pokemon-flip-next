import { useState } from 'react'
import SlideA from "@/components/HowToPlay/Slides/A";
import SlideB from "@/components/HowToPlay/Slides/B";
import SlideC from "@/components/HowToPlay/Slides/C";
import SlideD from "@/components/HowToPlay/Slides/D";
import SlideE from "@/components/HowToPlay/Slides/E";

export default function HowToPlay({ isOpen, onClose }) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const totalSlides = 6

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
            {/* Modal Container */}
            <div className="relative w-full max-w-4xl h-[800px] default-tile border-8 border-black shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div
                    className="flex h-full transition-transform duration-300 ease-in-out text-base"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {/* Slide A */}
                    <div className="min-w-full h-full flex flex-col gap-8 justify-around px-24 py-12">
                        <div className='grid grid-cols-1 gap-4'>
                            <p className='font-press-start'>Control more cards than your opponent by placing yours strategically to capture Pokémon and dominate the arena.
                            </p>
                            <p className='font-press-start'>
                                On your turn, drag a card to any empty space on the 3x3 grid, where it will battle adjacent opponent cards — choose wisely!
                            </p>
                        </div>
                        <SlideA />
                    </div>

                    {/* Slide B */}
                    <div className="min-w-full h-full flex flex-col gap-8 justify-around px-24 py-12">
                        <p className='font-press-start'>Each card has four directional stats; when adjacent cards compare facing stats, the higher stat captures the other card.
                        </p>
                        <SlideB />
                    </div>

                    {/* Slide C */}
                    <div className="min-w-full h-full flex flex-col gap-8 justify-around px-24 py-12">
                        <p className='font-press-start'>Some grid spaces have elemental symbols. Placing a card on a
                            matching elemental tile boosts its stats by <span className="text-green-600">+1</span>. Non-matching types
                            get <span className="text-red-500">-1</span>. Normal-type Pokemon ignore tile effects.</p>
                        <SlideC />
                    </div>

                    {/* Slide D */}
                    <div className="min-w-full h-full flex flex-col gap-8 justify-around px-24 py-12">
                        <p className='font-press-start'>Pokemon types matter! Super-effective attacks (like Fire vs Grass)
                            give you a stat advantage. You will be able to flip a defending card with equal or higher stats.
                            Some types have no effect, and cannot flip defending cards, no matter the stat advantage.</p>
                        <SlideD />
                    </div>
                    {/* Slide E */}
                    <div className="min-w-full h-full flex flex-col gap-8 justify-around px-24 py-12">
                        <p className='font-press-start'>Some types have no effect, and cannot flip defending cards, no matter the stat advantage.</p>
                        <SlideE />
                    </div>

                    {/* Slide F */}
                    <div className="min-w-full h-full flex items-center justify-center px-24 py-12">
                        <p className='font-press-start'>The game ends when all 9 spaces are filled. The player controlling
                            the most cards wins! Plan your moves carefully. Every card placed
                            can trigger a rapid change of fortunes!</p>
                    </div>
                </div>

                <button onClick={onClose} className='cursor-pointer text-neutral-600 hover:text-neutral-900 leading-none w-8 h-8 flex justify-center items-center absolute top-5 right-4 font-press-start leading-none'>
                    <span>X</span>
                </button>

                {/* Navigation Buttons */}
                <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 h-10 flex items-center justify-center w-10 disabled:opacity-50 disabled:cursor-auto"
                >
                    <div className='arrow rotate-180' />
                </button>

                <button
                    onClick={nextSlide}
                    disabled={currentSlide === totalSlides - 1}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 h-10 flex items-center justify-center w-10 disabled:opacity-50 disabled:cursor-auto"
                >
                    <div className='arrow' />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 items-center">
                    {Array.from({ length: totalSlides }, (_, i) => (
                        i === currentSlide ? (
                            <div key={i} className="slide-in-fwd-center pokeball-bullet shadow-sm/30" />

                        ) : (
                            <button
                                key={i}
                                onClick={() => setCurrentSlide(i)}
                                className="cursor-pointer w-3 h-3 rounded-full bg-neutral-400"
                            />
                        )
                    ))}
                </div>
            </div>
        </div>
    )
}