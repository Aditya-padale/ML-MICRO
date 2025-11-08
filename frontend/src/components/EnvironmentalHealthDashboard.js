import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  useTheme, 
  alpha,
  Chip
} from '@mui/material';
import { 
  ResponsiveContainer, 
  RadialBarChart, 
  RadialBar, 
  PieChart,
  Pie,
  Cell 
} from 'recharts';
import { 
  Water, 
  Nature, 
  ThermostatRounded, 
  Air,
  Warning,
  CheckCircle,
  Forest,
  Agriculture
} from '@mui/icons-material';
import CarbonOxygenSummary from './CarbonOxygenSummary';

const EnvironmentalHealthDashboard = ({ analysisData, themeMode = 'light' }) => {
  const theme = useTheme();

  // Calculate environmental health metrics from analysis data
  const calculateEnvironmentalMetrics = (data) => {
    if (!data || !data.before || !data.after) return null;

    const beforeProbs = data.before.probs || [];
    const afterProbs = data.after.probs || [];
    const classNames = data.class_names || [];

    // Calculate metrics based on land use changes
    const getClassIndex = (className) => classNames.indexOf(className);
    
    // Water Quality Index (based on River and SeaLake)
    const waterClasses = ['River', 'SeaLake'];
    const waterQuality = waterClasses.reduce((sum, className) => {
      const index = getClassIndex(className);
      return sum + (afterProbs[index] || 0);
    }, 0) * 100;

    // Vegetation Health Index (Forest + HerbaceousVegetation + Pasture)
    const vegClasses = ['Forest', 'HerbaceousVegetation', 'Pasture', 'PermanentCrop'];
    const vegetationHealth = vegClasses.reduce((sum, className) => {
      const index = getClassIndex(className);
      return sum + (afterProbs[index] || 0);
    }, 0) * 100;

    // Air Quality Index (inverse of Industrial and Highway)
    const pollutionClasses = ['Industrial', 'Highway'];
    const pollutionLevel = pollutionClasses.reduce((sum, className) => {
      const index = getClassIndex(className);
      return sum + (afterProbs[index] || 0);
    }, 0) * 100;
    const airQuality = Math.max(0, 100 - pollutionLevel);

    // Biodiversity Index (based on variety of natural habitats)
    const naturalClasses = ['Forest', 'HerbaceousVegetation', 'River', 'SeaLake'];
    const biodiversity = naturalClasses.filter(className => {
      const index = getClassIndex(className);
      return (afterProbs[index] || 0) > 0.05; // 5% threshold
    }).length * 25; // Scale to 0-100

    // Overall Environmental Health Score
    const overallHealth = (waterQuality + vegetationHealth + airQuality + biodiversity) / 4;

    return {
      waterQuality: Math.min(100, waterQuality),
      vegetationHealth: Math.min(100, vegetationHealth),
      airQuality: Math.min(100, airQuality),
      biodiversity: Math.min(100, biodiversity),
      overallHealth: Math.min(100, overallHealth)
    };
  };

  const metrics = calculateEnvironmentalMetrics(analysisData);

  if (!metrics) return null;

  // Gauge component for individual metrics
  const GaugeChart = ({ 
    value, 
    maxValue = 100, 
    title, 
    icon, 
    color,
    subtitle 
  }) => {
    const angle = (value / maxValue) * 180;
    const needleColor = themeMode === 'dark' ? '#ffffff' : '#000000';
    
    const data = [
      {
        name: 'bg',
        value: 100,
        fill: alpha(theme.palette.grey[400], 0.2)
      },
      {
        name: 'value',
        value: value,
        fill: color
      }
    ];

    const getHealthStatus = (value) => {
      if (value >= 80) return { status: 'Excellent', color: 'success', icon: <CheckCircle /> };
      if (value >= 60) return { status: 'Good', color: 'success', icon: <CheckCircle /> };
      if (value >= 40) return { status: 'Moderate', color: 'warning', icon: <Warning /> };
      return { status: 'Poor', color: 'error', icon: <Warning /> };
    };

    const healthStatus = getHealthStatus(value);

    return (
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
            boxShadow: `0 8px 32px ${alpha(color, 0.2)}`
          }
        }}
      >
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <Box sx={{ color: color }}>{icon}</Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>

          {/* Gauge Chart */}
          <Box sx={{ height: 160, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="80%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Value Display */}
            <Box sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -20%)',
              textAlign: 'center'
            }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: color }}>
                {Math.round(value)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                out of {maxValue}
              </Typography>
            </Box>
          </Box>

          {/* Status */}
          <Box sx={{ mt: 2 }}>
            <Chip 
              icon={healthStatus.icon}
              label={healthStatus.status}
              color={healthStatus.color}
              size="small"
              sx={{ fontWeight: 600 }}
            />
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Overall Health Radial Chart
  const OverallHealthChart = () => {
    const healthData = [
      { name: 'Water Quality', value: metrics.waterQuality, color: '#06b6d4' },
      { name: 'Vegetation Health', value: metrics.vegetationHealth, color: '#10b981' },
      { name: 'Air Quality', value: metrics.airQuality, color: '#8b5cf6' },
      { name: 'Biodiversity', value: metrics.biodiversity, color: '#f59e0b' }
    ];

    return (
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
            <Nature sx={{ color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Overall Environmental Health
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {Math.round(metrics.overallHealth)}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Health Score
            </Typography>
          </Box>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={healthData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {healthData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <Grid container spacing={1} sx={{ mt: 2 }}>
            {healthData.map((item, index) => (
              <Grid item xs={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
                  <Box 
                    sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%', 
                      backgroundColor: item.color 
                    }} 
                  />
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    {item.name}: {Math.round(item.value)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Render carbon/oxygen summary if analysisData available
  const CarbonOxygenSummary = ({ data }) => {
    if (!data || !data.carbonOxygen) return null;

    const { carbonSequestration, oxygenProduction } = data.carbonOxygen;

    return (
      <Card 
        elevation={0}
        sx={{ 
          height: '100%',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          background: themeMode === 'dark' 
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.info.dark, 0.1)} 100%)`
            : `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            🌱 Carbon Sequestration & Oxygen Production
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Carbon Sequestration
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {carbonSequestration} kg CO₂
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary">
                Oxygen Production
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                {oxygenProduction} kg O₂
              </Typography>
            </Box>
          </Box>

          <Box sx={{ height: 120, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'CO₂', value: carbonSequestration, fill: alpha(theme.palette.info.main, 0.7) },
                    { name: 'O₂', value: oxygenProduction, fill: alpha(theme.palette.success.main, 0.7) }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        🌍 Environmental Health Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Individual Metric Gauges */}
        <Grid item xs={12} sm={6} lg={3}>
          <GaugeChart 
            value={metrics.waterQuality}
            title="Water Quality"
            icon={<Water />}
            color="#06b6d4"
            subtitle="River & lake health"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <GaugeChart 
            value={metrics.vegetationHealth}
            title="Vegetation Health"
            icon={<Forest />}
            color="#10b981"
            subtitle="Forest & crop coverage"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <GaugeChart 
            value={metrics.airQuality}
            title="Air Quality"
            icon={<Air />}
            color="#8b5cf6"
            subtitle="Pollution levels"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <GaugeChart 
            value={metrics.biodiversity}
            title="Biodiversity Index"
            icon={<Agriculture />}
            color="#f59e0b"
            subtitle="Habitat diversity"
          />
        </Grid>



        {/* Carbon & Oxygen Estimates */}
        <Grid item xs={12}>
          <CarbonOxygenSummary analysisData={analysisData} assumedAreaKm2={100} />
        </Grid>

        {/* Environmental Impact Summary */}
        <Grid item xs={12} lg={6}>
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
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                📊 Environmental Insights
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {metrics.waterQuality > 70 && (
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 1, 
                    backgroundColor: alpha('#06b6d4', 0.1),
                    border: '1px solid',
                    borderColor: alpha('#06b6d4', 0.3)
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      💧 <strong>Healthy Water Bodies:</strong> Water coverage indicates good aquatic ecosystem health
                    </Typography>
                  </Box>
                )}
                
                {metrics.vegetationHealth > 60 && (
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 1, 
                    backgroundColor: alpha('#10b981', 0.1),
                    border: '1px solid',
                    borderColor: alpha('#10b981', 0.3)
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      🌱 <strong>Rich Vegetation:</strong> Strong forest and agricultural coverage supports carbon sequestration
                    </Typography>
                  </Box>
                )}
                
                {metrics.airQuality > 70 && (
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 1, 
                    backgroundColor: alpha('#8b5cf6', 0.1),
                    border: '1px solid',
                    borderColor: alpha('#8b5cf6', 0.3)
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      🌬️ <strong>Clean Air:</strong> Low industrial pollution maintains air quality standards
                    </Typography>
                  </Box>
                )}
                
                {metrics.biodiversity > 50 && (
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 1, 
                    backgroundColor: alpha('#f59e0b', 0.1),
                    border: '1px solid',
                    borderColor: alpha('#f59e0b', 0.3)
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      🦋 <strong>High Biodiversity:</strong> Diverse habitat types support varied wildlife populations
                    </Typography>
                  </Box>
                )}
                
                {metrics.overallHealth < 50 && (
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 1, 
                    backgroundColor: alpha('#ef4444', 0.1),
                    border: '1px solid',
                    borderColor: alpha('#ef4444', 0.3)
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ⚠️ <strong>Action Required:</strong> Environmental degradation detected - conservation measures recommended
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EnvironmentalHealthDashboard;
