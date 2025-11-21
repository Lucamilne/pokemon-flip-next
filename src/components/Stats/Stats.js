import { useMemo } from 'react';

export default function Stats({ stats, originalStats }) {
    const conditionalClass = (index) => {
        const stat = stats[index];
        const originalStat = originalStats[index];

        if (stat > 9) {
            return 'text-yellow-500';
        } else if (stat > originalStat) {
            return 'text-green-500';
        } else if (stat < originalStat) {
            return 'text-red-500';
        } else {
            return 'text-white';
        }
    };

    const formattedStats = useMemo(() => {
        return stats.map(value => value > 9 ? 'A' : value);
    }, [stats]);

    return (
        <div className="absolute top-0 left-0 bg-linear-to-b from-black/15 to-transparent px-1 pb-1 w-full flex">
            <div className="mt-0.5 font-mono text-xs lg:text-base z-20 font-bold leading-none text-shadow-md/50 flex flex-col justify-between text-center">                <div className={conditionalClass(1)}>{formattedStats[1]}</div>
                <div className="flex justify-between gap-5 lg:gap-6">
                    <div className={`${conditionalClass(0)}`}>{formattedStats[0]}</div>
                    <div className={`${conditionalClass(2)}`}>{formattedStats[2]}</div>
                </div>
                <div className={conditionalClass(3)}>{formattedStats[3]}</div>
            </div>
        </div>
    );
}