import { usePathname } from 'next/navigation';
import { useGameContext } from '@/contexts/GameContext';
import Link from 'next/link'
import TieImage from "@/assets/images/tie.webp";
import Image from 'next/image'
import { GAME_MODES } from '@/constants/gameModes';
import Card from "@/components/Card/Card.js"

export default function Tie({ matchAwards, debugMode = false }) {
    const pathname = usePathname();
    const { selectedGameMode } = useGameContext();

    const isQuickplay = pathname?.includes('quickplay') ?? false;

    return (
        <div className='fade-in h-full bg-linear-to-b from-transparent from-10% via-normal to-normal-400 flex flex-col'>
            <div className="font-bold px-16 py-6 flex justify-center">
                <Image loading="eager" draggable={false} width={1315} height={777} alt="Pokemon Flip logo" className='max-w-lg' src={TieImage} />
            </div>
            <div className='p-10 h-full'>
                {selectedGameMode === GAME_MODES.QUICK_PLAY.id || isQuickplay && (
                    <div className='size-full'>
                        {matchAwards && matchAwards.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-press-start text-center mb-6">
                                    Match Awards
                                </h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {matchAwards.map((award, index) => (
                                        <div key={index} className="default-tile p-4 py-8 border-4 border-black">
                                            {/* Award Title */}
                                            <div className="text-center mb-3">
                                                <span className="font-press-start text-sm">
                                                    {award.label}
                                                </span>
                                            </div>

                                            {/* Award Card */}
                                            <div className="flex justify-center">
                                                <div className="w-[124px]">
                                                    <Card pokemonCard={award.card} isDraggable={false} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="relative group text-center font-press-start text-lg">
                            <div className={`arrow absolute -left-4 top-1 -translate-y-1/2 transition-opacity ${selectedGameMode === GAME_MODES.QUICK_PLAY.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`} />
                            <Link className={`cursor-pointer`} href={`${isQuickplay ? "/quickplay" : "/career"}/select`}>Play Again?</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}