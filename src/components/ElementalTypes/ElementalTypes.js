import { typeIcons } from '@/utils/typeIcons'

export default function ElementalTypes({ types }) {
    return (
        <div className="absolute top-1 right-1 z-10">
            {types.map(type => (
                <img draggable={false} key={type} width={32} height={18} src={typeIcons[type]} className="w-7 md:w-10" alt={`${type} type`} />
            ))}
        </div>
    );
}