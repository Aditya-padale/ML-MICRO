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
  Brightness6,
  DarkMode,
  LightMode
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
  const [themeMode, setThemeMode] = useState('aurora'); // 'aurora', 'ocean', 'sunset', 'cosmic', 'dark', 'light'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [gradcam, setGradcam] = useState(null);
  const [reports, setReports] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cycleThemes, setCycleThemes] = useState(false);

  const isMobile = useMediaQuery('(max-width:768px)');

  // Theme cycling
  const themes = ['aurora', 'ocean', 'sunset', 'cosmic', 'dark', 'light'];
  const themeIndex = themes.indexOf(themeMode);

  useEffect(() => {
    if (cycleThemes) {
      const interval = setInterval(() => {
        setThemeMode(current => {
          const currentIndex = themes.indexOf(current);
          return themes[(currentIndex + 1) % themes.length];
        });
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [cycleThemes]);

  // Improved color palettes with better contrast
  const getThemeColors = (mode) => {
    switch (mode) {
      case 'aurora':
        return {
          primary: { main: '#6366f1', light: '#8b5cf6', dark: '#4f46e5' },
          secondary: { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed' },
          accent: { main: '#06b6d4', light: '#67e8f9', dark: '#0891b2' },
          background: {
            paper: themeMode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
            glass: themeMode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.7)',
          },
          gradients: {
            primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            secondary: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
            accent: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)',
          },
          glow: themeMode === 'light' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(99, 102, 241, 0.5)',
        };
      case 'ocean':
        return {
          primary: { main: '#0ea5e9', light: '#38bdf8', dark: '#0284c7' },
          secondary: { main: '#06b6d4', light: '#67e8f9', dark: '#0891b2' },
          accent: { main: '#10b981', light: '#34d399', dark: '#059669' },
          background: {
            paper: themeMode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
            glass: themeMode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.7)',
          },
          gradients: {
            primary: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
            secondary: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)',
            accent: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          },
          glow: themeMode === 'light' ? 'rgba(14, 165, 233, 0.3)' : 'rgba(14, 165, 233, 0.5)',
        };
      case 'sunset':
        return {
          primary: { main: '#f97316', light: '#fb923c', dark: '#ea580c' },
          secondary: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
          accent: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
          background: {
            paper: themeMode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
            glass: themeMode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.7)',
          },
          gradients: {
            primary: 'linear-gradient(135deg, #f97316 0%, #f59e0b 100%)',
            secondary: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
            accent: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
          },
          glow: themeMode === 'light' ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.5)',
        };
      case 'cosmic':
        return {
          primary: { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed' },
          secondary: { main: '#ec4899', light: '#f472b6', dark: '#db2777' },
          accent: { main: '#06b6d4', light: '#67e8f9', dark: '#0891b2' },
          background: {
            paper: themeMode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(15, 23, 42, 0.9)',
            glass: themeMode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(15, 23, 42, 0.7)',
          },
          gradients: {
            primary: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
            secondary: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
            accent: 'linear-gradient(135deg, #06b6d4 0%, #67e8f9 100%)',
          },
          glow: themeMode === 'light' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.5)',
        };
      case 'dark':
        return {
          primary: { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb' },
          secondary: { main: '#6b7280', light: '#9ca3af', dark: '#4b5563' },
          accent: { main: '#10b981', light: '#34d399', dark: '#059669' },
          background: {
            paper: 'rgba(15, 23, 42, 0.9)',
            glass: 'rgba(15, 23, 42, 0.7)',
          },
          gradients: {
            primary: 'linear-gradient(135deg, #3b82f6 0%, #6b7280 100%)',
            secondary: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
            accent: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          },
          glow: 'rgba(59, 130, 246, 0.5)',
        };
      case 'light':
        return {
          primary: { main: '#1e40af', light: '#3b82f6', dark: '#1e3a8a' },
          secondary: { main: '#6b7280', light: '#9ca3af', dark: '#4b5563' },
          accent: { main: '#059669', light: '#10b981', dark: '#047857' },
          background: {
            paper: 'rgba(255, 255, 255, 0.9)',
            glass: 'rgba(255, 255, 255, 0.7)',
          },
          gradients: {
            primary: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            secondary: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
            accent: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          },
          glow: 'rgba(30, 64, 175, 0.3)',
        };
      default:
        return getThemeColors('light');
    }
  };

  const currentTheme = getThemeColors(themeMode);

  // Enhanced theme system with better readability
  const theme = createTheme({
    palette: {
      mode: themeMode === 'light' ? 'light' : 'dark',
      primary: currentTheme.primary,
      secondary: currentTheme.secondary,
      background: {
        default: themeMode === 'light' ? '#f8fafc' : '#0f172a',
        paper: currentTheme.background.paper,
      },
      text: {
        primary: themeMode === 'light' ? '#1e293b' : '#f8fafc',
        secondary: themeMode === 'light' ? '#64748b' : '#cbd5e1',
      },
      divider: themeMode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
    },
    typography: {
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      h1: {
        fontWeight: 800,
        letterSpacing: '-0.025em',
        color: themeMode === 'light' ? '#1e293b' : '#f8fafc',
        fontSize: '3.5rem',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
        color: themeMode === 'light' ? '#1e293b' : '#f8fafc',
        fontSize: '2.5rem',
      },
      h3: {
        fontWeight: 700,
        letterSpacing: '-0.015em',
        color: themeMode === 'light' ? '#1e293b' : '#f8fafc',
        fontSize: '2rem',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
        color: themeMode === 'light' ? '#1e293b' : '#f8fafc',
        fontSize: '1.75rem',
      },
      h5: {
        fontWeight: 600,
        letterSpacing: '-0.005em',
        color: themeMode === 'light' ? '#1e293b' : '#f8fafc',
        fontSize: '1.5rem',
      },
      h6: {
        fontWeight: 600,
        color: themeMode === 'light' ? '#1e293b' : '#f8fafc',
        fontSize: '1.25rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        fontWeight: 400,
        color: themeMode === 'light' ? '#475569' : '#cbd5e1',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        fontWeight: 400,
        color: themeMode === 'light' ? '#64748b' : '#94a3b8',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            minHeight: '100vh',
            overflow: 'hidden auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: themeMode === 'light' ? '#f1f5f9' : '#334155',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: themeMode === 'light' ? '#cbd5e1' : '#64748b',
              borderRadius: '4px',
              '&:hover': {
                background: themeMode === 'light' ? '#94a3b8' : '#94a3b8',
              },
            },
          },
          '*': {
            '&::-webkit-scrollbar': {
              width: '6px',
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: themeMode === 'light' ? '#f1f5f9' : '#334155',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: themeMode === 'light' ? '#cbd5e1' : '#64748b',
              borderRadius: '4px',
              '&:hover': {
                background: themeMode === 'light' ? '#94a3b8' : '#94a3b8',
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '10px 24px',
            fontWeight: 500,
            textTransform: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
          contained: {
            background: currentTheme.gradients.primary,
            color: 'white',
            boxShadow: `0 4px 12px ${currentTheme.glow}`,
            '&:hover': {
              boxShadow: `0 8px 20px ${currentTheme.glow}`,
            },
          },
          outlined: {
            borderColor: currentTheme.primary.main,
            color: currentTheme.primary.main,
            '&:hover': {
              backgroundColor: themeMode === 'light' 
                ? `${currentTheme.primary.main}08`
                : `${currentTheme.primary.main}20`,
              borderColor: currentTheme.primary.main,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            background: currentTheme.background.paper,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${themeMode === 'light' ? '#e2e8f0' : '#334155'}`,
            boxShadow: themeMode === 'light' 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: themeMode === 'light'
                ? '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                : '0 20px 30px -5px rgba(0, 0, 0, 0.4), 0 10px 15px -5px rgba(0, 0, 0, 0.1)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            background: currentTheme.background.paper,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${themeMode === 'light' ? '#e2e8f0' : '#334155'}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: themeMode === 'light' 
              ? 'rgba(255, 255, 255, 0.95)' 
              : 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${themeMode === 'light' ? '#e2e8f0' : '#334155'}`,
            boxShadow: themeMode === 'light'
              ? '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.25)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              background: themeMode === 'light' ? '#ffffff' : '#1e293b',
              '& fieldset': {
                borderColor: themeMode === 'light' ? '#d1d5db' : '#475569',
              },
              '&:hover fieldset': {
                borderColor: currentTheme.primary.main,
              },
              '&.Mui-focused fieldset': {
                borderColor: currentTheme.primary.main,
                borderWidth: '2px',
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            '&.MuiChip-filled': {
              background: currentTheme.gradients.primary,
              color: 'white',
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            height: 6,
            backgroundColor: themeMode === 'light' ? '#f1f5f9' : '#334155',
            '& .MuiLinearProgress-bar': {
              background: currentTheme.gradients.primary,
              borderRadius: 4,
            },
          },
        },
      },
      MuiCircularProgress: {
        styleOverrides: {
          root: {
            '& .MuiCircularProgress-circle': {
              stroke: currentTheme.primary.main,
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: themeMode === 'light' 
                ? `${currentTheme.primary.main}08`
                : `${currentTheme.primary.main}20`,
              transform: 'scale(1.05)',
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

  // Clean static background component
  const StaticBackground = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2,
        background: themeMode === 'light' 
          ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: themeMode === 'light'
            ? `radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
               radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)`
            : `radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
               radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)`,
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
              width: 40,
              height: 40,
              borderRadius: 2,
              background: currentTheme.gradients.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              boxShadow: themeMode === 'light' 
                ? '0 2px 4px rgba(0, 0, 0, 0.1)' 
                : '0 4px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Satellite sx={{ color: 'white', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: 'text.primary',
              fontSize: '1.1rem'
            }}>
              EuroSAT AI
            </Typography>
            <Typography variant="caption" sx={{ 
              color: 'text.secondary', 
              fontSize: '0.75rem',
              fontWeight: 500,
            }}>
              {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} {themeMode === 'light' || themeMode === 'dark' ? 'Mode' : 'Theme'}
            </Typography>
          </Box>
          <Chip 
            label="Pro" 
            size="small" 
            sx={{ 
              ml: 2,
              background: currentTheme.gradients.accent,
              color: 'white',
              fontSize: '0.75rem',
              height: 28,
              fontWeight: 600,
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

        {/* Theme Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
          {/* Light/Dark Mode Toggle */}
          <IconButton 
            onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
            title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
          >
            {themeMode === 'light' ? (
              <DarkMode sx={{ color: 'text.primary' }} />
            ) : (
              <LightMode sx={{ color: 'text.primary' }} />
            )}
          </IconButton>

          {/* Color Palette Cycler */}
          <IconButton 
            onClick={() => {
              const currentIndex = themes.indexOf(themeMode);
              setThemeMode(themes[(currentIndex + 1) % themes.length]);
            }}
            title="Change color theme"
          >
            <Palette sx={{ color: 'text.primary' }} />
          </IconButton>
          
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5, ml: 1 }}>
            {themes.map((themeName) => (
              <Box
                key={themeName}
                onClick={() => setThemeMode(themeName)}
                title={`Switch to ${themeName.charAt(0).toUpperCase() + themeName.slice(1)} ${themeName === 'light' || themeName === 'dark' ? 'Mode' : 'Theme'}`}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: getThemeColors(themeName).gradients.primary,
                  cursor: 'pointer',
                  border: themeMode === themeName ? 
                    `2px solid ${currentTheme.primary.main}` : 
                    `1px solid ${themeMode === 'light' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.2)',
                  }
                }}
              />
            ))}
          </Box>
        </Box>

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
            background: themeMode === 'light' 
              ? 'rgba(255, 255, 255, 0.95)' 
              : 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
          }
        }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, px: 2 }}>
            <Satellite sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
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
                    borderRadius: 2,
                    '&.Mui-selected': {
                      background: themeMode === 'light' 
                        ? `linear-gradient(135deg, ${currentTheme.primary.main}12, ${currentTheme.primary.main}08)`
                        : currentTheme.primary.main,
                      color: themeMode === 'light' ? currentTheme.primary.main : 'white',
                      border: themeMode === 'light' 
                        ? `1px solid ${currentTheme.primary.main}40`
                        : 'none',
                      fontWeight: 600,
                      '& .MuiListItemIcon-root': {
                        color: themeMode === 'light' ? currentTheme.primary.main : 'white',
                      }
                    },
                    '&:hover': {
                      background: themeMode === 'light' 
                        ? `${currentTheme.primary.main}08`
                        : `${currentTheme.primary.main}20`,
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: activeView === item.id 
                      ? (themeMode === 'light' ? currentTheme.primary.main : 'white')
                      : 'text.secondary',
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
                        background: currentTheme.gradients.accent,
                        color: 'white',
                        fontSize: '0.75rem'
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
          background: themeMode === 'light' 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: `1px solid ${themeMode === 'light' ? '#e2e8f0' : '#334155'}`,
          height: '100vh',
          position: 'sticky',
          top: 0,
          boxShadow: themeMode === 'light'
            ? '1px 0 3px 0 rgba(0, 0, 0, 0.1)'
            : '1px 0 6px 0 rgba(0, 0, 0, 0.3)',
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
                    borderRadius: 2,
                    mb: 0.5,
                    '&.Mui-selected': {
                      background: themeMode === 'light' 
                        ? `linear-gradient(135deg, ${currentTheme.primary.main}15, ${currentTheme.primary.main}08)`
                        : currentTheme.primary.main,
                      color: themeMode === 'light' ? currentTheme.primary.main : 'white',
                      border: themeMode === 'light' 
                        ? `1px solid ${currentTheme.primary.main}40`
                        : 'none',
                      fontWeight: 600,
                      boxShadow: themeMode === 'light'
                        ? `0 2px 8px ${currentTheme.primary.main}20`
                        : 'none',
                      '& .MuiListItemIcon-root': {
                        color: themeMode === 'light' ? currentTheme.primary.main : 'white',
                      },
                      '&:hover': {
                        background: themeMode === 'light'
                          ? `linear-gradient(135deg, ${currentTheme.primary.main}20, ${currentTheme.primary.main}12)`
                          : currentTheme.primary.dark,
                        transform: 'translateX(2px)',
                        transition: 'all 0.2s ease'
                      }
                    },
                    '&:hover': {
                      background: themeMode === 'light' 
                        ? `${currentTheme.primary.main}08`
                        : `${currentTheme.primary.main}20`,
                      transform: 'translateX(2px)',
                      transition: 'all 0.2s ease'
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
                        background: currentTheme.gradients.accent,
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ px: 3, pb: 3, mt: 2 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              fontWeight: 600, 
              color: 'text.secondary',
              fontSize: '0.75rem',
              letterSpacing: '0.05em'
            }}
          >
            AI Status
          </Typography>
          <Card sx={{ mt: 2, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Psychology sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Model Ready
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
              System operational
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={98} 
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>
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
            {/* Welcome Section with Earth Animation */}
            <Box sx={{ 
              textAlign: 'center', 
              mb: 6,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 4,
              background: themeMode === 'light' 
                ? `linear-gradient(135deg, ${currentTheme.primary.main}15 0%, ${currentTheme.secondary.main}10 50%, ${currentTheme.accent.main}08 100%)`
                : currentTheme.gradients.primary,
              backdropFilter: 'blur(20px)',
              border: themeMode === 'light' 
                ? `2px solid ${currentTheme.primary.main}30`
                : `1px solid ${currentTheme.primary.main}40`,
              boxShadow: themeMode === 'light'
                ? `0 8px 32px ${currentTheme.primary.main}20`
                : `0 8px 32px rgba(0, 0, 0, 0.4)`,
              p: 6,
              color: themeMode === 'light' ? 'text.primary' : 'white'
            }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ 
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  opacity: themeMode === 'light' ? 0.3 : 0.1,
                  fontSize: '120px',
                  filter: themeMode === 'light' 
                    ? `drop-shadow(0 0 20px ${currentTheme.primary.main}40)`
                    : 'none'
                }}
              >
                🌍
              </motion.div>
              
              <Typography variant="h2" sx={{ 
                fontWeight: 800, 
                mb: 2,
                background: themeMode === 'light' 
                  ? currentTheme.gradients.primary
                  : 'linear-gradient(45deg, #ffffff, #e0f2fe)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: themeMode === 'light' ? 'transparent' : 'white'
              }}>
                Welcome to EuroSAT AI
              </Typography>
              
              <Typography variant="h5" sx={{ 
                opacity: themeMode === 'light' ? 0.8 : 0.9, 
                mb: 4,
                fontWeight: 300,
                letterSpacing: '0.5px',
                color: themeMode === 'light' ? 'text.secondary' : 'inherit'
              }}>
                🚀 Pioneering the Future of Earth Observation
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                {[
                  { icon: '🛰️', label: 'Satellite Analysis' },
                  { icon: '🌱', label: 'Environmental Monitoring' },
                  { icon: '🔬', label: 'AI Research' },
                  { icon: '🌿', label: 'Sustainability' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      cursor: 'pointer',
                      p: 2,
                      borderRadius: 2,
                      background: themeMode === 'light' 
                        ? 'rgba(255, 255, 255, 0.2)'
                        : 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: themeMode === 'light' 
                        ? '1px solid rgba(255, 255, 255, 0.3)'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        background: themeMode === 'light' 
                          ? 'rgba(255, 255, 255, 0.3)'
                          : 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: themeMode === 'light'
                          ? `0 4px 12px ${currentTheme.primary.main}30`
                          : '0 4px 12px rgba(255, 255, 255, 0.1)'
                      },
                      transition: 'all 0.3s ease'
                    }}>
                      <Typography variant="h3" sx={{ 
                        mb: 1,
                        filter: themeMode === 'light' 
                          ? `drop-shadow(0 2px 4px ${currentTheme.primary.main}20)`
                          : 'none'
                      }}>
                        {item.icon}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 500,
                        opacity: themeMode === 'light' ? 0.9 : 0.8
                      }}>
                        {item.label}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>

            {/* Mission Statement Cards */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  height: '100%',
                  background: `linear-gradient(135deg, ${currentTheme.background.paper} 0%, ${currentTheme.background.glass} 100%)`,
                  border: `2px solid ${currentTheme.primary.main}20`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: currentTheme.gradients.primary,
                    opacity: 0.1
                  }} />
                  <CardContent sx={{ p: 4, position: 'relative' }}>
                    <Typography variant="h4" sx={{ 
                      mb: 3, 
                      fontWeight: 700,
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      🎯 Our Mission
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.8,
                      color: 'text.primary',
                      fontSize: '1.1rem'
                    }}>
                      Revolutionizing environmental monitoring through cutting-edge AI technology. 
                      We harness the power of satellite imagery and deep learning to provide 
                      unprecedented insights into Earth's changing landscapes.
                    </Typography>
                    <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                      <Chip label="Innovation" color="primary" />
                      <Chip label="Sustainability" color="primary" />
                      <Chip label="Precision" color="primary" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ 
                  height: '100%',
                  background: `linear-gradient(135deg, ${currentTheme.background.glass} 0%, ${currentTheme.background.paper} 100%)`,
                  border: `2px solid ${currentTheme.secondary.main}20`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: -20,
                    left: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: currentTheme.gradients.secondary,
                    opacity: 0.1
                  }} />
                  <CardContent sx={{ p: 4, position: 'relative' }}>
                    <Typography variant="h4" sx={{ 
                      mb: 3, 
                      fontWeight: 700,
                      color: 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      💡 Innovation Hub
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.8,
                      color: 'text.primary',
                      fontSize: '1.1rem'
                    }}>
                      At the intersection of artificial intelligence and earth science, we create 
                      tools that empower researchers, policymakers, and environmental guardians 
                      to make data-driven decisions for our planet's future.
                    </Typography>
                    <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                      <Chip label="AI-Powered" color="secondary" />
                      <Chip label="Research-Driven" color="secondary" />
                      <Chip label="Future-Ready" color="secondary" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Interactive Feature Showcase */}
            <Card sx={{ mb: 4, p: 4, background: currentTheme.background.glass, backdropFilter: 'blur(20px)' }}>
              <Typography variant="h4" sx={{ 
                mb: 4, 
                fontWeight: 700, 
                textAlign: 'center',
                color: 'text.primary'
              }}>
                🌟 Platform Capabilities
              </Typography>
              
              <Grid container spacing={4}>
                {[
                  {
                    title: 'Advanced Image Analysis',
                    description: 'State-of-the-art deep learning models for precise land use classification',
                    icon: '🖼️',
                    color: 'primary'
                  },
                  {
                    title: 'Environmental Impact Assessment', 
                    description: 'Comprehensive monitoring of ecological changes and trends',
                    icon: '🌿',
                    color: 'success'
                  },
                  {
                    title: 'Real-time Processing',
                    description: 'Lightning-fast analysis with GPU-accelerated computations',
                    icon: '⚡',
                    color: 'warning'
                  },
                  {
                    title: 'Detailed Reporting',
                    description: 'Generate comprehensive reports with actionable insights',
                    icon: '📊',
                    color: 'info'
                  }
                ].map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Paper sx={{ 
                        p: 3,
                        height: '100%',
                        background: currentTheme.background.paper,
                        border: `1px solid ${currentTheme.primary.main}15`,
                        borderRadius: 3,
                        cursor: 'pointer',
                        '&:hover': {
                          borderColor: `${currentTheme.primary.main}40`,
                          boxShadow: `0 8px 25px ${currentTheme.glow}`
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Typography variant="h3" sx={{ fontSize: '2.5rem' }}>
                            {feature.icon}
                          </Typography>
                          <Box>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 600, 
                              mb: 1,
                              color: 'text.primary'
                            }}>
                              {feature.title}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: 'text.secondary',
                              lineHeight: 1.6
                            }}>
                              {feature.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Card>

            {/* Call to Action */}
            <Box sx={{ 
              textAlign: 'center',
              p: 4,
              borderRadius: 3,
              background: themeMode === 'light'
                ? `linear-gradient(135deg, ${currentTheme.primary.main}08, ${currentTheme.secondary.main}05)`
                : `linear-gradient(135deg, ${currentTheme.primary.main}15, ${currentTheme.secondary.main}10)`,
              border: themeMode === 'light'
                ? `2px dashed ${currentTheme.primary.main}40`
                : `2px dashed ${currentTheme.primary.main}30`,
              boxShadow: themeMode === 'light'
                ? `0 4px 20px ${currentTheme.primary.main}10`
                : 'none'
            }}>
              <Typography variant="h4" sx={{ 
                mb: 2, 
                fontWeight: 700,
                color: 'text.primary'
              }}>
                Ready to Explore? 🚀
              </Typography>
              <Typography variant="body1" sx={{ 
                mb: 3,
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto'
              }}>
                Start your journey into intelligent earth observation. Upload satellite images 
                and discover insights that can help shape a more sustainable future.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => setActiveView('upload')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  background: currentTheme.gradients.primary,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${currentTheme.glow}`
                  }
                }}
              >
                Begin Analysis ✨
              </Button>
            </Box>
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
                    <AnalysisDashboard analysis={data} gradcam={gradcam} themeMode={themeMode} />
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
                  <Typography variant="h6" sx={{ mb: 1, color: themeMode === 'light' ? 'text.primary' : 'white' }}>
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
                  <Typography variant="h6" sx={{ mb: 1, color: themeMode === 'light' ? 'text.primary' : 'white' }}>
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
      <StaticBackground />
      
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
                      <Typography variant="h6" sx={{ mb: 1, color: themeMode === 'light' ? 'text.primary' : 'white' }}>
                        Processing Analysis...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        AI is analyzing your satellite images with advanced algorithms
                      </Typography>
                      <LinearProgress 
                        sx={{ 
                          mt: 3, 
                          borderRadius: 6,
                          height: 10,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          overflow: 'hidden',
                          boxShadow: `inset 0 2px 4px rgba(0,0,0,0.2)`,
                          '& .MuiLinearProgress-bar': {
                            background: currentTheme.gradients.primary,
                            borderRadius: 6,
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                              animation: 'shimmer 2s infinite linear',
                            },
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
            background: currentTheme.gradients.primary,
            display: { xs: 'flex', md: 'none' },
            '&:hover': {
              transform: 'scale(1.05)',
            },
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
                  background: currentTheme.primary.main,
                  '&:hover': {
                    background: currentTheme.primary.dark,
                    transform: 'scale(1.05)',
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
