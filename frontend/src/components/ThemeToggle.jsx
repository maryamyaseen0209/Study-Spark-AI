import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      role="switch"
      aria-checked={isDark}
    >
      <span className="sr-only">{isDark ? 'Light mode' : 'Dark mode'}</span>
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md ${
          isDark
            ? 'bg-slate-600 text-amber-300 translate-x-7'
            : 'bg-white text-amber-400 translate-x-0'
        }`}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.span>
    </motion.button>
  );
}