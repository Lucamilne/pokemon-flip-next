import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function usePlayAgain() {
    const navigate = useNavigate();
    const timerRef = useRef(null);
    const [isPokeballOpen, setIsPokeballOpen] = useState(true);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const playAgain = useCallback(() => {
        setIsPokeballOpen(false);
        timerRef.current = setTimeout(() => navigate('/quickplay/select'), 600);
    }, [navigate]);

    return { isPokeballOpen, playAgain };
}
