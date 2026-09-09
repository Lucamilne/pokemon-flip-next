import PixelCalculator from '@/assets/svg/PixelCalculator';
import PixelGamepad from '@/assets/svg/PixelGamepad';

export default function BoardControls({ isMobile, onOpenHowToPlay, onOpenMatchups }) {
    const iconClass = isMobile ? 'w-6 h-6' : 'w-7 h-7';
    const buttonClass = `${isMobile ? '' : 'hover:scale-110 transition-transform '}cursor-pointer flex items-center justify-center overflow-hidden`;

    return (
        <div className="absolute top-3 right-3">
            <div className="flex flex-col items-center">
                <button title="How to Play" onClick={onOpenHowToPlay} className={buttonClass}>
                    <PixelGamepad className={`${iconClass} drop-shadow`} />
                </button>
                <button title="Type Matchups" onClick={onOpenMatchups} className={buttonClass}>
                    <PixelCalculator className={`${iconClass} drop-shadow`} />
                </button>
            </div>
        </div>
    );
}
