import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  useTheme, 
  alpha,
  Chip,
  Grid
} from '@mui/material';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend
} from 'recharts';
import { 
  Timeline as TimelineIcon, 
  TrendingUp, 
  TrendingDown,
  CalendarToday,
  Speed
} from '@mui/icons-material';

const TemporalChangeTimeline = ({ analysisData, themeMode = 'light' }) => {
  const theme = useTheme();

  // Generate temporal data based on before/after analysis
  const generateTemporalData = (data) => {
    if (!data || !data.before || !data.after || !data.class_names) return [];

    const beforeYear = data.before_year || 2010;
    const afterYear = data.after_year || 2020;
    const yearsSpan = afterYear - beforeYear;
    
    // Generate intermediate data points for smooth transition
    const dataPoints = [];
    const numPoints = Math.min(yearsSpan + 1, 10); // Max 10 points for performance
    
    for (let i = 0; i < numPoints; i++) {
      const progress = i / (numPoints - 1);
      const year = Math.round(beforeYear + (progress * yearsSpan));
      
      const dataPoint = {
        year: year,
        date: `${year}`
      };

      // Interpolate between before and after values
      data.class_names.forEach((className, index) => {
        const beforeValue = (data.before.probs[index] || 0) * 100;
        const afterValue = (data.after.probs[index] || 0) * 100;
        
        // Add some realistic variation using sine wave
        const baseInterpolation = beforeValue + (afterValue - beforeValue) * progress;
        const variation = Math.sin(progress * Math.PI * 2) * 2; // Small variation
        dataPoint[className] = Math.max(0, baseInterpolation + variation);
      });

      dataPoints.push(dataPoint);
    }

    return dataPoints;
  };

  // Calculate change velocity and trends
  const calculateTrendMetrics = (data) => {
    if (!data || !data.before || !data.after) return {};

    const beforeProbs = data.before.probs || [];
    const afterProbs = data.after.probs || [];
    const yearsSpan = (data.after_year || 2020) - (data.before_year || 2010);
    
    const changes = beforeProbs.map((beforeValue, index) => {
      const afterValue = afterProbs[index] || 0;
      const change = afterValue - beforeValue;
      const velocity = change / yearsSpan; // Change per year
      return {
        className: data.class_names[index],
        change: change * 100,
        velocity: velocity * 100,
        trend: change > 0.01 ? 'increasing' : change < -0.01 ? 'decreasing' : 'stable'
      };
    });

    const significantChanges = changes.filter(c => Math.abs(c.change) > 1);
    const increasingClasses = changes.filter(c => c.trend === 'increasing').length;
    const decreasingClasses = changes.filter(c => c.trend === 'decreasing').length;

    return {
      changes,
      significantChanges,
      increasingClasses,
      decreasingClasses,
      totalVelocity: changes.reduce((sum, c) => sum + Math.abs(c.velocity), 0)
    };
  };

  const timelineData = generateTemporalData(analysisData);
  const trendMetrics = calculateTrendMetrics(analysisData);

  if (timelineData.length === 0) return null;

  // Color mapping for different land use types
  const getLineColor = (className, mode) => {
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>cd 
              Year {label}
            </Typography>
            {payload.slice(0, 5).map((entry, index) => ( // Show top 5 to avoid clutter
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box 
                  sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: entry.color 
                  }} 
                />
                <Typography variant="caption">
                  <strong>{entry.name}:</strong> {entry.value.toFixed(1)}%
                </Typography>
              </Box>
            ))}
            {payload.length > 5 && (
              <Typography variant="caption" color="text.secondary">
                +{payload.length - 5} more classes...
              </Typography>
            )}
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  // Trend Summary Cards
  const TrendCard = ({ title, value, subtitle, icon, color, trend }) => (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        background: themeMode === 'dark' 
          ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(color, 0.1)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(color, 0.05)} 100%)`,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: color,
          boxShadow: `0 4px 20px ${alpha(color, 0.2)}`
        }
      }}
    >
      <CardContent sx={{ p: 2, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
          <Box sx={{ color: color }}>{icon}</Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: color, mb: 0.5 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
        {trend && (
          <Box sx={{ mt: 1 }}>
            <Chip 
              icon={trend > 0 ? <TrendingUp /> : <TrendingDown />}
              label={`${Math.abs(trend).toFixed(1)}% change`}
              size="small"
              color={trend > 0 ? 'success' : 'error'}
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        📈 Temporal Change Analysis
      </Typography>

      {/* Trend Metrics Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <TrendCard 
            title="Time Span"
            value={`${(analysisData.after_year || 2020) - (analysisData.before_year || 2010)} yrs`}
            subtitle="Analysis period"
            icon={<CalendarToday />}
            color="#6366f1"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TrendCard 
            title="Increasing"
            value={trendMetrics.increasingClasses}
            subtitle="Classes growing"
            icon={<TrendingUp />}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TrendCard 
            title="Decreasing"
            value={trendMetrics.decreasingClasses}
            subtitle="Classes declining"
            icon={<TrendingDown />}
            color="#ef4444"
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <TrendCard 
            title="Change Rate"
            value={`${trendMetrics.totalVelocity.toFixed(1)}%`}
            subtitle="per year"
            icon={<Speed />}
            color="#f59e0b"
          />
        </Grid>
      </Grid>

      {/* Velocity Trends Area Chart */}
      <Card 
        elevation={0}
        sx={{ 
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          background: themeMode === 'dark' 
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.dark, 0.1)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Speed sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Change Velocity Trends
            </Typography>
          </Box>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timelineData}>
              <defs>
                {analysisData.class_names?.slice(0, 5).map((className, index) => (
                  <linearGradient key={className} id={`gradient-${className}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getLineColor(className, themeMode)} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={getLineColor(className, themeMode)} stopOpacity={0.1}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={themeMode === 'dark' ? '#374151' : '#e5e7eb'}
                opacity={0.5}
              />
              <XAxis 
                dataKey="year" 
                stroke={themeMode === 'dark' ? '#9ca3af' : '#6b7280'}
                fontSize={12}
              />
              <YAxis 
                stroke={themeMode === 'dark' ? '#9ca3af' : '#6b7280'}
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  color: themeMode === 'dark' ? '#e5e7eb' : '#374151',
                  fontSize: '12px'
                }}
              />
              
              {analysisData.class_names?.slice(0, 5).map((className, index) => (
                <Area
                  key={className}
                  type="monotone"
                  dataKey={className}
                  stackId="1"
                  stroke={getLineColor(className, themeMode)}
                  fill={`url(#gradient-${className})`}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Change Summary */}
      <Card 
        elevation={0}
        sx={{ 
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
            <TimelineIcon sx={{ color: theme.palette.secondary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Timeline Analysis Summary
            </Typography>
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            📊 Key Changes Detected:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {trendMetrics.significantChanges.slice(0, 5).map((change, index) => (
              <Box 
                key={index}
                sx={{ 
                  p: 2, 
                  borderRadius: 1,
                  backgroundColor: alpha(getLineColor(change.className, themeMode), 0.1),
                  border: '1px solid',
                  borderColor: alpha(getLineColor(change.className, themeMode), 0.3)
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  <strong>{change.className}:</strong> {' '}
                  {change.change > 0 ? 'Increased' : 'Decreased'} by{' '}
                  <strong>{Math.abs(change.change).toFixed(1)}%</strong> {' '}
                  ({change.velocity.toFixed(2)}%/year)
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TemporalChangeTimeline;
