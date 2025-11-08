import React from 'react';
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

const FloatingElements = () => {
  const elements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
    x: Math.random() * 100,
    y: Math.random() * 100
  }));

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    >
      {elements.map((element) => (
        <motion.div
          key={element.id}
          style={{
            position: 'absolute',
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height: element.size,
            borderRadius: '50%',
            background: `linear-gradient(135deg, 
              rgba(0, 212, 255, 0.1) 0%, 
              rgba(255, 107, 157, 0.1) 50%, 
              rgba(0, 230, 118, 0.1) 100%)`,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Floating geometric shapes */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`geo-${i}`}
          style={{
            position: 'absolute',
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            width: 40 + i * 10,
            height: 40 + i * 10,
            border: '2px solid rgba(0, 212, 255, 0.2)',
            borderRadius: i % 2 === 0 ? '50%' : '10%',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            borderColor: [
              'rgba(0, 212, 255, 0.2)',
              'rgba(255, 107, 157, 0.2)',
              'rgba(0, 230, 118, 0.2)',
              'rgba(0, 212, 255, 0.2)'
            ]
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </Box>
  );
};

export default FloatingElements;
