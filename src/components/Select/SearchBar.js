import { memo } from 'react';
import PixelX from '@/assets/svg/PixelX';
import PixelSort from '@/assets/svg/PixelSort';
import styles from '@/retro.module.css';

const basePath = import.meta.env.PROD ? '/pokemon-flip-next' : '';

const HELPER_TEXT_CHARS = 'Choose your hand!'.split('');

const INPUT_BORDER_STYLE = {
    borderImageSource: `url('${basePath}/images/border-image.png')`,
    borderImageSlice: '12',
    borderImageWidth: '12px',
    borderImageOutset: '6px',
    borderImageRepeat: 'initial'
};

const SearchBar = memo(function SearchBar({ searchString, onSearchChange, sortByStrength, onToggleSort }) {
    return (
        <div className="px-7 py-4 md:pb-6 flex justify-between gap-4 items-center hand-top-container pb-7 md:pb-8">
            <div className="relative flex gap-2 font-press-start">
                <input
                    type="text"
                    id="search"
                    className={`${styles['snes-input']} w-full md:w-auto`}
                    autoComplete="off"
                    style={INPUT_BORDER_STYLE}
                    placeholder='Search Cards'
                    value={searchString}
                    onChange={(e) => onSearchChange(e.target.value)}
                    maxLength={12}
                />
                {searchString !== "" ? (
                    <button
                        onClick={() => onSearchChange('')}
                        className="px-1 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 text-lg leading-none"
                        aria-label="Clear search"
                    >
                        <PixelX className="w-7 h-7 stroke-neutral-600 hover:stroke-neutral-900 fill-neutral-600 hover:fill-neutral-900" />
                    </button>
                ) : (
                    <button
                        onClick={onToggleSort}
                        aria-label="Toggle sort"
                        title="Toggle Sort by Strength"
                        className="px-1 cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 text-lg leading-none"
                    >
                        <PixelSort className={`w-7 h-7 transition-colors stroke-neutral-900 fill-neutral-900 ${sortByStrength ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} />
                    </button>
                )}
            </div>
            <h1 className="hidden md:block text-right header-text text-xl lg:text-2xl text-hop">
                {HELPER_TEXT_CHARS.map((char, index) => (
                    <span key={index} style={{ animationDelay: `${(index + 1) * 50}ms` }}>{char}</span>
                ))}
            </h1>
        </div>
    );
});

export default SearchBar;
