import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  Grid, 
  CircularProgress, 
  Snackbar, 
  Alert, 
  Paper,
  IconButton,
  Fab
} from '@mui/material';
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring,
  useMotionValue,
  useVelocity
} from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ImageUpload from './components/ImageUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import FuturePredictions from './components/FuturePredictions';
import Recommendations from './components/Recommendations';
import AIReports from './components/AIReports';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import ParallaxBackground from './components/ParallaxBackground';
import FloatingElements from './components/FloatingElements';
import HeroSection from './components/HeroSection';
import GlassMorphicCard from './components/GlassMorphicCard';
import { uploadAndAnalyze, fetchGradcam, requestReport } from './api';

function App() {
  // Enhanced dark theme with glassmorphism support
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#00D4FF',
        light: '#4DDBFF',
        dark: '#0099CC',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#FF6B9D',
        light: '#FF8FB3',
        dark: '#CC557E',
        contrastText: '#ffffff',
      },
      background: {
        default: '#0A0B1E',
        paper: 'rgba(255, 255, 255, 0.05)',
      },
      text: {
        primary: '#ffffff',
        secondary: '#B0BEC5',
      },
      success: {
        main: '#00E676',
        light: '#33EA82',
        dark: '#00B248',
      },
      warning: {
        main: '#FFB74D',
        light: '#FFC570',
        dark: '#CC924A',
      },
      error: {
        main: '#FF5252',
        light: '#FF7474',
        dark: '#CC4141',
      },
      info: {
        main: '#29B6F6',
        light: '#54C4F7',
        dark: '#2092C4',
      },
    },
    typography: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontWeight: 800,
        letterSpacing: '-0.04em',
        background: 'linear-gradient(135deg, #00D4FF 0%, #FF6B9D 50%, #00E676 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.03em',
      },
      h3: {
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 20,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 25,
            textTransform: 'none',
            fontWeight: 600,
            padding: '12px 32px',
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(255, 107, 157, 0.1) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(255, 107, 157, 0.2) 100%)',
              transform: 'translateY(-2px) scale(1.02)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px) rotateX(5deg)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 16,
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              '& fieldset': {
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
              '&:hover fieldset': {
                border: '1px solid rgba(255, 255, 255, 0.2)',
              },
              '&.Mui-focused fieldset': {
                border: '2px solid #00D4FF',
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
              },
            },
          },
        },
      },
    },
  });

  // State management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [gradcam, setGradcam] = useState(null);
  const [reports, setReports] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Refs and scroll values
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  // Transform values for parallax effects
  const yBg = useTransform(scrollY, [0, 1000], [0, -200]);
  const yText = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Intersection observers for animations
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const [uploadRef, uploadInView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const [resultsRef, resultsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleUploadAnalyze = async (formData, options) => {
    try {
      console.log('Starting analysis...', options);
      setLoading(true);
      setError('');
      
      console.log('Calling uploadAndAnalyze API...');
      const res = await uploadAndAnalyze(formData);
      console.log('API response:', res);
      setData(res);
      
      if (options?.withGradcam) {
        console.log('Fetching GradCAM...');
        const g = await fetchGradcam(formData);
        console.log('GradCAM response:', g);
        setGradcam(g);
      }
      
      if (options?.withReport) {
        console.log('Generating report...');
        const { before, after, analysis } = res;
        const reportRes = await requestReport({
          before_probs: before.probs,
          after_probs: after.probs,
          before_year: before.year,
          after_year: after.year,
          future_years: options.futureYears || 5,
          detail: options.reportDetail || 'Both'
        });
        console.log('Report response:', reportRes);
        setReports(reportRes);
      }
    } catch (e) {
      console.error('Analysis error:', e);
      setError(e.message || 'Failed to analyze');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Animated Background */}
      <ParallaxBackground />
      <FloatingElements />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}
      >
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          
          <Box 
            ref={containerRef}
            sx={{ 
              flexGrow: 1, 
              ml: { xs: 0, md: '280px' }, 
              transition: 'margin 0.3s ease',
              overflow: 'hidden'
            }}
          >
            {/* Hero Section with Parallax */}
            <motion.div
              ref={heroRef}
              style={{ y: yBg, opacity, scale }}
              className="hero-section"
            >
              <HeroSection inView={heroInView} />
            </motion.div>

            <Container maxWidth="xl" sx={{ py: 8, px: { xs: 2, sm: 3, md: 4 }, position: 'relative' }}>
              
              {/* Upload Section */}
              <motion.div
                ref={uploadRef}
                initial={{ opacity: 0, y: 100 }}
                animate={uploadInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <GlassMorphicCard sx={{ mb: 8 }}>
                  <ImageUpload onUpload={handleUploadAnalyze} />
                </GlassMorphicCard>
              </motion.div>

              {/* Loading State with Enhanced Animation */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1, 
                      rotateX: 0,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }
                    }}
                    exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                    style={{ perspective: 1000 }}
                  >
                    <GlassMorphicCard
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        my: 8,
                        p: 8,
                        textAlign: 'center'
                      }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                      >
                        <CircularProgress 
                          size={60} 
                          thickness={3}
                          sx={{ 
                            mb: 4,
                            color: 'primary.main',
                            filter: 'drop-shadow(0 0 10px #00D4FF)'
                          }} 
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            mb: 2, 
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #00D4FF 0%, #FF6B9D 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                          }}
                        >
                          AI Analysis in Progress
                        </Typography>
                        <Typography 
                          variant="h6" 
                          color="text.secondary" 
                          sx={{ 
                            maxWidth: '600px',
                            lineHeight: 1.6,
                            opacity: 0.8
                          }}
                        >
                          Our advanced neural networks are processing your satellite imagery 
                          to detect environmental changes and generate predictive insights...
                        </Typography>
                      </motion.div>
                      
                      {/* Animated Progress Bar */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3, repeat: Infinity }}
                        style={{
                          height: 4,
                          background: 'linear-gradient(90deg, #00D4FF, #FF6B9D, #00E676)',
                          borderRadius: 2,
                          marginTop: 24,
                          maxWidth: 400
                        }}
                      />
                    </GlassMorphicCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Section with Staggered Animation */}
              <AnimatePresence>
                {data && (
                  <motion.div
                    ref={resultsRef}
                    initial={{ opacity: 0 }}
                    animate={resultsInView ? { opacity: 1 } : {}}
                    exit={{ opacity: 0 }}
                  >
                    <Box sx={{ mt: 8 }}>
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={resultsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }}
                      >
                        <Typography 
                          variant="h3" 
                          component="h2" 
                          sx={{ 
                            mb: 6, 
                            textAlign: 'center',
                            fontWeight: 800,
                            background: 'linear-gradient(135deg, #00D4FF 0%, #FF6B9D 50%, #00E676 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                          }}
                        >
                          🚀 Analysis Results
                        </Typography>
                      </motion.div>
                      
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <motion.div
                            initial={{ opacity: 0, y: 60, rotateY: -15 }}
                            animate={resultsInView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            style={{ perspective: 1000 }}
                          >
                            <GlassMorphicCard>
                              <AnalysisDashboard analysis={data} gradcam={gradcam} />
                            </GlassMorphicCard>
                          </motion.div>
                        </Grid>
                        
                        <Grid item xs={12} lg={6}>
                          <motion.div
                            initial={{ opacity: 0, x: -60, rotateY: 15 }}
                            animate={resultsInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            style={{ perspective: 1000 }}
                          >
                            <GlassMorphicCard>
                              <FuturePredictions predictions={data.analysis?.future_trends} />
                            </GlassMorphicCard>
                          </motion.div>
                        </Grid>
                        
                        <Grid item xs={12} lg={6}>
                          <motion.div
                            initial={{ opacity: 0, x: 60, rotateY: -15 }}
                            animate={resultsInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            style={{ perspective: 1000 }}
                          >
                            <GlassMorphicCard>
                              <Recommendations recommendations={data.analysis?.recommendations} />
                            </GlassMorphicCard>
                          </motion.div>
                        </Grid>
                      </Grid>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 60, scale: 0.9 }}
                        animate={resultsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.8 }}
                      >
                        <Box sx={{ mt: 6 }}>
                          <GlassMorphicCard>
                            <AIReports report={reports?.full_report} summary={reports?.summary_report} />
                          </GlassMorphicCard>
                        </Box>
                      </motion.div>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>

              <Footer />
            </Container>
          </Box>
        </Box>

        {/* Scroll to Top FAB */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                zIndex: 1000
              }}
            >
              <Fab
                color="primary"
                onClick={scrollToTop}
                sx={{
                  background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(255, 107, 157, 0.2) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(255, 107, 157, 0.3) 100%)',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <KeyboardArrowUpIcon />
              </Fab>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity="error" 
          onClose={() => setError('')}
          sx={{ 
            borderRadius: 3,
            minWidth: 350,
            background: 'rgba(255, 82, 82, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 82, 82, 0.3)',
            color: '#fff',
            '& .MuiAlert-icon': {
              color: '#FF5252'
            }
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
