import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  useTheme, 
  alpha,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  ResponsiveContainer, 
  Cell,
  Treemap,
  Tooltip
} from 'recharts';
import { 
  SwapHoriz, 
  TrendingUp, 
  TrendingDown,
  CompareArrows,
  Analytics
} from '@mui/icons-material';

const AreaChangeHeatmap = ({ analysisData, themeMode = 'light' }) => {
  const theme = useTheme();

  // Generate heatmap data from analysis
  const generateHeatmapData = (data) => {
    if (!data || !data.before || !data.after || !data.class_names) return [];

    const beforeProbs = data.before.probs || [];
    const afterProbs = data.after.probs || [];
    
    return data.class_names.map((className, index) => {
      // Ensure className is valid
      if (!className || typeof className !== 'string') return null;
      
      const beforeValue = beforeProbs[index] || 0;
      const afterValue = afterProbs[index] || 0;
      const change = afterValue - beforeValue;
      const changePercent = change * 100;
      const avgValue = (beforeValue + afterValue) / 2;
      
      return {
        name: className,
        before: beforeValue * 100,
        after: afterValue * 100,
        change: changePercent,
        absChange: Math.abs(changePercent),
        size: Math.max(avgValue * 100, 5), // Minimum size for visibility
        trend: changePercent > 1 ? 'increasing' : changePercent < -1 ? 'decreasing' : 'stable',
        intensity: Math.min(Math.abs(changePercent) * 2, 100), // Color intensity
        area: avgValue * 100
      };
    }).filter(item => item && item.area > 0 && item.name); // Filter out null items and ensure name exists
  };

  // Calculate change matrix for cross-analysis
  const generateChangeMatrix = (data) => {
    if (!data || !data.class_names) return [];

    const matrix = [];
    const classes = data.class_names;
    
    // Create a simplified change matrix based on probabilities
    classes.forEach((fromClass, fromIndex) => {
      classes.forEach((toClass, toIndex) => {
        if (fromIndex !== toIndex) {
          const beforeFrom = (data.before?.probs[fromIndex] || 0) * 100;
          const afterFrom = (data.after?.probs[fromIndex] || 0) * 100;
          const beforeTo = (data.before?.probs[toIndex] || 0) * 100;
          const afterTo = (data.after?.probs[toIndex] || 0) * 100;
          
          // Estimate transition probability based on changes
          const fromDecrease = Math.max(0, beforeFrom - afterFrom);
          const toIncrease = Math.max(0, afterTo - beforeTo);
          const transitionStrength = Math.min(fromDecrease, toIncrease);
          
          if (transitionStrength > 0.5) { // Only significant transitions
            matrix.push({
              from: fromClass,
              to: toClass,
              strength: transitionStrength,
              percentage: transitionStrength
            });
          }
        }
      });
    });

    return matrix.sort((a, b) => b.strength - a.strength).slice(0, 10); // Top 10 transitions
  };

  const heatmapData = generateHeatmapData(analysisData);
  const changeMatrix = generateChangeMatrix(analysisData);

  // Debug logging (can be removed later)
  React.useEffect(() => {
    console.log('AreaChangeHeatmap - analysisData:', analysisData);
    console.log('AreaChangeHeatmap - heatmapData:', heatmapData);
  }, [analysisData, heatmapData]);

  if (!heatmapData || heatmapData.length === 0) {
    return (
      <Box>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          🌡️ Area Change Heatmap Analysis
        </Typography>
        <Card 
          elevation={0}
          sx={{ 
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No change data available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Upload and analyze satellite images to view area changes.
          </Typography>
        </Card>
      </Box>
    );
  }

  // Color functions for different visualizations
  const getChangeColor = (change, mode) => {
    const intensity = Math.abs(change) / 20; // Scale factor
    if (change > 0) {
      return mode === 'dark' ? 
        `rgba(34, 197, 94, ${Math.min(intensity + 0.3, 1)})` : // Green for increase
        `rgba(21, 128, 61, ${Math.min(intensity + 0.3, 1)})`;
    } else if (change < 0) {
      return mode === 'dark' ? 
        `rgba(239, 68, 68, ${Math.min(intensity + 0.3, 1)})` : // Red for decrease
        `rgba(185, 28, 28, ${Math.min(intensity + 0.3, 1)})`;
    }
    return mode === 'dark' ? 'rgba(100, 116, 139, 0.5)' : 'rgba(71, 85, 105, 0.5)'; // Gray for stable
  };

  const getTreemapColor = (item, mode) => {
    // Add null/undefined check for item
    if (!item || !item.name) {
      return mode === 'dark' ? '#64748b' : '#475569';
    }
    
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
    return colors[item.name] || (mode === 'dark' ? '#64748b' : '#475569');
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Card 
          sx={{ 
            border: '1px solid', 
            borderColor: 'divider',
            boxShadow: theme => `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
            backdropFilter: 'blur(10px)',
            backgroundColor: theme => alpha(theme.palette.background.paper, 0.95)
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {data.name}
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Before:</strong> {data.before.toFixed(1)}%
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>After:</strong> {data.after.toFixed(1)}%
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: data.change > 0 ? 'success.main' : data.change < 0 ? 'error.main' : 'text.secondary',
                fontWeight: 600
              }}
            >
              <strong>Change:</strong> {data.change > 0 ? '+' : ''}{data.change.toFixed(1)}%
            </Typography>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const renderTreemapContent = (props) => {
    const { x, y, width, height, payload } = props;
    
    // Add null/undefined checks for payload
    if (!payload || !payload.name || width < 50 || height < 30) return null;

    return (
      <g>
        <rect 
          x={x} 
          y={y} 
          width={width} 
          height={height} 
          fill={getTreemapColor(payload, themeMode)}
          stroke={themeMode === 'dark' ? '#1e293b' : '#ffffff'}
          strokeWidth={1}
          opacity={0.8}
        />
        <text 
          x={x + width / 2} 
          y={y + height / 2 - 8} 
          textAnchor="middle" 
          fill={themeMode === 'dark' ? '#ffffff' : '#000000'}
          fontSize="12"
          fontWeight="600"
        >
          {payload.name}
        </text>
        <text 
          x={x + width / 2} 
          y={y + height / 2 + 8} 
          textAnchor="middle" 
          fill={themeMode === 'dark' ? '#ffffff' : '#000000'}
          fontSize="10"
        >
          {payload.change !== undefined ? (payload.change > 0 ? '+' : '') + payload.change.toFixed(1) + '%' : 'N/A'}
        </text>
      </g>
    );
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        🌡️ Area Change Heatmap Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Change Summary */}
        <Grid item xs={12}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              background: themeMode === 'dark' 
                ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.secondary.dark, 0.1)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Analytics sx={{ color: theme.palette.secondary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Change Summary
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 350, overflowY: 'auto' }}>
                {heatmapData
                  .filter(item => Math.abs(item.change) > 0.5)
                  .sort((a, b) => b.absChange - a.absChange)
                  .map((item, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        p: 2, 
                        borderRadius: 1,
                        backgroundColor: getChangeColor(item.change, themeMode),
                        border: '1px solid',
                        borderColor: alpha(getTreemapColor(item, themeMode), 0.5)
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'white' }}>
                          {item.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {item.trend === 'increasing' ? 
                            <TrendingUp sx={{ fontSize: 16, color: 'white' }} /> :
                            item.trend === 'decreasing' ?
                            <TrendingDown sx={{ fontSize: 16, color: 'white' }} /> :
                            <SwapHoriz sx={{ fontSize: 16, color: 'white' }} />
                          }
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                            {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        {item.before.toFixed(1)}% → {item.after.toFixed(1)}%
                      </Typography>
                    </Box>
                  ))
                }
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Change Matrix Table */}
        {changeMatrix.length > 0 && (
          <Grid item xs={12}>
            <Card 
              elevation={0}
              sx={{ 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                background: themeMode === 'dark' 
                  ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha('#10b981', 0.1)} 100%)`
                  : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha('#10b981', 0.05)} 100%)`
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <CompareArrows sx={{ color: '#10b981' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Land Use Transitions
                  </Typography>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ backgroundColor: 'transparent' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>From</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>To</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Strength</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Impact</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {changeMatrix.slice(0, 8).map((transition, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip 
                              label={transition.from} 
                              size="small" 
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={transition.to} 
                              size="small" 
                              color="primary"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box 
                                sx={{ 
                                  width: 40, 
                                  height: 8, 
                                  borderRadius: 4,
                                  backgroundColor: alpha('#10b981', 0.3)
                                }}
                              >
                                <Box 
                                  sx={{ 
                                    width: `${transition.strength * 2}%`, 
                                    height: '100%', 
                                    borderRadius: 4,
                                    backgroundColor: '#10b981'
                                  }}
                                />
                              </Box>
                              <Typography variant="caption">
                                {transition.strength.toFixed(1)}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={transition.strength > 2 ? 'High' : transition.strength > 1 ? 'Medium' : 'Low'}
                              size="small"
                              color={transition.strength > 2 ? 'error' : transition.strength > 1 ? 'warning' : 'default'}
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    <strong>{changeMatrix.length}</strong> significant land use transitions detected
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AreaChangeHeatmap;
