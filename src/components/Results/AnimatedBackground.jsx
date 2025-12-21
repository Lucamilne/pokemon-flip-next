import { useEffect, useRef } from 'react';

export default function AnimatedBackground({ isPlayerVictory }) {
    const canvasRef = useRef(null);
    const animStateRef = useRef(0);
    const gridRef = useRef(null);
    const xDispRef = useRef([]);
    const yDispRef = useRef([]);
    const nbxRef = useRef(0);
    const nbyRef = useRef(0);

    useEffect(() => {
        const step = 10;
        const side = 9;
        const nbDiffByStep = 1000;

        const canv = canvasRef.current;
        if (!canv) return;

        const ctx = canv.getContext('2d');
        let animationId;

        const intAlea = (min, max) => {
            if (typeof max == 'undefined') {
                max = min;
                min = 0;
            }
            return Math.floor(min + (max - min) * Math.random());
        };

        const drawCell = (kx, ky) => {
            ctx.fillStyle = gridRef.current[ky][kx];
            ctx.fillRect(xDispRef.current[kx], yDispRef.current[ky], side, side);
        };

        const xchg = () => {
            let dir, x, y;
            let kx = intAlea(nbxRef.current);
            let ky = intAlea(nbyRef.current);

            do {
                dir = intAlea(4);
                x = kx + [1, 0, -1, 0][dir];
                y = ky + [0, 1, 0, -1][dir];
            } while (x < 0 || x >= nbxRef.current || y < 0 || y >= nbyRef.current);

            [gridRef.current[ky][kx], gridRef.current[y][x]] = [gridRef.current[y][x], gridRef.current[ky][kx]];

            drawCell(kx, ky);
            drawCell(x, y);
        };

        const createGrid = () => {
            const reds = ['#fff', '#f79999', '#f05555', '#e61919', '#c20a0a', '#901a22']
            const blues = ['#fff', '#99c9f5', '#5ca3eb', '#197de6', '#0a64c2', '#224590'];
            const grays = ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4',
                '#a3a3a3', '#737373'];
            const colours = isPlayerVictory ? blues : isPlayerVictory === false ? reds : grays;

            gridRef.current = [];
            for (let ky = 0; ky < nbyRef.current; ++ky) {
                gridRef.current[ky] = [];
                for (let kx = 0; kx < nbxRef.current; ++kx) {
                    const colorIndex = Math.floor((ky / nbyRef.current) * colours.length);
                    gridRef.current[ky][kx] = colours[colorIndex];
                    drawCell(kx, ky);
                }
            }
        };

        const startOver = () => {
            const rect = canv.parentElement.getBoundingClientRect();
            const maxx = rect.width;
            const maxy = rect.height;

            ctx.canvas.width = maxx;
            ctx.canvas.height = maxy;
            ctx.imageSmoothingEnabled = false;

            nbxRef.current = Math.ceil(maxx / step);
            nbyRef.current = Math.ceil(maxy / step);

            if (nbxRef.current < 10 || nbyRef.current < 10) return false;

            xDispRef.current = [];
            let offs = (maxx - nbxRef.current * step) / 2;
            for (let kx = 0; kx < nbxRef.current; ++kx) {
                xDispRef.current[kx] = offs + kx * step;
            }

            yDispRef.current = [];
            offs = (maxy - nbyRef.current * step) / 2;
            for (let ky = 0; ky < nbyRef.current; ++ky) {
                yDispRef.current[ky] = offs + ky * step;
            }

            createGrid();
            return true;
        };

        const animate = () => {
            switch (animStateRef.current) {
                case 0:
                    if (startOver()) ++animStateRef.current;
                    break;
                case 1:
                    for (let k = 0; k < nbDiffByStep; ++k) xchg();
            }
            animationId = window.requestAnimationFrame(animate);
        };

        const handleResize = () => {
            animStateRef.current = 0;
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationId) {
                window.cancelAnimationFrame(animationId);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ position: 'absolute' }}
        />
    );
}
