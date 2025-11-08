import React from 'react';
import { Box, Card, CardContent, Typography, useTheme, alpha } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Terrain, Nature, HomeWork, Forest } from '@mui/icons-material';

const LandUseDistributionChart = ({ data, title = "Land Use Distribution", themeMode = 'light' }) => {
  const theme = useTheme();

  // Enhanced color palette for different land use types
  const getLandUseColors = (className, mode) => {
    const colors = {
      'AnnualCrop': mode === 'dark' ? '#4ade80' : '#16a34a',
      'Forest': mode === 'dark' ? '#22c55e' : '#15803d', 
      'HerbaceousVegetation': mode === 'dark' ? '#84cc16' : '#65a30d',
      'Highway': mode === 'dark' ? '#64748b' : '#475569',
      'Industrial': mode === 'dark' ? '#ef4444' : '#dc2626',
      'Pasture': mode === 'dark' ? '#eab308' : '#ca8a04',
      'PermanentCrop': mode === 'dark' ? '#8b5cf6' : '#7c3aed',
      'Residential': mode === 'dark' ? '#3b82f6' : '#2563eb',
      'River': mode === 'dark' ? '#06b6d4' : '#0891b2',
      'SeaLake': mode === 'dark' ? '#0ea5e9' : '#0284c7'
    };
    return colors[className] || (mode === 'dark' ? '#64748b' : '#475569');
  };

  // Transform the analysis data for pie chart
  const transformDataForPieChart = (analysisData) => {
    if (!analysisData || !analysisData.class_names) return [];
    
    // Use 'after' probabilities to show current distribution
    const probs = analysisData.after?.probs || analysisData.before?.probs || [];
    
    return analysisData.class_names.map((className, index) => ({
      name: className,
      value: (probs[index] || 0) * 100,
      color: getLandUseColors(className, themeMode),
      area: `${((probs[index] || 0) * 100).toFixed(1)}%`
    })).filter(item => item.value > 0).sort((a, b) => b.value - a.value);
  };

  const pieData = transformDataForPieChart(data);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card 
          sx={{ 
            border: '1px solid', 
            borderColor: 'divider',
            boxShadow: theme => `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
            backdropFilter: 'blur(10px)',
            backgroundColor: theme => alpha(theme.palette.background.paper, 0.9)
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  backgroundColor: data.color 
                }} 
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {data.name}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Coverage: <strong>{data.area}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confidence: <strong>{data.value.toFixed(2)}%</strong>
            </Typography>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, textAlign: 'center' }}>
          Land Use Categories
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: 1,
          maxHeight: 120,
          overflowY: 'auto'
        }}>
          {payload.map((entry, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                p: 1,
                borderRadius: 1,
                backgroundColor: alpha(entry.color, 0.1),
                border: '1px solid',
                borderColor: alpha(entry.color, 0.3)
              }}
            >
              <Box 
                sx={{ 
                  width: 8, 
                  height: 8, 
                  borderRadius: '50%', 
                  backgroundColor: entry.color,
                  flexShrink: 0
                }} 
              />
              <Typography variant="caption" sx={{ fontWeight: 500, fontSize: '0.7rem' }}>
                {entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const getIcon = () => {
    const iconProps = { 
      sx: { 
        color: theme.palette.primary.main, 
        fontSize: 20 
      } 
    };
    
    if (title.toLowerCase().includes('forest')) return <Forest {...iconProps} />;
    if (title.toLowerCase().includes('residential')) return <HomeWork {...iconProps} />;
    if (title.toLowerCase().includes('vegetation')) return <Nature {...iconProps} />;
    return <Terrain {...iconProps} />;
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        background: theme => themeMode === 'dark' 
          ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: theme => `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          {getIcon()}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        {/* Pie Chart */}
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={themeMode === 'dark' ? '#1e293b' : '#ffffff'}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Summary Stats */}
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          borderRadius: 1,
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.2)
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            <strong>{pieData.length}</strong> land use types detected with 
            <strong> {pieData.reduce((sum, item) => sum + item.value, 0).toFixed(1)}%</strong> total coverage
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LandUseDistributionChart;
