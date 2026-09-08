import styles from '@/retro.module.css';

export default function ProfilePreference({ showProfilesOnMobile, onSetShowProfilesOnMobile }) {
    return <div className="flex gap-2"><label><input type="radio" className={`${styles['nes-radio']} ${styles['is-dark']}`} name="answer" checked={showProfilesOnMobile} onChange={() => onSetShowProfilesOnMobile(true)} /><span>Yes</span></label><label><input type="radio" className={`${styles['nes-radio']} ${styles['is-dark']}`} name="answer" checked={!showProfilesOnMobile} onChange={() => onSetShowProfilesOnMobile(false)} /><span>No</span></label></div>;
}
