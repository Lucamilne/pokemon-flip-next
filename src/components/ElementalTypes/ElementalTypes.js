import { typeIcons } from '@/utils/typeIcons'

export default function ElementalTypes({ types }) {
    return (
        <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 z-10">
            {types.map(type => (
                <img draggable={false} key={type} width={32} height={18} src={typeIcons[type]} className="w-8 md:w-10" alt={`${type} type`} style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }} />
            ))}
        </div>
    );
}