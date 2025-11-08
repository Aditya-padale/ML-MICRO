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
  Stack
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
  Add,
  KeyboardArrowUp
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState('upload');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [gradcam, setGradcam] = useState(null);
  const [reports, setReports] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications] = useState([
    { id: 1, message: 'Analysis complete', type: 'success', time: '2 min ago' },
    { id: 2, message: 'Model updated', type: 'info', time: '1 hour ago' }
  ]);

  const isMobile = useMediaQuery('(max-width:768px)');

  // Modern theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#3b82f6' : '#2563eb',
        light: '#60a5fa',
        dark: '#1d4ed8',
      },
      secondary: {
        main: darkMode ? '#f59e0b' : '#d97706',
        light: '#fbbf24',
        dark: '#b45309',
      },
      background: {
        default: darkMode ? '#0f172a' : '#f8fafc',
        paper: darkMode ? '#1e293b' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "SF Pro Display", -apple-system, sans-serif',
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
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
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: darkMode 
              ? '0 4px 6px -1px rgba(0,0,0,0.3)'
              : '0 4px 6px -1px rgba(0,0,0,0.1)',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
            backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
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

  // Header Component
  const ModernHeader = () => (
    <AppBar position="sticky" color="inherit">
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <IconButton
          edge="start"
          onClick={() => setDrawerOpen(true)}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
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
            <Satellite sx={{ color: 'white' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            EuroSAT AI
          </Typography>
          <Chip 
            label="Pro" 
            size="small" 
            color="primary" 
            sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
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
            '& .MuiOutlinedInput-root': {
              bgcolor: 'action.hover',
            },
          }}
        />

        {/* Theme Toggle */}
        <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ mr: 1 }}>
          {darkMode ? <LightMode /> : <DarkMode />}
        </IconButton>

        {/* Notifications */}
        <IconButton sx={{ mr: 1 }}>
          <Badge badgeContent={notifications.length} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        {/* Profile */}
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar sx={{ width: 32, height: 32 }}>AI</Avatar>
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );

  // Sidebar Component
  const ModernSidebar = () => (
    <>
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, px: 2 }}>
            <Satellite sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              EuroSAT AI
            </Typography>
            <IconButton sx={{ ml: 'auto' }} onClick={() => setDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    setActiveView(item.id);
                    setDrawerOpen(false);
                  }}
                  selected={activeView === item.id}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.50',
                      color: 'primary.main',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: activeView === item.id ? 'primary.main' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      color={item.badge === 'new' ? 'success' : 'primary'}
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
          bgcolor: 'background.paper',
          borderRight: 1,
          borderColor: 'divider',
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="overline" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            Navigation
          </Typography>
          <List sx={{ mt: 1 }}>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => setActiveView(item.id)}
                  selected={activeView === item.id}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.50',
                      color: 'primary.main',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: activeView === item.id ? 'primary.main' : 'text.secondary',
                    minWidth: 40
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      color={item.badge === 'new' ? 'success' : 'primary'}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ px: 3, pb: 2 }}>
          <Typography variant="overline" sx={{ fontWeight: 600, color: 'text.secondary' }}>
            Quick Actions
          </Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            <Button variant="outlined" size="small" startIcon={<Refresh />} fullWidth>
              Refresh
            </Button>
            <Button variant="outlined" size="small" startIcon={<Download />} fullWidth>
              Export
            </Button>
          </Stack>
        </Box>
      </Box>
    </>
  );

  // Content renderer
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
              Dashboard
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { title: 'Total Analyses', value: '1,247', change: '+12%' },
                { title: 'AI Accuracy', value: '98.7%', change: '+0.3%' },
                { title: 'Processing Time', value: '2.4s', change: '-15%' },
                { title: 'Active Models', value: '4', change: '+1' },
              ].map((stat) => (
                <Grid item xs={12} sm={6} lg={3} key={stat.title}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Chip
                        label={stat.change}
                        size="small"
                        color="success"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        );

      case 'upload':
        return (
          <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
              Upload & Analysis
            </Typography>
            <Card>
              <ImageUpload onUpload={handleUploadAnalyze} />
            </Card>
          </Box>
        );

      case 'analysis':
        return (
          <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
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
                  <Analytics sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Analysis Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Upload satellite images to start analyzing environmental changes
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => setActiveView('upload')}
                    startIcon={<CloudUpload />}
                  >
                    Start Analysis
                  </Button>
                </CardContent>
              </Card>
            )}
          </Box>
        );

      case 'reports':
        return (
          <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
              Generated Reports
            </Typography>
            {reports ? (
              <Card>
                <AIReports report={reports?.full_report} summary={reports?.summary_report} />
              </Card>
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Reports Generated
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reports will be generated after completing an analysis
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
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
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ModernHeader />
        
        <Box sx={{ display: 'flex', flex: 1 }}>
          <ModernSidebar />
          
          {/* Main Content */}
          <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, bgcolor: 'background.default' }}>
            <Container maxWidth="xl" sx={{ p: 0 }}>
              {/* Loading State */}
              {loading && (
                <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Processing Analysis...
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI is analyzing your satellite images
                  </Typography>
                  <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />
                </Paper>
              )}
              
              {/* Content */}
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </Container>
          </Box>
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            display: { xs: 'flex', md: 'none' }
          }}
          onClick={() => setActiveView('upload')}
        >
          <Add />
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
                bottom: 24,
                right: isMobile ? 88 : 24,
                zIndex: 1000
              }}
            >
              <Fab size="small" onClick={scrollToTop}>
                <KeyboardArrowUp />
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

export default ModernSatelliteApp;
