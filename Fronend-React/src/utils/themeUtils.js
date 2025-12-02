export const THEME_STORAGE_KEY = 'shop-theme';

export const deriveInitialTheme = ({ storedTheme = null, systemPrefersDark = false } = {}) => {
    if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
    }
    return systemPrefersDark ? 'dark' : 'light';
};

export const toggleThemeValue = (current = 'light') => (current === 'dark' ? 'light' : 'dark');
