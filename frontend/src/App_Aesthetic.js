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
  Fab,
  Snackbar,
  Alert,
  LinearProgress,
  CircularProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  Stack,
  Slide
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
  Palette,
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
  Add,
  KeyboardArrowUp,
  Brightness6
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './components/ImageUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import FuturePredictions from './components/FuturePredictions';
import Recommendations from './components/Recommendations';
import AIReports from './components/AIReports';
import Footer from './components/Footer';
import { uploadAndAnalyze, fetchGradcam, requestReport } from './api';

const AestheticSatelliteApp = () => {
  // State management
  const [themeMode, setThemeMode] = useState('pink'); // 'pink' or 'blue'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [gradcam, setGradcam] = useState(null);
  const [reports, setReports] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isMobile = useMediaQuery('(max-width:768px)');

  // Aesthetic theme with pink/blue gradients
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: themeMode === 'pink' ? '#ff6b9d' : '#3b82f6',
        light: themeMode === 'pink' ? '#ff8fb3' : '#60a5fa',
        dark: themeMode === 'pink' ? '#cc557e' : '#1d4ed8',
      },
      secondary: {
        main: themeMode === 'pink' ? '#c084fc' : '#06b6d4',
        light: themeMode === 'pink' ? '#ddd6fe' : '#67e8f9',
        dark: themeMode === 'pink' ? '#9333ea' : '#0891b2',
      },
      background: {
        default: themeMode === 'pink' 
          ? 'linear-gradient(135deg, #1a0d1f 0%, #2d1b3d  50%, #1f0a24 100%)'
          : 'linear-gradient(135deg, #0f1629 0%, #1e3a5f 50%, #0a1220 100%)',
        paper: themeMode === 'pink'
          ? 'rgba(255, 107, 157, 0.08)'
          : 'rgba(59, 130, 246, 0.08)',
      },
      text: {
        primary: '#ffffff',
        secondary: themeMode === 'pink' ? '#fce7f3' : '#e0f2fe',
      },
    },
    typography: {
      fontFamily: '"Inter", "SF Pro Display", -apple-system, sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.025em',
        background: themeMode === 'pink'
          ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
          : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      h6: {
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background: themeMode === 'pink'
              ? 'linear-gradient(135deg, #1a0d1f 0%, #2d1b3d 50%, #1f0a24 100%)'
              : 'linear-gradient(135deg, #0f1629 0%, #1e3a5f 50%, #0a1220 100%)',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 24px',
            fontWeight: 600,
            textTransform: 'none',
            background: themeMode === 'pink'
              ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(192, 132, 252, 0.2))'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
            boxShadow: `0 8px 32px ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
            '&:hover': {
              background: themeMode === 'pink'
                ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.3), rgba(192, 132, 252, 0.3))'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3))',
              transform: 'translateY(-2px)',
              boxShadow: `0 12px 40px ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
            },
          },
          contained: {
            background: themeMode === 'pink'
              ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
              : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            '&:hover': {
              background: themeMode === 'pink'
                ? 'linear-gradient(135deg, #ff8fb3, #ddd6fe)'
                : 'linear-gradient(135deg, #60a5fa, #67e8f9)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            background: themeMode === 'pink'
              ? 'rgba(255, 107, 157, 0.08)'
              : 'rgba(59, 130, 246, 0.08)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
            boxShadow: `0 8px 32px ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`,
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 20px 60px ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            background: themeMode === 'pink'
              ? 'rgba(255, 107, 157, 0.08)'
              : 'rgba(59, 130, 246, 0.08)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: themeMode === 'pink'
              ? 'rgba(26, 13, 31, 0.8)'
              : 'rgba(15, 22, 41, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
            boxShadow: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              background: themeMode === 'pink'
                ? 'rgba(255, 107, 157, 0.05)'
                : 'rgba(59, 130, 246, 0.05)',
              backdropFilter: 'blur(10px)',
              '& fieldset': {
                border: `1px solid ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
              },
              '&:hover fieldset': {
                border: `1px solid ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
              },
              '&.Mui-focused fieldset': {
                border: `2px solid ${themeMode === 'pink' ? '#ff6b9d' : '#3b82f6'}`,
                boxShadow: `0 0 20px ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
              },
            },
          },
        },
      },
    },
  });

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard />, badge: null },
    { id: 'upload', label: 'Upload Images', icon: <CloudUpload />, badge: null },
    { id: 'analysis', label: 'Analysis Results', icon: <Analytics />, badge: data ? 'new' : null },
    { id: 'predictions', label: 'AI Predictions', icon: <Timeline />, badge: null },
    { id: 'reports', label: 'Generated Reports', icon: <Assessment />, badge: reports ? '1' : null },
  ];

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadAnalyze = async (formData, options) => {
    try {
      setLoading(true);
      setError('');
      
      const res = await uploadAndAnalyze(formData);
      setData(res);
      
      if (options?.withGradcam) {
        const g = await fetchGradcam(formData);
        setGradcam(g);
      }
      
      if (options?.withReport) {
        const { before, after, analysis } = res;
        const reportRes = await requestReport({
          before_probs: before.probs,
          after_probs: after.probs,
          before_year: before.year,
          after_year: after.year,
          future_years: options.futureYears || 5,
          detail: options.reportDetail || 'Both'
        });
        setReports(reportRes);
      }
      
      setActiveView('analysis');
      
    } catch (e) {
      console.error('Analysis error:', e);
      setError(e.message || 'Failed to analyze');
    } finally {
      setLoading(false);
    }
  };

  // Animated background component
  const AnimatedBackground = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        background: themeMode === 'pink'
          ? 'linear-gradient(135deg, #1a0d1f 0%, #2d1b3d 30%, #1f0a24 60%, #2d1b3d 100%)'
          : 'linear-gradient(135deg, #0f1629 0%, #1e3a5f 30%, #0a1220 60%, #1e3a5f 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: themeMode === 'pink'
            ? `
              radial-gradient(circle at 20% 20%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(192, 132, 252, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(255, 107, 157, 0.08) 0%, transparent 50%)
            `
            : `
              radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)
            `,
          animation: 'backgroundMove 20s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `
            linear-gradient(90deg, transparent 0%, ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.03)' : 'rgba(59, 130, 246, 0.03)'} 50%, transparent 100%)
          `,
          animation: 'scan 8s linear infinite',
        },
        '@keyframes backgroundMove': {
          '0%, 100%': {
            transform: 'translateX(0%) translateY(0%)',
          },
          '50%': {
            transform: 'translateX(5%) translateY(3%)',
          },
        },
        '@keyframes scan': {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      }}
    />
  );

  // Header Component
  const AestheticHeader = () => (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <IconButton
          edge="start"
          onClick={() => setDrawerOpen(true)}
          sx={{ 
            mr: 2, 
            display: { md: 'none' },
            color: 'primary.main'
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Box
            sx={{
              width: 45,
              height: 45,
              borderRadius: 3,
              background: themeMode === 'pink'
                ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
                : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              boxShadow: `0 8px 25px ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
            }}
          >
            <Satellite sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>
              EuroSAT AI
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
              Advanced Analytics
            </Typography>
          </Box>
          <Chip 
            label="Pro" 
            size="small" 
            sx={{ 
              ml: 2,
              background: themeMode === 'pink'
                ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
                : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              color: 'white',
              fontSize: '0.7rem',
              height: 22,
              fontWeight: 600
            }}
          />
        </Box>

        {/* Search */}
        <TextField
          size="small"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mr: 2,
            display: { xs: 'none', sm: 'block' },
            minWidth: 200,
          }}
        />

        {/* Theme Toggle */}
        <IconButton 
          onClick={() => setThemeMode(themeMode === 'pink' ? 'blue' : 'pink')}
          sx={{ 
            mr: 1,
            background: themeMode === 'pink'
              ? 'rgba(255, 107, 157, 0.2)'
              : 'rgba(59, 130, 246, 0.2)',
            '&:hover': {
              background: themeMode === 'pink'
                ? 'rgba(255, 107, 157, 0.3)'
                : 'rgba(59, 130, 246, 0.3)',
            }
          }}
        >
          <Palette sx={{ color: 'primary.main' }} />
        </IconButton>

        {/* Notifications */}
        <IconButton sx={{ mr: 1 }}>
          <Badge badgeContent={2} color="error">
            <Notifications sx={{ color: 'primary.main' }} />
          </Badge>
        </IconButton>

        {/* Profile */}
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar 
            sx={{ 
              width: 35, 
              height: 35,
              background: themeMode === 'pink'
                ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
                : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              fontWeight: 700
            }}
          >
            AI
          </Avatar>
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 3,
              background: themeMode === 'pink'
                ? 'rgba(255, 107, 157, 0.1)'
                : 'rgba(59, 130, 246, 0.1)',
              backdropFilter: 'blur(20px)',
            }
          }}
        >
          <MenuItem>Profile Settings</MenuItem>
          <MenuItem>Preferences</MenuItem>
          <MenuItem>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );

  // Sidebar Component
  const AestheticSidebar = () => (
    <>
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
        PaperProps={{
          sx: {
            background: themeMode === 'pink'
              ? 'rgba(26, 13, 31, 0.95)'
              : 'rgba(15, 22, 41, 0.95)',
            backdropFilter: 'blur(20px)',
            border: 'none',
          }
        }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, px: 2 }}>
            <Satellite sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
              EuroSAT AI
            </Typography>
            <IconButton sx={{ ml: 'auto' }} onClick={() => setDrawerOpen(false)}>
              <Close sx={{ color: 'primary.main' }} />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => {
                    setActiveView(item.id);
                    setDrawerOpen(false);
                  }}
                  selected={activeView === item.id}
                  sx={{
                    borderRadius: 3,
                    '&.Mui-selected': {
                      background: themeMode === 'pink'
                        ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(192, 132, 252, 0.1))'
                        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.1))',
                      color: 'primary.main',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: activeView === item.id ? 'primary.main' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: activeView === item.id ? 600 : 500,
                      fontSize: '0.9rem'
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        background: themeMode === 'pink'
                          ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
                          : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                        color: 'white',
                        fontSize: '0.7rem'
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: 280,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          background: themeMode === 'pink'
            ? 'rgba(26, 13, 31, 0.8)'
            : 'rgba(15, 22, 41, 0.8)',
          backdropFilter: 'blur(20px)',
          borderRight: `1px solid ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              fontWeight: 700, 
              color: 'text.secondary',
              fontSize: '0.75rem',
              letterSpacing: '0.1em'
            }}
          >
            Navigation
          </Typography>
          <List sx={{ mt: 2 }}>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => setActiveView(item.id)}
                  selected={activeView === item.id}
                  sx={{
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&.Mui-selected': {
                      background: themeMode === 'pink'
                        ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(192, 132, 252, 0.1))'
                        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.1))',
                      color: 'primary.main',
                      boxShadow: `0 4px 20px ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                    },
                    '&:hover': {
                      background: themeMode === 'pink'
                        ? 'rgba(255, 107, 157, 0.1)'
                        : 'rgba(59, 130, 246, 0.1)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: activeView === item.id ? 'primary.main' : 'text.secondary',
                    minWidth: 40
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: activeView === item.id ? 600 : 500,
                      fontSize: '0.9rem'
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        background: themeMode === 'pink'
                          ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
                          : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                        color: 'white',
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ px: 3, pb: 3 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              fontWeight: 700, 
              color: 'text.secondary',
              fontSize: '0.75rem',
              letterSpacing: '0.1em'
            }}
          >
            AI Status
          </Typography>
          <Card sx={{ mt: 2, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Psychology sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
                Model Ready
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              System operational
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={98} 
              sx={{ 
                borderRadius: 2,
                height: 6,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  background: themeMode === 'pink'
                    ? 'linear-gradient(90deg, #ff6b9d, #c084fc)'
                    : 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                  borderRadius: 2,
                }
              }} 
            />
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, mt: 1, display: 'block' }}>
              98% Accuracy
            </Typography>
          </Card>
        </Box>
      </Box>
    </>
  );

  // Content renderer
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
              Dashboard Overview
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { title: 'Total Analyses', value: '1,247', change: '+12%', icon: <Analytics /> },
                { title: 'AI Accuracy', value: '98.7%', change: '+0.3%', icon: <CheckCircle /> },
                { title: 'Processing Time', value: '2.4s', change: '-15%', icon: <TrendingUp /> },
                { title: 'Active Models', value: '4', change: '+1', icon: <Psychology /> },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} lg={3} key={stat.title}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          p: 1, 
                          borderRadius: 2, 
                          background: themeMode === 'pink'
                            ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(192, 132, 252, 0.1))'
                            : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.1))',
                          mr: 2
                        }}>
                          {React.cloneElement(stat.icon, { sx: { color: 'primary.main' } })}
                        </Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          {stat.title}
                        </Typography>
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'white' }}>
                        {stat.value}
                      </Typography>
                      <Chip
                        label={stat.change}
                        size="small"
                        sx={{
                          background: themeMode === 'pink'
                            ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
                            : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: 600
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        );

      case 'upload':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
              Upload & Analysis
            </Typography>
            <Card sx={{ overflow: 'visible' }}>
              <ImageUpload onUpload={handleUploadAnalyze} />
            </Card>
          </motion.div>
        );

      case 'analysis':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
              Analysis Results
            </Typography>
            {data ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <AnalysisDashboard analysis={data} gradcam={gradcam} />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <FuturePredictions predictions={data.analysis?.future_trends} />
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <Recommendations recommendations={data.analysis?.recommendations} />
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <Analytics sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                    No Analysis Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Upload satellite images to start analyzing environmental changes
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setActiveView('upload')}
                    startIcon={<CloudUpload />}
                    size="large"
                  >
                    Start Analysis
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        );

      case 'reports':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
              Generated Reports
            </Typography>
            {reports ? (
              <Card>
                <AIReports report={reports?.full_report} summary={reports?.summary_report} />
              </Card>
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <Assessment sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                    No Reports Generated
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reports will be generated after completing an analysis
                  </Typography>
                </CardContent>
              </Card>
            )}
          </motion.div>
        );

      default:
        return (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              Select a section from the sidebar
            </Typography>
          </Box>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AnimatedBackground />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
        <AestheticHeader />
        
        <Box sx={{ display: 'flex', flex: 1 }}>
          <AestheticSidebar />
          
          {/* Main Content */}
          <Box sx={{ 
            flex: 1, 
            p: { xs: 2, sm: 3, md: 4 },
            minHeight: 'calc(100vh - 64px)'
          }}>
            <Container maxWidth="xl" sx={{ p: 0 }}>
              {/* Loading State */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card sx={{ p: 4, mb: 4, textAlign: 'center' }}>
                      <CircularProgress 
                        size={50} 
                        sx={{ 
                          mb: 2,
                          '& .MuiCircularProgress-circle': {
                            stroke: `url(#gradient-${themeMode})`
                          }
                        }} 
                      />
                      <svg width={0} height={0}>
                        <defs>
                          <linearGradient id={`gradient-${themeMode}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={themeMode === 'pink' ? '#ff6b9d' : '#3b82f6'} />
                            <stop offset="100%" stopColor={themeMode === 'pink' ? '#c084fc' : '#06b6d4'} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                        Processing Analysis...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        AI is analyzing your satellite images with advanced algorithms
                      </Typography>
                      <LinearProgress 
                        sx={{ 
                          mt: 3, 
                          borderRadius: 2,
                          height: 6,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: themeMode === 'pink'
                              ? 'linear-gradient(90deg, #ff6b9d, #c084fc)'
                              : 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                            borderRadius: 2,
                          }
                        }} 
                      />
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Content */}
              {renderContent()}
            </Container>
          </Box>
        </Box>

        {/* Floating Action Button */}
        <Fab
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            background: themeMode === 'pink'
              ? 'linear-gradient(135deg, #ff6b9d, #c084fc)'
              : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: `0 12px 30px ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`,
            },
            display: { xs: 'flex', md: 'none' }
          }}
          onClick={() => setActiveView('upload')}
        >
          <Add sx={{ color: 'white' }} />
        </Fab>

        {/* Scroll to Top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              style={{
                position: 'fixed',
                bottom: isMobile ? 88 : 24,
                right: isMobile ? 88 : 88,
                zIndex: 1000
              }}
            >
              <Fab 
                size="small" 
                onClick={scrollToTop}
                sx={{
                  background: themeMode === 'pink'
                    ? 'rgba(255, 107, 157, 0.8)'
                    : 'rgba(59, 130, 246, 0.8)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    background: themeMode === 'pink'
                      ? 'rgba(255, 107, 157, 1)'
                      : 'rgba(59, 130, 246, 1)',
                  }
                }}
              >
                <KeyboardArrowUp sx={{ color: 'white' }} />
              </Fab>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Snackbar */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError('')}
        >
          <Alert 
            severity="error" 
            onClose={() => setError('')}
            sx={{
              background: themeMode === 'pink'
                ? 'rgba(255, 107, 157, 0.1)'
                : 'rgba(59, 130, 246, 0.1)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${themeMode === 'pink' ? 'rgba(255, 107, 157, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
              color: 'white'
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

function App() {
  return <AestheticSatelliteApp />;
}

export default App;
