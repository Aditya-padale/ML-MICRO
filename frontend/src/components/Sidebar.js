import React from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Paper,
  Chip
} from '@mui/material';
import {
  Satellite,
  Analytics,
  Assessment,
  Timeline,
  Settings,
  Help
} from '@mui/icons-material';

function Sidebar({ config, onConfigChange }) {
  const menuItems = [
    { icon: <Satellite />, primary: 'Image Analysis', secondary: 'Upload and analyze satellite imagery' },
    { icon: <Analytics />, primary: 'Change Detection', secondary: 'AI-powered environmental monitoring' },
    { icon: <Assessment />, primary: 'Reports', secondary: 'Detailed analysis reports' },
  ];

  const features = [
    { label: 'Grad-CAM Visualization', status: 'Active' },
    { label: 'AI Report Generation', status: 'Premium' },
    { label: 'Multi-temporal Analysis', status: 'Active' },
    { label: 'Environmental Impact', status: 'Active' },
  ];

  return (
    <Drawer 
      variant="permanent" 
      anchor="left"
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderRightColor: 'divider',
          width: 280,
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            🌍 EuroSAT AI
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Environmental Monitoring
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Navigation
        </Typography>
        <List dense>
          {menuItems.map((item, index) => (
            <ListItem 
              key={index}
              sx={{ 
                borderRadius: 2,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main', minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.primary}
                secondary={item.secondary}
                primaryTypographyProps={{ fontWeight: 500, fontSize: '0.875rem' }}
                secondaryTypographyProps={{ fontSize: '0.75rem' }}
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 3 }} />
        
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
          Features
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {features.map((feature, index) => (
            <Paper 
              key={index}
              elevation={0}
              sx={{ 
                p: 2, 
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.75rem' }}>
                  {feature.label}
                </Typography>
                <Chip 
                  label={feature.status}
                  size="small"
                  color={feature.status === 'Active' ? 'success' : 'default'}
                  sx={{ fontSize: '0.6rem', height: 20 }}
                />
              </Box>
            </Paper>
          ))}
        </Box>

        <Box sx={{ mt: 4, p: 2, backgroundColor: 'primary.main', borderRadius: 2, color: 'white' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Need Help?
          </Typography>
          <Typography variant="caption">
            Check our documentation for detailed guides and API references.
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
