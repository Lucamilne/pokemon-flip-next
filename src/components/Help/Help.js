import styles from './retro.module.css'

export default function Help({ customClass, text = "Help is on the way!" }) {
    return (
        <div className={`${styles['nes-balloon']} ${styles['from-left']} ${customClass}`}>
            <p className='font-press-start'>{text}</p>
        </div>
    )
}