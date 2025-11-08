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
  LinearProgress,
  Avatar
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  Co2, 
  Forest as ForestIcon, 
  Factory,
  Agriculture,
  Home,
  TrendingUp,
  TrendingDown,
  Nature,
  Warning,
  CheckCircle
} from '@mui/icons-material';

const CarbonImpactTracker = ({ analysisData, themeMode = 'light' }) => {
  const theme = useTheme();

  // Carbon sequestration/emission factors (tons CO2 per hectare per year)
  const carbonFactors = {
    'Forest': 10.5,           // High sequestration
    'PermanentCrop': 3.2,     // Moderate sequestration  
    'AnnualCrop': 1.8,        // Low sequestration
    'Pasture': 2.5,           // Low-moderate sequestration
    'HerbaceousVegetation': 4.1, // Moderate sequestration
    'River': 0,               // Neutral
    'SeaLake': 0.5,           // Slight sequestration (algae)
    'Highway': -2.1,          // Emissions from traffic
    'Industrial': -8.7,       // High emissions
    'Residential': -3.4       // Moderate emissions
  };

  // Calculate carbon impact metrics
  const calculateCarbonMetrics = (data) => {
    if (!data || !data.before || !data.after || !data.class_names) return null;

    const beforeProbs = data.before.probs || [];
    const afterProbs = data.after.probs || [];
    const assumedAreaKm2 = 100; // Assume 100 km² for calculations (adjustable)
    
    let beforeCarbon = 0;
    let afterCarbon = 0;
    
    const carbonByClass = data.class_names.map((className, index) => {
      const beforeArea = (beforeProbs[index] || 0) * assumedAreaKm2;
      const afterArea = (afterProbs[index] || 0) * assumedAreaKm2;
      const factor = carbonFactors[className] || 0;
      
      const beforeCO2 = beforeArea * factor;
      const afterCO2 = afterArea * factor;
      const changeCO2 = afterCO2 - beforeCO2;
      
      beforeCarbon += beforeCO2;
      afterCarbon += afterCO2;
      
      return {
        className,
        beforeArea,
        afterArea,
        areaChange: afterArea - beforeArea,
        factor,
        beforeCO2,
        afterCO2,
        changeCO2,
        impact: changeCO2 > 0 ? 'positive' : changeCO2 < 0 ? 'negative' : 'neutral'
      };
    }).filter(item => Math.abs(item.changeCO2) > 0.1); // Filter significant changes

    const totalCarbonChange = afterCarbon - beforeCarbon;
    const yearsSpan = (data.after_year || 2020) - (data.before_year || 2010);
    const annualCarbonRate = totalCarbonChange / yearsSpan;

    // Calculate carbon footprint categories
    const sequestrationSources = carbonByClass.filter(c => c.changeCO2 > 0);
    const emissionSources = carbonByClass.filter(c => c.changeCO2 < 0);
    
    const totalSequestration = sequestrationSources.reduce((sum, c) => sum + c.changeCO2, 0);
    const totalEmissions = Math.abs(emissionSources.reduce((sum, c) => sum + c.changeCO2, 0));
    const netImpact = totalSequestration - totalEmissions;

    return {
      beforeCarbon,
      afterCarbon,
      totalCarbonChange,
      annualCarbonRate,
      carbonByClass: carbonByClass.sort((a, b) => Math.abs(b.changeCO2) - Math.abs(a.changeCO2)),
      sequestrationSources,
      emissionSources,
      totalSequestration,
      totalEmissions,
      netImpact,
      assumedAreaKm2
    };
  };

  // Generate temporal carbon data
  const generateCarbonTimeline = (data, carbonMetrics) => {
    if (!carbonMetrics) return [];

    const beforeYear = data.before_year || 2010;
    const afterYear = data.after_year || 2020;
    const yearsSpan = afterYear - beforeYear;
    
    const timeline = [];
    for (let i = 0; i <= yearsSpan; i++) {
      const progress = i / yearsSpan;
      const year = beforeYear + i;
      const carbonValue = carbonMetrics.beforeCarbon + 
        (carbonMetrics.totalCarbonChange * progress);
      
      timeline.push({
        year,
        carbonFootprint: carbonValue,
        sequestration: carbonMetrics.totalSequestration * progress,
        emissions: carbonMetrics.totalEmissions * progress,
        cumulative: carbonValue
      });
    }
    
    return timeline;
  };

  const carbonMetrics = calculateCarbonMetrics(analysisData);
  const carbonTimeline = carbonMetrics ? generateCarbonTimeline(analysisData, carbonMetrics) : [];

  if (!carbonMetrics) return null;

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
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {label}
            </Typography>
            {payload.map((entry, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                <strong>{entry.name}:</strong> {entry.value.toFixed(1)} tons CO₂/year
              </Typography>
            ))}
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const getCarbonColor = (value, mode) => {
    if (value > 0) return mode === 'dark' ? '#10b981' : '#059669'; // Green for sequestration
    if (value < 0) return mode === 'dark' ? '#ef4444' : '#dc2626'; // Red for emissions
    return mode === 'dark' ? '#64748b' : '#475569'; // Gray for neutral
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'positive': return <TrendingUp sx={{ color: '#10b981' }} />;
      case 'negative': return <TrendingDown sx={{ color: '#ef4444' }} />;
      default: return <Nature sx={{ color: '#64748b' }} />;
    }
  };

  const MetricCard = ({ title, value, subtitle, icon, color, unit = 'tons CO₂/year' }) => (
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
      <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
          <Avatar sx={{ bgcolor: alpha(color, 0.1), color: color, width: 40, height: 40 }}>
            {icon}
          </Avatar>
        </Box>
        
        <Typography variant="h5" sx={{ fontWeight: 700, color: color, mb: 1 }}>
          {value > 0 ? '+' : ''}{value.toFixed(1)}
        </Typography>
        
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          {unit}
        </Typography>
        
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );

  // Carbon footprint breakdown for pie chart
  const footprintBreakdown = [
    { 
      name: 'Carbon Sequestration', 
      value: carbonMetrics.totalSequestration,
      color: '#10b981'
    },
    { 
      name: 'Carbon Emissions', 
      value: carbonMetrics.totalEmissions,
      color: '#ef4444'
    }
  ].filter(item => item.value > 0);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        🌱 Carbon Impact Tracker
      </Typography>

      {/* Key Carbon Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard 
            title="Net Carbon Impact"
            value={carbonMetrics.netImpact}
            subtitle="Total change in carbon balance"
            icon={<Co2 />}
            color={getCarbonColor(carbonMetrics.netImpact, themeMode)}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard 
            title="Annual Rate"
            value={carbonMetrics.annualCarbonRate}
            subtitle="Carbon change per year"
            icon={<TrendingUp />}
            color="#6366f1"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard 
            title="Sequestration"
            value={carbonMetrics.totalSequestration}
            subtitle="Carbon absorbed"
            icon={<ForestIcon />}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <MetricCard 
            title="Emissions"
            value={carbonMetrics.totalEmissions}
            subtitle="Carbon released"
            icon={<Factory />}
            color="#ef4444"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Carbon Timeline */}
        <Grid item xs={12} lg={8}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
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
                <Co2 sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Carbon Footprint Timeline
                </Typography>
              </Box>

              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={carbonTimeline}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={alpha(theme.palette.text.secondary, 0.3)}
                  />
                  <XAxis 
                    dataKey="year" 
                    stroke={theme.palette.text.secondary}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke={theme.palette.text.secondary}
                    tick={{ fontSize: 12 }}
                    label={{ 
                      value: 'CO₂ (tons/year)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  
                  <Area
                    type="monotone"
                    dataKey="sequestration"
                    stackId="1"
                    stroke="#10b981"
                    fill={alpha('#10b981', 0.6)}
                    name="Sequestration"
                  />
                  <Area
                    type="monotone"
                    dataKey="emissions"
                    stackId="2"
                    stroke="#ef4444"
                    fill={alpha('#ef4444', 0.6)}
                    name="Emissions"
                  />
                  <Line
                    type="monotone"
                    dataKey="carbonFootprint"
                    stroke={themeMode === 'dark' ? '#3b82f6' : '#2563eb'}
                    strokeWidth={3}
                    dot={{ fill: themeMode === 'dark' ? '#3b82f6' : '#2563eb', r: 4 }}
                    name="Net Carbon"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Carbon Breakdown */}
        <Grid item xs={12} lg={4}>
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
                <Nature sx={{ color: theme.palette.secondary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Impact Breakdown
                </Typography>
              </Box>

              {footprintBreakdown.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={footprintBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {footprintBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value.toFixed(1)} tons CO₂/year`, '']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {/* Impact Assessment */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  color: getCarbonColor(carbonMetrics.netImpact, themeMode),
                  mb: 1 
                }}>
                  {carbonMetrics.netImpact > 0 ? '+' : ''}{carbonMetrics.netImpact.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Net Carbon Impact (tons CO₂/year)
                </Typography>
                
                <Chip 
                  icon={carbonMetrics.netImpact > 0 ? <CheckCircle /> : <Warning />}
                  label={carbonMetrics.netImpact > 0 ? 'Carbon Positive' : 'Carbon Negative'}
                  color={carbonMetrics.netImpact > 0 ? 'success' : 'error'}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Class-wise Carbon Impact */}
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
            <Agriculture sx={{ color: '#10b981' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Land Use Carbon Impact Analysis
            </Typography>
          </Box>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={carbonMetrics.carbonByClass.slice(0, 8)} layout="vertical">
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={alpha(theme.palette.text.secondary, 0.3)}
              />
              <XAxis 
                type="number"
                stroke={theme.palette.text.secondary}
                tick={{ fontSize: 12 }}
                label={{ value: 'CO₂ Impact (tons/year)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                type="category"
                dataKey="className"
                stroke={theme.palette.text.secondary}
                tick={{ fontSize: 11 }}
                width={120}
              />
              <Tooltip 
                formatter={(value, name) => [`${value.toFixed(1)} tons CO₂/year`, 'Carbon Change']}
                labelFormatter={(label) => `${label} Impact`}
              />
              <Bar 
                dataKey="changeCO2" 
                fill={(entry) => getCarbonColor(entry.changeCO2, themeMode)}
                name="Carbon Change"
                radius={[0, 4, 4, 0]}
              >
                {carbonMetrics.carbonByClass.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCarbonColor(entry.changeCO2, themeMode)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              🌿 Carbon Impact Summary:
            </Typography>
            <Grid container spacing={2}>
              {carbonMetrics.carbonByClass.slice(0, 6).map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 1,
                    backgroundColor: alpha(getCarbonColor(item.changeCO2, themeMode), 0.1),
                    border: '1px solid',
                    borderColor: alpha(getCarbonColor(item.changeCO2, themeMode), 0.3)
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {getImpactIcon(item.impact)}
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {item.className}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.changeCO2 > 0 ? '+' : ''}{item.changeCO2.toFixed(1)} tons CO₂/year
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Area change: {item.areaChange.toFixed(1)} km²
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CarbonImpactTracker;
