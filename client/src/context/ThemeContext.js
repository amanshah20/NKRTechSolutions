import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // light, dark
  const [eyeProtection, setEyeProtection] = useState(false);

  // Load theme settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedEyeProtection = localStorage.getItem('eyeProtection') === 'true';
    
    setTheme(savedTheme);
    setEyeProtection(savedEyeProtection);
    
    applyTheme(savedTheme, savedEyeProtection);
  }, []);

  const applyTheme = (newTheme, eyeProtectionEnabled) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-light', 'theme-dark', 'eye-protection');
    
    // Apply new theme
    root.classList.add(`theme-${newTheme}`);
    
    if (eyeProtectionEnabled) {
      root.classList.add('eye-protection');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme, eyeProtection);
  };

  const toggleEyeProtection = () => {
    const newEyeProtection = !eyeProtection;
    setEyeProtection(newEyeProtection);
    localStorage.setItem('eyeProtection', newEyeProtection);
    applyTheme(theme, newEyeProtection);
  };

  const setCustomTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme, eyeProtection);
  };

  const value = {
    theme,
    eyeProtection,
    toggleTheme,
    toggleEyeProtection,
    setCustomTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
