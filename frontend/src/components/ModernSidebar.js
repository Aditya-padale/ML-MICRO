import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Chip,
  useTheme,
  useMediaQuery,
  Badge
} from '@mui/material';
import {
  Dashboard,
  CloudUpload,
  Analytics,
  Assessment,
  Timeline,
  Settings,
  PhotoLibrary,
  Map,
  Science,
  TrendingUp,
  Notifications,
  Help
} from '@mui/icons-material';

const ModernSidebar = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Dashboard />,
      active: false
    },
    {
      id: 'upload',
      label: 'Upload Images',
      icon: <CloudUpload />,
      active: true
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: <Analytics />,
      active: false,
      badge: 3
    },
    {
      id: 'predictions',
      label: 'Predictions',
      icon: <Timeline />,
      active: false
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <Assessment />,
      active: false
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: <PhotoLibrary />,
      active: false
    }
  ];

  const toolsItems = [
    {
      id: 'gradcam',
      label: 'GradCAM',
      icon: <Science />
    },
    {
      id: 'trends',
      label: 'Trend Analysis',
      icon: <TrendingUp />
    },
    {
      id: 'mapping',
      label: 'Geo Mapping',
      icon: <Map />
    }
  ];

  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
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
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>
              SatelliteAI
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Change Detection Platform
            </Typography>
          </Box>
        </Box>
        
        {/* User Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
            AI
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              AI Assistant
            </Typography>
            <Chip 
              label="Active" 
              size="small" 
              color="success" 
              sx={{ height: 20, fontSize: '0.7rem' }}
            />
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 2 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            px: 3, 
            mb: 1, 
            fontWeight: 600, 
            color: 'text.secondary',
            fontSize: '0.75rem'
          }}
        >
          Main Navigation
        </Typography>
        
        <List sx={{ px: 2 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  bgcolor: item.active ? 'primary.main' : 'transparent',
                  color: item.active ? 'white' : 'text.primary',
                  '&:hover': {
                    bgcolor: item.active ? 'primary.dark' : 'grey.100',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: 'inherit',
                    minWidth: 40
                  }}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error" variant="dot">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: item.active ? 600 : 500,
                    fontSize: '0.875rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ mx: 2, my: 2 }} />

        <Typography 
          variant="overline" 
          sx={{ 
            px: 3, 
            mb: 1, 
            fontWeight: 600, 
            color: 'text.secondary',
            fontSize: '0.75rem'
          }}
        >
          AI Tools
        </Typography>
        
        <List sx={{ px: 2 }}>
          {toolsItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: 500
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <ListItemButton
            sx={{
              borderRadius: 2,
              flex: 1,
              minHeight: 48,
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', color: 'text.secondary' }}>
              <Settings />
            </ListItemIcon>
          </ListItemButton>
          
          <ListItemButton
            sx={{
              borderRadius: 2,
              flex: 1,
              minHeight: 48,
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', color: 'text.secondary' }}>
              <Notifications />
            </ListItemIcon>
          </ListItemButton>
          
          <ListItemButton
            sx={{
              borderRadius: 2,
              flex: 1,
              minHeight: 48,
              '&:hover': { bgcolor: 'grey.100' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', color: 'text.secondary' }}>
              <Help />
            </ListItemIcon>
          </ListItemButton>
        </Box>
        
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
          Version 2.0.1 • Last updated Oct 2025
        </Typography>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            border: 'none',
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default ModernSidebar;
