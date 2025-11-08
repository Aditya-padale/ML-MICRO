import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  Avatar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  AppBar,
  Toolbar,
  Badge,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardActions,
  Fab,
  Tooltip,
  Snackbar,
  Alert,
  LinearProgress,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  CloudUpload,
  Analytics,
  Settings,
  Notifications,
  AccountCircle,
  Search,
  LightMode,
  DarkMode,
  FileUpload,
  Timeline,
  Assessment,
  Satellite,
  Psychology,
  TrendingUp,
  Refresh,
  Download,
  Share,
  Close,
  CheckCircle,
  Info,
  FilterList,
  ViewList,
  ViewModule,
  Add
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './components/ImageUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import FuturePredictions from './components/FuturePredictions';
import Recommendations from './components/Recommendations';
import AIReports from './components/AIReports';
import Footer from './components/Footer';
import { uploadAndAnalyze, fetchGradcam, requestReport } from './api';

const ModernSatelliteApp = () => {
  // State management
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [gradcam, setGradcam] = useState(null);
  const [reports, setReports] = useState(null);
  
  const isMobile = useMediaQuery('(max-width:768px)');

  // Modern, clean theme
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#2563eb',
        light: '#60a5fa',
        dark: '#1d4ed8',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#7c3aed',
        light: '#a78bfa',
        dark: '#5b21b6',
        contrastText: '#ffffff',
      },
      background: {
        default: '#f8fafc',
        paper: '#ffffff',
      },
      text: {
        primary: '#1e293b',
        secondary: '#64748b',
      },
      grey: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
    },
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '3.5rem',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.875rem',
        lineHeight: 1.3,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        fontSize: '0.875rem',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 20px',
            boxShadow: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
            },
          },
          contained: {
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1d4ed8 0%, #5b21b6 100%)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '& fieldset': {
                borderColor: '#e2e8f0',
              },
              '&:hover fieldset': {
                borderColor: '#cbd5e1',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2563eb',
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: '1px solid #e2e8f0',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      
      {/* Modern App Bar */}
      <AppBar position="fixed" color="inherit">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setSidebarOpen(true)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 800 }}>
                S
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              SatelliteAI
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', minHeight: '100vh', pt: 8 }}>
        <ModernSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <Box sx={{ flexGrow: 1, ml: { xs: 0, md: '280px' } }}>
          <Container maxWidth="xl" sx={{ py: 6, px: { xs: 3, sm: 4, md: 6 } }}>
            
            {/* Hero Section */}
            <Box sx={{ mb: 8, textAlign: 'center' }}>
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  mb: 3,
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Satellite Change Detection
              </Typography>
              <Typography 
                variant="h5" 
                color="text.secondary"
                sx={{ 
                  maxWidth: '700px', 
                  mx: 'auto',
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                Advanced AI-powered analysis of satellite imagery to detect environmental changes 
                and predict future trends with precision.
              </Typography>
            </Box>

            {/* Upload Section */}
            <Box sx={{ mb: 8 }}>
              <ModernImageUpload onUpload={handleUploadAnalyze} />
            </Box>

            {/* Loading State */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Paper 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      alignItems: 'center', 
                      my: 6,
                      p: 6,
                      textAlign: 'center'
                    }}
                  >
                    <CircularProgress 
                      size={48} 
                      thickness={4}
                      sx={{ mb: 3, color: 'primary.main' }} 
                    />
                    <Typography 
                      variant="h6" 
                      sx={{ mb: 1, fontWeight: 600 }}
                    >
                      Analyzing Images
                    </Typography>
                    <Typography color="text.secondary">
                      Processing your satellite imagery with AI...
                    </Typography>
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Section */}
            <AnimatePresence>
              {data && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Box sx={{ mt: 8 }}>
                    <Typography 
                      variant="h3" 
                      component="h2" 
                      sx={{ 
                        mb: 6, 
                        textAlign: 'center',
                        fontWeight: 700,
                        color: 'text.primary'
                      }}
                    >
                      Analysis Results
                    </Typography>
                    
                    <Grid container spacing={4}>
                      <Grid item xs={12}>
                        <AnalysisDashboard analysis={data} gradcam={gradcam} />
                      </Grid>
                      
                      <Grid item xs={12} lg={6}>
                        <FuturePredictions predictions={data.analysis?.future_trends} />
                      </Grid>
                      
                      <Grid item xs={12} lg={6}>
                        <Recommendations recommendations={data.analysis?.recommendations} />
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 6 }}>
                      <AIReports report={reports?.full_report} summary={reports?.summary_report} />
                    </Box>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            <Footer />
          </Container>
        </Box>
      </Box>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
          >
            <Fab
              size="medium"
              onClick={scrollToTop}
              sx={{
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            >
              <KeyboardArrowUpIcon />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity="error" 
          onClose={() => setError('')}
          sx={{ borderRadius: 2 }}
        >
          {error}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
