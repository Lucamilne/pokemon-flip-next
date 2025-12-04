export default function Balance({ score }) {
    return (
        <div className="absolute left-8 right-8 bottom-8 border-4 border-black h-12">
            <div className="grid grid-cols-10 h-full w-full">
                {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className={i < (score) ? `balance-blue ${i === (score - 1) ? 'border-r-4 border-white' : ''}` : "balance-red"}></div>
                ))}
            </div>
        </div>
    )
}
