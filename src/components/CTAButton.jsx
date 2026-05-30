import React from 'react';
import { motion } from 'framer-motion';

const CTAButton = ({ children, variant = 'primary', onClick, className = '' }) => {
  const isPrimary = variant === 'primary';
  
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        boxShadow: isPrimary 
          ? '0 0 25px rgba(0, 243, 255, 0.6), 0 0 10px rgba(0, 243, 255, 0.4)' 
          : '0 0 25px rgba(189, 0, 255, 0.6), 0 0 10px rgba(189, 0, 255, 0.4)',
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: 'spring',
        stiffness: 400,
        damping: 15,
      }}
      className={`
        relative px-8 py-3.5 rounded-xl font-semibold tracking-wider text-sm transition-all duration-300
        overflow-hidden flex items-center justify-center gap-2 group
        ${isPrimary 
          ? 'bg-cyber-neonCyan text-cyber-bg border border-cyber-neonCyan shadow-cyan-glow' 
          : 'bg-cyber-glass text-white border border-cyber-neonViolet/50 backdrop-blur-cyber hover:border-cyber-neonViolet'
        }
        ${className}
      `}
    >
      {/* Laser line sheen animation */}
      <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
      
      {/* Corner brackets for sci-fi UI feel */}
      <span className={`absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 group-hover:w-3 group-hover:h-3 ${isPrimary ? 'border-cyber-bg' : 'border-cyber-neonViolet'}`} />
      <span className={`absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 group-hover:w-3 group-hover:h-3 ${isPrimary ? 'border-cyber-bg' : 'border-cyber-neonViolet'}`} />
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
    </motion.button>
  );
};

export default CTAButton;
