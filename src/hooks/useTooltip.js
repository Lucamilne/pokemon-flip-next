import { useState, useRef, useCallback } from 'react';

// Module-level tracking to prevent multiple tooltips during scroll
let activeTouchId = null;

/**
 * Custom hook for tooltip with hover (desktop) and long-press (mobile)
 * @param {number} longPressDuration - Duration in ms for long press (default: 500)
 * @param {number} hoverDelay - Duration in ms for hover delay on desktop (default: 150)
 * @returns {Object} { isVisible, handlers }
 */
export const useTooltip = (longPressDuration = 500, hoverDelay = 300) => {
    const [isVisible, setIsVisible] = useState(false);
    const longPressTimer = useRef(null);
    const hoverTimer = useRef(null);
    const touchStartPos = useRef({ x: 0, y: 0 });
    const ownsActiveTouch = useRef(false);

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

    // Mobile: Touch start (begin long press)
    const handleTouchStart = useCallback((e) => {
        const touch = e.touches[0];

        // If there's already an active touch (e.g., scrolling), ignore new touchstarts
        if (activeTouchId !== null && activeTouchId !== touch.identifier) {
            return;
        }

        activeTouchId = touch.identifier;
        ownsActiveTouch.current = true;
        touchStartPos.current = { x: touch.clientX, y: touch.clientY };

        longPressTimer.current = setTimeout(() => {
            setIsVisible(true);
        }, longPressDuration);
    }, [longPressDuration]);

    // Mobile: Touch move (cancel if finger moves too much)
    const handleTouchMove = useCallback((e) => {
        // Only process if this instance owns the active touch
        if (!ownsActiveTouch.current) return;

        const touch = e.touches[0];
        const moveThreshold = 10; // pixels

        const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
        const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);

        if (deltaX > moveThreshold || deltaY > moveThreshold) {
            // Finger moved too much, cancel long press and hide tooltip
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
                longPressTimer.current = null;
            }
            setIsVisible(false);
        }
    }, []);

    // Mobile: Touch end (cancel or hide)
    const handleTouchEnd = useCallback(() => {
        if (ownsActiveTouch.current) {
            activeTouchId = null;
            ownsActiveTouch.current = false;
        }

        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
        // Hide tooltip after a delay
        setTimeout(() => setIsVisible(false), 2000);
    }, []);

    // Cleanup on unmount
    const cleanup = useCallback(() => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
        }
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
        cleanup,
    };
};
