import Image from 'next/image'
import { typeIcons } from '@/utils/typeIcons'

export default function ElementalTypes({ types }) {
    return (
        <div className="absolute top-1 right-1">
            {types.map(type => (
                <Image draggable={false} key={type} width={48} height={18} src={typeIcons[type]} alt={`${type} type`} />
            ))}
        </div>
    );
}