export default function Balance({ score }) {
    return (
        <div className="absolute top-8 bottom-8 right-8 border-4 border-black w-12">
            <div className="grid grid-rows-10 h-full w-full">
                {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className={i < (10 - score) ? "balance-red" : `balance-blue ${i === 10 - score ? 'border-t-4 border-white' : ''}`}></div>
                ))}
            </div>
        </div>
    )
}
