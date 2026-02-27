import { useState, useEffect, useRef } from 'react';

export function useCountUp(end: number, duration = 1200, startOnMount = true) {
    const [value, setValue] = useState(0);
    const prevEndRef = useRef(0);

    useEffect(() => {
        if (!startOnMount) return;

        const from = prevEndRef.current;
        prevEndRef.current = end;

        const startTime = performance.now();
        let raf: number;
        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(from + (end - from) * eased));

            if (progress < 1) {
                raf = requestAnimationFrame(step);
            }
        };
        raf = requestAnimationFrame(step);

        return () => cancelAnimationFrame(raf);
    }, [end, duration, startOnMount]);

    return value;
}
