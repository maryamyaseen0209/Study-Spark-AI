import { motion } from 'framer-motion';
import { pageTransition } from '../lib/animations.js';

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}