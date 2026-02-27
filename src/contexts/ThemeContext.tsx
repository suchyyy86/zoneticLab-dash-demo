import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';
type FontSize = 'S' | 'M' | 'L';

export type AccentColor = {
    name: string;
    hex: string;
    hslLight: string;
    hslDark: string;
};

export const ACCENT_COLORS: AccentColor[] = [
    { name: 'Blue', hex: '#004AAC', hslLight: '216 100% 34%', hslDark: '216 100% 50%' },
    { name: 'Purple', hex: '#7c3aed', hslLight: '262 83% 58%', hslDark: '262 83% 65%' },
    { name: 'Green', hex: '#059669', hslLight: '161 94% 30%', hslDark: '161 94% 40%' },
    { name: 'Red', hex: '#dc2626', hslLight: '0 72% 51%', hslDark: '0 72% 60%' },
    { name: 'Orange', hex: '#ea580c', hslLight: '25 95% 47%', hslDark: '25 95% 55%' },
    { name: 'Teal', hex: '#0891b2', hslLight: '191 91% 36%', hslDark: '191 91% 45%' },
];

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    accentColor: AccentColor;
    setAccentColor: (color: AccentColor) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('zl-theme') as Theme) || 'light';
        }
        return 'light';
    });

    const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('zl-accent');
            if (saved) return JSON.parse(saved);
        }
        return ACCENT_COLORS[0];
    });

    const [fontSize, setFontSizeState] = useState<FontSize>(() => {
        if (typeof window !== 'undefined') {
            return (localStorage.getItem('zl-fontsize') as FontSize) || 'M';
        }
        return 'M';
    });

    useEffect(() => {
        const root = document.documentElement;

        // Handle theme
        const applyTheme = (t: Theme) => {
            root.classList.remove('light', 'dark');
            const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            root.classList.add(isDark ? 'dark' : 'light');

            // Apply accent color based on resolved theme
            const colorValue = isDark ? accentColor.hslDark : accentColor.hslLight;
            root.style.setProperty('--primary', colorValue);
            root.style.setProperty('--ring', colorValue);
            root.style.setProperty('--sidebar-primary', colorValue);
            root.style.setProperty('--sidebar-ring', colorValue);
            root.style.setProperty('--chart-1', colorValue);
        };

        applyTheme(theme);
        localStorage.setItem('zl-theme', theme);
        localStorage.setItem('zl-accent', JSON.stringify(accentColor));

        // Listen for system changes if set to system
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('system');
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme, accentColor]);

    useEffect(() => {
        const root = document.documentElement;
        // Handle font size by changing base rem size
        const sizes = { S: '90%', M: '100%', L: '110%' };
        root.style.fontSize = sizes[fontSize];
        localStorage.setItem('zl-fontsize', fontSize);
    }, [fontSize]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme: setThemeState, accentColor, setAccentColor: setAccentColorState, fontSize, setFontSize: setFontSizeState }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
}
