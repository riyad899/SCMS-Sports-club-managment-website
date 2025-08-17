import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../Context/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-ghost btn-circle text-current hover:bg-opacity-20 hover:bg-white transition-all duration-300 ease-in-out border-2 ${
        isDark 
          ? 'border-gray-500 hover:border-yellow-300 hover:shadow-lg hover:shadow-yellow-300/20' 
          : 'border-gray-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-400/20'
      }`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <FaSun 
          size={20} 
          className="text-yellow-300 hover:text-yellow-200 transition-colors duration-300" 
        />
      ) : (
        <FaMoon 
          size={20} 
          className="text-blue-100 hover:text-white transition-colors duration-300" 
        />
      )}
    </button>
  );
};

export default ThemeToggle;