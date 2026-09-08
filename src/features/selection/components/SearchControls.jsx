import PixelSort from '@/assets/svg/PixelSort';
import PixelX from '@/assets/svg/PixelX';
import styles from '@/retro.module.css';

const basePath = import.meta.env.PROD ? '/pokemon-flip-next' : '';
const inputBorderStyle = { borderImageSource: `url('${basePath}/images/border-image.png')`, borderImageSlice: '12', borderImageWidth: '12px', borderImageOutset: '6px', borderImageRepeat: 'initial' };

export default function SearchControls({ searchString, onSearchChange, sortByStrength, onToggleSort }) {
    const hasSearch = searchString !== '';
    return (
        <div className="relative flex gap-2 font-press-start">
            <input type="text" id="search" className={`${styles['snes-input']} w-full md:w-auto`} autoComplete="off" style={inputBorderStyle} placeholder="Search Cards" value={searchString} onChange={(event) => onSearchChange(event.target.value)} maxLength={12} />
            <button onClick={hasSearch ? () => onSearchChange('') : onToggleSort} aria-label={hasSearch ? 'Clear search' : 'Toggle sort'} title={hasSearch ? undefined : 'Toggle Sort by Strength'} className="px-1 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 text-lg leading-none">
                {hasSearch ? <PixelX className="w-7 h-7 stroke-neutral-600 hover:stroke-neutral-900 fill-neutral-600 hover:fill-neutral-900" /> : <PixelSort className={`w-7 h-7 transition-colors stroke-neutral-900 fill-neutral-900 ${sortByStrength ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} />}
            </button>
        </div>
    );
}
