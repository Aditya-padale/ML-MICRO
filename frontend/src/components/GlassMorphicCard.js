import React from 'react';
import { Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';

const GlassMorphicCard = ({ children, sx, ...props }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        rotateX: 2,
        rotateY: 2,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      style={{ 
        perspective: 1000,
        transformStyle: 'preserve-3d'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(25px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(
                135deg,
                rgba(0, 212, 255, 0.03) 0%,
                rgba(255, 107, 157, 0.03) 50%,
                rgba(0, 230, 118, 0.03) 100%
              )
            `,
            zIndex: -1,
          },
          
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow: `
              0 16px 48px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              inset 0 -1px 0 rgba(0, 0, 0, 0.1),
              0 0 0 1px rgba(0, 212, 255, 0.1)
            `,
            
            '&::before': {
              background: `
                linear-gradient(
                  135deg,
                  rgba(0, 212, 255, 0.05) 0%,
                  rgba(255, 107, 157, 0.05) 50%,
                  rgba(0, 230, 118, 0.05) 100%
                )
              `,
            }
          },
          
          ...sx
        }}
        {...props}
      >
        {/* Subtle gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            zIndex: 1,
          }}
        />
        
        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          {children}
        </Box>
        
        {/* Bottom highlight */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.2), transparent)',
            zIndex: 1,
          }}
        />
      </Paper>
    </motion.div>
  );
};

export default GlassMorphicCard;
