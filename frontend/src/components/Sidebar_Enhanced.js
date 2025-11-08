import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Dashboard,
  CloudUpload,
  Analytics,
  Assessment,
  Timeline,
  Settings,
  Help,
  Brightness4,
  Brightness7,
  Menu,
  Close,
  Satellite,
  Psychology,
  Science,
  TrendingUp,
  Map,
  PhotoLibrary
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const EnhancedSidebar = ({ darkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('upload');

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Dashboard />,
      color: '#00D4FF',
      description: 'Overview & Analytics'
    },
    {
      id: 'upload',
      label: 'Upload Images',
      icon: <CloudUpload />,
      color: '#FF6B9D',
      description: 'Satellite Image Upload'
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: <Analytics />,
      color: '#00E676',
      description: 'AI Analysis Results'
    },
    {
      id: 'reports',
      label: 'AI Reports',
      icon: <Assessment />,
      color: '#9C27B0',
      description: 'Generated Reports'
    },
    {
      id: 'gallery',
      label: 'Gallery',
      icon: <PhotoLibrary />,
      color: '#FF5722',
      description: 'Image Gallery'
    }
  ];

  const tools = [
    {
      id: 'gradcam',
      label: 'GradCAM',
      icon: <Science />,
      color: '#2196F3'
    },
    {
      id: 'trends',
      label: 'Trend Analysis',
      icon: <TrendingUp />,
      color: '#4CAF50'
    },
    {
      id: 'mapping',
      label: 'Geo Mapping',
      icon: <Map />,
      color: '#FF9800'
    }
  ];

  const sidebarVariants = {
    open: {
      width: 280,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 40
      }
    },
    closed: {
      width: 80,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 40
      }
    }
  };

  const contentVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1,
        duration: 0.3
      }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const MenuItemComponent = ({ item, isActive, onClick }) => (
    <motion.div
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      style={{ marginBottom: '0.5rem' }}
    >
      <ListItemButton
        onClick={onClick}
        sx={{
          borderRadius: 3,
          mx: 1,
          mb: 0.5,
          position: 'relative',
          overflow: 'hidden',
          background: isActive 
            ? `linear-gradient(135deg, ${item.color}20 0%, ${item.color}10 100%)`
            : 'transparent',
          border: isActive 
            ? `1px solid ${item.color}40`
            : '1px solid transparent',
          boxShadow: isActive 
            ? `0 4px 20px ${item.color}30`
            : 'none',
          '&:hover': {
            background: `linear-gradient(135deg, ${item.color}30 0%, ${item.color}15 100%)`,
            border: `1px solid ${item.color}50`,
            boxShadow: `0 6px 25px ${item.color}40`,
            '& .MuiListItemIcon-root': {
              transform: 'scale(1.1) rotate(5deg)',
              filter: `drop-shadow(0 0 8px ${item.color})`
            }
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              background: `linear-gradient(180deg, ${item.color} 0%, ${item.color}80 100%)`,
              borderRadius: '0 2px 2px 0'
            }}
          />
        )}
        
        <ListItemIcon
          sx={{
            color: isActive ? item.color : 'text.secondary',
            minWidth: isOpen ? 40 : 'auto',
            transition: 'all 0.3s ease',
            filter: isActive ? `drop-shadow(0 0 6px ${item.color}50)` : 'none'
          }}
        >
          {item.icon}
        </ListItemIcon>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={contentVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{ flex: 1 }}
            >
              <ListItemText
                primary={item.label}
                secondary={item.description}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? item.color : 'text.primary',
                    fontSize: '0.9rem'
                  },
                  '& .MuiListItemText-secondary': {
                    fontSize: '0.75rem',
                    opacity: 0.7
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ListItemButton>
    </motion.div>
  );

  return (
    <motion.div
      variants={sidebarVariants}
      animate={isOpen ? "open" : "closed"}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        zIndex: 1200,
        background: 'rgba(10, 11, 30, 0.95)',
        backdropFilter: 'blur(25px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '4px 0 40px rgba(0, 0, 0, 0.3)'
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(255, 107, 157, 0.05) 100%)'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <IconButton
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                  background: 'rgba(0, 212, 255, 0.1)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  '&:hover': {
                    background: 'rgba(0, 212, 255, 0.2)',
                    boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
                  }
                }}
              >
                {isOpen ? <Close /> : <Menu />}
              </IconButton>
            </motion.div>
            
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={contentVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Satellite sx={{ color: '#00D4FF', fontSize: 28 }} />
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #00D4FF, #FF6B9D)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          color: 'transparent',
                          lineHeight: 1
                        }}
                      >
                        EuroSAT AI
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                      >
                        Change Detection
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>

        {/* Navigation */}
        <Box sx={{ flex: 1, py: 2, overflow: 'hidden' }}>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={contentVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <Typography
                  variant="overline"
                  sx={{
                    px: 2,
                    mb: 1,
                    display: 'block',
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em'
                  }}
                >
                  MAIN NAVIGATION
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          <List sx={{ px: 0 }}>
            {menuItems.map((item) => (
              <MenuItemComponent
                key={item.id}
                item={item}
                isActive={activeSection === item.id}
                onClick={() => setActiveSection(item.id)}
              />
            ))}
          </List>

          <Divider sx={{ mx: 2, my: 2, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={contentVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <Typography
                  variant="overline"
                  sx={{
                    px: 2,
                    mb: 1,
                    display: 'block',
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em'
                  }}
                >
                  AI TOOLS
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>

          <List sx={{ px: 0 }}>
            {tools.map((tool) => (
              <motion.div
                key={tool.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <ListItemButton
                  sx={{
                    borderRadius: 3,
                    mx: 1,
                    mb: 0.5,
                    '&:hover': {
                      background: `${tool.color}20`,
                      border: `1px solid ${tool.color}40`,
                      '& .MuiListItemIcon-root': {
                        color: tool.color,
                        filter: `drop-shadow(0 0 8px ${tool.color})`
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'text.secondary', minWidth: isOpen ? 40 : 'auto' }}>
                    {tool.icon}
                  </ListItemIcon>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={contentVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                      >
                        <ListItemText
                          primary={tool.label}
                          sx={{
                            '& .MuiListItemText-primary': {
                              fontSize: '0.85rem',
                              fontWeight: 500
                            }
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </ListItemButton>
              </motion.div>
            ))}
          </List>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={contentVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: 'linear-gradient(135deg, #00D4FF, #FF6B9D)',
                      fontSize: '1rem',
                      fontWeight: 600
                    }}
                  >
                    AI
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      AI Assistant
                    </Typography>
                    <Typography variant="caption" color="success.main">
                      ● Online
                    </Typography>
                  </Box>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={!darkMode}
                      onChange={toggleDarkMode}
                      size="small"
                      sx={{
                        '& .MuiSwitch-thumb': {
                          background: darkMode ? '#FF6B9D' : '#00D4FF'
                        }
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {darkMode ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
                      <Typography variant="caption">
                        {darkMode ? 'Light' : 'Dark'} Mode
                      </Typography>
                    </Box>
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Tooltip title="Settings">
              <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: '#00D4FF',
                      background: 'rgba(0, 212, 255, 0.1)'
                    }
                  }}
                >
                  <Settings fontSize="small" />
                </IconButton>
              </motion.div>
            </Tooltip>

            <Tooltip title="Help">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: '#FF6B9D',
                      background: 'rgba(255, 107, 157, 0.1)'
                    }
                  }}
                >
                  <Help fontSize="small" />
                </IconButton>
              </motion.div>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default EnhancedSidebar;
