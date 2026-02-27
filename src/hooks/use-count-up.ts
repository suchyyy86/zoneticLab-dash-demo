import { useState, useEffect, useRef } from 'react';

export function useCountUp(end: number, duration = 1200, startOnMount = true) {
    const [value, setValue] = useState(0);
    const startedRef = useRef(false);

    useEffect(() => {
        if (!startOnMount || startedRef.current) return;
        startedRef.current = true;

        const startTime = performance.now();
        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(end * eased));

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    }, [end, duration, startOnMount]);

    return value;
}
