import React, { createContext, useState } from 'react'
import { lightTheme, darkTheme } from './theme';


export const Darkmode = createContext();

export const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? JSON.parse(savedTheme) : lightTheme;
    });

    const toggleTheme = () => {
        const newTheme = theme === lightTheme ? darkTheme : lightTheme;
        setTheme(newTheme);
        localStorage.setItem('theme', JSON.stringify(newTheme));
    };

    return (
        <Darkmode.Provider value={{ theme, toggleTheme }}>
            {children}
        </Darkmode.Provider>
    )
}
