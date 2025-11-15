import Image from 'next/image'
import { typeTiles } from '@/utils/typeIcons'
import { typeBackgrounds } from '@/utils/typeBackgrounds'

export default function TheGrid({ cells }) {
    return (
        < div className="grid shadow grid-cols-3 mx-12" id="grid" >
            {
                Object.keys(cells).map((value, key) => (
                    <div
                        key={key}
                        className={`relative dropzone aspect-square border-2 border-black p-2 ${value.class} ${value.element ? typeBackgrounds[value.element] : 'bg-white/30'}`}
                        data-cell={key}
                    >
                        {value.element && (
                            <Image
                                className="absolute w-1/3 h-1/3 inset-1/2 transform -translate-x-1/2 -translate-y-1/2"
                                src={typeTiles[value.element]}
                                width={100}
                                height={100}
                                alt={`${value.element} type tile`}
                            />
                        )}
                    </div>
                ))
            }
        </div>
    )
}