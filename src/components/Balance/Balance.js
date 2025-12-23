export default function Balance({ score }) {
    return (
        <div className="absolute left-6 right-6 md:left-12 md:right-12 bottom-4 md:bottom-6 border-4 border-black h-10 md:h-12">
            <div className="grid grid-cols-10 h-full w-full">
                {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className={i < (score) ? `balance-blue ${i === (score - 1) ? 'border-r-4 border-white' : ''}` : "balance-red"}></div>
                ))}
            </div>
        </div>
    )
}
