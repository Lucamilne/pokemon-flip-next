import { memo } from 'react';
import PixelDocument from '@/assets/svg/PixelDocument';
import styles from '@/retro.module.css';

const MobileProfileToggle = memo(function MobileProfileToggle({ showProfilesOnMobile, onSetShowProfilesOnMobile, onShowProfile }) {
    return (
        <div className='absolute bottom-0 bg-black/50 border-t-4 border-black w-full'>
            <div className='font-press-start text-white text-sm py-2.5 px-3 gap-2 flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <button
                        title="Menu"
                        aria-label="Menu"
                        disabled={!showProfilesOnMobile}
                        onClick={onShowProfile}
                        className={`flex items-center justify-center overflow-hidden ${showProfilesOnMobile ? 'cursor-pointer opacity-100' : 'opacity-50'}`}
                    >
                        <PixelDocument className="w-5 h-5 mb-1" />
                    </button>
                    <span>Show Profiles?</span>
                </div>
                <div className='flex gap-2'>
                    <label>
                        <input
                            type="radio"
                            className={`${styles['nes-radio']} ${styles['is-dark']}`}
                            name="answer"
                            checked={showProfilesOnMobile}
                            onChange={() => onSetShowProfilesOnMobile(true)}
                        />
                        <span>Yes</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            className={`${styles['nes-radio']} ${styles['is-dark']}`}
                            name="answer"
                            checked={!showProfilesOnMobile}
                            onChange={() => onSetShowProfilesOnMobile(false)}
                        />
                        <span>No</span>
                    </label>
                </div>
            </div>
        </div>
    );
});

export default MobileProfileToggle;
