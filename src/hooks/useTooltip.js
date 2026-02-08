import { useState, useRef, useCallback, useEffect } from 'react';

// Module-level ref to dismiss the currently active tooltip
let activeTooltipDismiss = null;

/**
 * Custom hook for tooltip with hover (desktop) and tap-to-toggle (mobile)
 * @param {number} hoverDelay - Duration in ms for hover delay on desktop (default: 300)
 * @returns {Object} { isVisible, handlers }
 */
export const useTooltip = (hoverDelay = 300) => {
    const [isVisible, setIsVisible] = useState(false);
    const hoverTimer = useRef(null);
    const touchStartPos = useRef({ x: 0, y: 0 });
    const isTap = useRef(false);

    const dismiss = useCallback(() => {
        setIsVisible(false);
    }, []);

    // When this tooltip becomes visible, dismiss any other active tooltip
    useEffect(() => {
        if (isVisible) {
            if (activeTooltipDismiss && activeTooltipDismiss !== dismiss) {
                activeTooltipDismiss();
            }
            activeTooltipDismiss = dismiss;

            // Dismiss on any outside touch
            const handleOutsideTouch = () => {
                setIsVisible(false);
                activeTooltipDismiss = null;
            };

            document.addEventListener('touchend', handleOutsideTouch);
            return () => document.removeEventListener('touchend', handleOutsideTouch);
        } else if (activeTooltipDismiss === dismiss) {
            activeTooltipDismiss = null;
        }
    }, [isVisible, dismiss]);

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (hoverTimer.current) clearTimeout(hoverTimer.current);
            if (activeTooltipDismiss === dismiss) activeTooltipDismiss = null;
        };
    }, [dismiss]);

    // Desktop: Mouse enter
    const handleMouseEnter = useCallback(() => {
        hoverTimer.current = setTimeout(() => {
            setIsVisible(true);
        }, hoverDelay);
    }, [hoverDelay]);

    // Desktop: Mouse leave
    const handleMouseLeave = useCallback(() => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
        }
        setIsVisible(false);
    }, []);

    // Mobile: Track touch start position to distinguish taps from drags
    const handleTouchStart = useCallback((e) => {
        const touch = e.touches[0];
        touchStartPos.current = { x: touch.clientX, y: touch.clientY };
        isTap.current = true;
    }, []);

    // Mobile: If finger moves, it's not a tap
    const handleTouchMove = useCallback((e) => {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
        const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

        if (deltaX > 10 || deltaY > 10) {
            isTap.current = false;
        }
    }, []);

    // Mobile: Toggle tooltip on tap (not drag)
    const handleTouchEnd = useCallback((e) => {
        if (!isTap.current) return;

        // Stop the document-level touchstart listener from immediately dismissing
        e.stopPropagation();

        setIsVisible(prev => !prev);
    }, []);

    return {
        isVisible,
        handlers: {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
        },
    };
};
