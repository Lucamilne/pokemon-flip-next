export default function Light({ isPlayerTurn }) {
    return (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 ">
            <svg viewBox="0 0 24.5 25" className='w-28 h-28'>
                <g transform="translate(181.5, -100.5)">
                    <circle r="11.9063" cy="113.5067" cx="-169.0352" />
                    <g className={isPlayerTurn ? "pokedex__big-blue" : "pokedex__big-red"} transform="translate(-79.1172 -28.3928)">
                        <circle cx="-90.3628" cy="141.0601" r="11.9063" />
                        <path d="M-102.2692 141.0601a11.9062 11.9062 0 0011.9062 11.9063A11.9062 11.9062 0 00-78.4567 141.06z" />
                        <circle className="pokedex__shine" cx="-90.3628" cy="141.0601" r="10.0542" />
                        <circle className="pokedex__outline" r="9.0147" cy="141.0601" cx="-90.3628" />
                        <circle cx="-90.3628" cy="141.0601" r="7.9375" />
                        <path d="M-90.363 133.1226a7.9375 7.9375 0 00-7.9375 7.9375 7.9375 7.9375 0 003.2965 6.4301 8.8061 8.472 0 002.3027.3044 8.8061 8.472 0 008.8062-8.4718 8.8061 8.472 0 00-1.122-4.1171 7.9375 7.9375 0 00-5.3459-2.083z" />
                        <circle className="pokedex__shine" cx="-91.9407" cy="140.9146" r="1.2027" fill="#fff" />
                        <circle className="pokedex__shine" cx="-93.678" cy="137.1728" r="2.1382" fill="#fff" />
                    </g>
                </g>
            </svg>
        </div>
    )
}