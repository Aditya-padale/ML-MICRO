import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Container } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import PsychologyIcon from '@mui/icons-material/Psychology';

const HeroSection = ({ inView }) => {
  const textVariants = {
    hidden: { opacity: 0, y: 100, rotateX: -90 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1
      }
    }
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
        delay: 0.5
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(255, 107, 157, 0.05) 50%, rgba(0, 230, 118, 0.05) 100%)',
      }}
    >
      {/* Animated background elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 107, 157, 0.1) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{ perspective: 1000 }}
        >
          {/* Hero Icons */}
          <motion.div
            variants={iconVariants}
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '2rem', 
              marginBottom: '3rem',
              flexWrap: 'wrap'
            }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.2, 
                rotate: 360,
                filter: 'drop-shadow(0 0 20px #00D4FF)'
              }}
              transition={{ duration: 0.6 }}
              style={{
                padding: '1rem',
                borderRadius: '50%',
                background: 'rgba(0, 212, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 212, 255, 0.3)'
              }}
            >
              <SatelliteAltIcon sx={{ fontSize: '4rem', color: '#00D4FF' }} />
            </motion.div>
            
            <motion.div
              whileHover={{ 
                scale: 1.2, 
                rotate: -360,
                filter: 'drop-shadow(0 0 20px #FF6B9D)'
              }}
              transition={{ duration: 0.6 }}
              style={{
                padding: '1rem',
                borderRadius: '50%',
                background: 'rgba(255, 107, 157, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 107, 157, 0.3)'
              }}
            >
              <PsychologyIcon sx={{ fontSize: '4rem', color: '#FF6B9D' }} />
            </motion.div>
            
            <motion.div
              whileHover={{ 
                scale: 1.2, 
                rotate: 360,
                filter: 'drop-shadow(0 0 20px #00E676)'
              }}
              transition={{ duration: 0.6 }}
              style={{
                padding: '1rem',
                borderRadius: '50%',
                background: 'rgba(0, 230, 118, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 230, 118, 0.3)'
              }}
            >
              <RocketLaunchIcon sx={{ fontSize: '4rem', color: '#00E676' }} />
            </motion.div>
          </motion.div>

          {/* Hero Title */}
          <motion.div variants={textVariants}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '3rem', sm: '4rem', md: '6rem', lg: '7rem' },
                fontWeight: 900,
                mb: 3,
                background: 'linear-gradient(135deg, #00D4FF 0%, #FF6B9D 50%, #00E676 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.05em',
                lineHeight: 0.9,
                textShadow: '0 0 40px rgba(0, 212, 255, 0.3)',
              }}
            >
              🛰️ SATELLITE
            </Typography>
          </motion.div>

          <motion.div
            variants={textVariants}
            style={{ marginBottom: '2rem' }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem', lg: '6rem' },
                fontWeight: 800,
                mb: 4,
                background: 'linear-gradient(135deg, #FF6B9D 0%, #00E676 50%, #00D4FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.04em',
                lineHeight: 0.9,
              }}
            >
              CHANGE DETECTION
            </Typography>
          </motion.div>

          {/* Hero Subtitle */}
          <motion.div variants={textVariants}>
            <Typography
              variant="h4"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 300,
                maxWidth: '900px',
                mx: 'auto',
                mb: 6,
                lineHeight: 1.4,
                fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
              }}
            >
              Harness the power of AI to monitor environmental changes, 
              predict future trends, and generate actionable insights from satellite imagery 
              with cutting-edge machine learning algorithms.
            </Typography>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            variants={textVariants}
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '4rem',
              flexWrap: 'wrap',
              marginTop: '4rem'
            }}
          >
            {[
              { number: '99.7%', label: 'Accuracy' },
              { number: '50M+', label: 'Images Analyzed' },
              { number: '24/7', label: 'Real-time Processing' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.1, y: -10 }}
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  minWidth: '180px'
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    background: index === 0 
                      ? 'linear-gradient(135deg, #00D4FF, #00E676)'
                      : index === 1
                      ? 'linear-gradient(135deg, #FF6B9D, #00D4FF)'
                      : 'linear-gradient(135deg, #00E676, #FF6B9D)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: 1
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                >
                  {stat.label}
                </Typography>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              width: 2,
              height: 40,
              background: 'linear-gradient(to bottom, transparent, #00D4FF, transparent)',
              borderRadius: 2,
            }}
          />
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
