import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  Paper,
  CircularProgress,
  LinearProgress,
  Fab,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
  TextField,
  InputAdornment,
  Avatar,
  Badge,
  Divider,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  CloudUpload,
  Analytics,
  Timeline,
  Assessment,
  Settings,
  Satellite,
  Search,
  LightMode,
  DarkMode,
  Notifications,
  AccountCircle,
  Add,
  CheckCircle,
  Info,
  TrendingUp,
  Psychology,
  Close,
  FilterList,
  ViewList,
  ViewModule,
  Refresh,
  Download,
  Share
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './components/ImageUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import FuturePredictions from './components/FuturePredictions';
import Recommendations from './components/Recommendations';
import AIReports from './components/AIReports';
import { uploadAndAnalyze, fetchGradcam, requestReport } from './api';

const ModernSatelliteApp = () => {
  // Theme and UI State
  const [darkMode, setDarkMode] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeView, setActiveView] = useState('upload');
  const [viewMode, setViewMode] = useState('grid');
  const [notifications, setNotifications] = useState([]);
  
  // Data State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [gradcam, setGradcam] = useState(null);
  const [reports, setReports] = useState(null);
  
  // UI Controls
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  
  const isMobile = useMediaQuery('(max-width:768px)');
  
  // Modern Theme
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
      success: {
        main: '#10b981',
      },
      warning: {
        main: '#f59e0b',
      },
      error: {
        main: '#ef4444',
      },
    },
    typography: {
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.025em',
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
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: darkMode 
              ? '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -1px rgba(0,0,0,0.1)'
              : '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 'none',
            boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  });

  // Navigation Items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard />, badge: null },
    { id: 'upload', label: 'Upload Images', icon: <CloudUpload />, badge: null },
    { id: 'analysis', label: 'Analysis Results', icon: <Analytics />, badge: data ? 'new' : null },
    { id: 'predictions', label: 'AI Predictions', icon: <Timeline />, badge: null },
    { id: 'reports', label: 'Generated Reports', icon: <Assessment />, badge: reports ? '2' : null },
  ];

  // Sample notifications
  useEffect(() => {
    setNotifications([
      { id: 1, message: 'Analysis complete for sample_image.jpg', type: 'success', time: '2 min ago' },
      { id: 2, message: 'New AI model update available', type: 'info', time: '1 hour ago' },
      { id: 3, message: 'Weekly report ready for download', type: 'warning', time: '1 day ago' },
    ]);
  }, []);

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
      
      // Switch to results view after successful analysis
      setActiveView('analysis');
      
      // Add success notification
      setNotifications(prev => [{
        id: Date.now(),
        message: 'Analysis completed successfully!',
        type: 'success',
        time: 'now'
      }, ...prev]);
      
    } catch (e) {
      console.error('Analysis error:', e);
      setError(e.message || 'Failed to analyze');
    } finally {
      setLoading(false);
    }
  };

  // Modern Header Component
  const ModernHeader = () => (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <IconButton
          edge="start"
          onClick={() => setDrawerOpen(true)}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Satellite sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            EuroSAT AI
          </Typography>
          <Chip 
            label="Pro" 
            size="small" 
            color="primary" 
            sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
          />
        </Box>

        {/* Search Bar */}
        <TextField
          size="small"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
              border: 'none',
              '&:hover': {
                bgcolor: 'action.selected',
              },
            },
          }}
        />

        {/* View Toggle */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
          <IconButton
            onClick={() => setViewMode('list')}
            sx={{ 
              color: viewMode === 'list' ? 'primary.main' : 'text.secondary',
              bgcolor: viewMode === 'list' ? 'primary.50' : 'transparent'
            }}
          >
            <ViewList />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('grid')}
            sx={{ 
              color: viewMode === 'grid' ? 'primary.main' : 'text.secondary',
              bgcolor: viewMode === 'grid' ? 'primary.50' : 'transparent'
            }}
          >
            <ViewModule />
          </IconButton>
        </Box>

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

        {/* Profile Menu */}
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ p: 0 }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            <AccountCircle />
          </Avatar>
        </IconButton>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem>Help</MenuItem>
          <Divider />
          <MenuItem>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );

  // Modern Sidebar Component
  const ModernSidebar = () => (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
        bgcolor: 'background.paper',
        borderRight: `1px solid ${theme.palette.divider}`,
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="overline" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>
          NAVIGATION
        </Typography>
        <List sx={{ mt: 1 }}>
          {navItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => setActiveView(item.id)}
                selected={activeView === item.id}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.50',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.100',
                    },
                  },
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
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color={item.badge === 'new' ? 'success' : 'primary'}
                    sx={{ height: 18, fontSize: '0.7rem' }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ px: 3, pb: 3 }}>
        <Typography variant="overline" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem' }}>
          QUICK ACTIONS
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Refresh />}
            fullWidth
            sx={{ justifyContent: 'flex-start' }}
          >
            Refresh Data
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            fullWidth
            sx={{ justifyContent: 'flex-start' }}
          >
            Export Results
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Share />}
            fullWidth
            sx={{ justifyContent: 'flex-start' }}
          >
            Share Analysis
          </Button>
        </Box>
      </Box>

      {/* Status Card */}
      <Box sx={{ px: 3, pb: 3 }}>
        <Card sx={{ bgcolor: 'primary.50', border: `1px solid ${theme.palette.primary.main}20` }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Psychology sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                AI Status
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ready for analysis
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flex: 1, mr: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={95} 
                  sx={{ 
                    height: 4, 
                    borderRadius: 2,
                    bgcolor: 'primary.100',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
                    }
                  }} 
                />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                95%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );

  // Mobile Drawer
  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      ModalProps={{ keepMounted: true }}
    >
      <Box sx={{ width: 280, pt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Satellite sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              EuroSAT AI
            </Typography>
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ px: 2, pt: 2 }}>
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
  );

  // Content Area with Modern Cards
  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
              Dashboard
            </Typography>
            
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { title: 'Total Analyses', value: '1,247', change: '+12%', color: 'primary' },
                { title: 'AI Accuracy', value: '98.7%', change: '+0.3%', color: 'success' },
                { title: 'Processing Time', value: '2.4s', change: '-15%', color: 'info' },
                { title: 'Active Models', value: '4', change: '+1', color: 'warning' },
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
                        color={stat.color}
                        sx={{ fontSize: '0.7rem' }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Recent Activity */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { action: 'Image analysis completed', file: 'satellite_image_001.jpg', time: '2 minutes ago', status: 'success' },
                    { action: 'New model training started', file: 'EuroSAT_v2.0', time: '1 hour ago', status: 'info' },
                    { action: 'Export completed', file: 'change_detection_report.pdf', time: '3 hours ago', status: 'success' },
                  ].map((activity, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                      {activity.status === 'success' && <CheckCircle sx={{ color: 'success.main', mr: 2 }} />}
                      {activity.status === 'info' && <Info sx={{ color: 'info.main', mr: 2 }} />}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.action}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.file} • {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        );

      case 'upload':
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                Upload & Analysis
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={() => setFilterOpen(!filterOpen)}
                >
                  Filters
                </Button>
                <Button variant="outlined" startIcon={<Settings />}>
                  Settings
                </Button>
              </Box>
            </Box>

            {/* Upload Component */}
            <Card sx={{ mb: 3 }}>
              <ImageUpload onUpload={handleUploadAnalyze} />
            </Card>

            {/* Analysis Options */}
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Analysis Options
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FormControlLabel
                            control={<Switch defaultChecked />}
                            label="Generate GradCAM visualization"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControlLabel
                            control={<Switch defaultChecked />}
                            label="Create detailed report"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControlLabel
                            control={<Switch />}
                            label="Enable real-time processing"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControlLabel
                            control={<Switch defaultChecked />}
                            label="Save to project history"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
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

      case 'predictions':
        return (
          <Box>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
              AI Predictions
            </Typography>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <TrendingUp sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Predictions Available After Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Complete an image analysis to view future trend predictions
                </Typography>
              </CardContent>
            </Card>
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
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ModernHeader />
        
        <Box sx={{ display: 'flex', flex: 1 }}>
          <ModernSidebar />
          <MobileDrawer />
          
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
            boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
          }}
          onClick={() => setActiveView('upload')}
        >
          <Add />
        </Fab>

        {/* Error Snackbar */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            severity="error" 
            onClose={() => setError('')}
            sx={{ borderRadius: 2 }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default ModernSatelliteApp;
