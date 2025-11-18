import styles from './retro.module.css'

export default function HowToPlay() {
    return (
        <section className="fixed inset-0 z-50 w-screen h-screen bg-black/50 flex items-center justify-center">
            <div className="max-w-2xl w-full flex flex-col gap-8">
                <div className="default-tile p-8 border-8 border-black shadow-xl/30 font-press-start text-black">
                    <h2 className="text-2xl font-bold mb-4">How to Play</h2>
                    <div className={`${styles['nes-balloon']} ${styles['from-left']}`}>
                        <p>Hello NES.css</p>
                    </div>
                </div>
            </div>
        </section>
    )
}