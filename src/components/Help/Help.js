import styles from './retro.module.css'

export default function Help({ customClass, text = "Help is on the way!", direction = "from-left" }) {
    return (
        <div className={`${styles['nes-balloon']} ${styles[direction]} ${customClass}`}>
            <p className='font-press-start'>{text}</p>
        </div>
    )
}