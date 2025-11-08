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
  LinearProgress
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Psychology, 
  AssessmentOutlined, 
  SpeedOutlined,
  CheckCircleOutlined,
  WarningAmberOutlined,
  TrendingUpOutlined,
  Memory,
  Timer
} from '@mui/icons-material';

const ModelPerformanceAnalytics = ({ analysisData, themeMode = 'light' }) => {
  const theme = useTheme();

  // Calculate model performance metrics
  const calculatePerformanceMetrics = (data) => {
    if (!data || !data.before || !data.after) return null;

    const beforeConf = data.before.confidence || 0;
    const afterConf = data.after.confidence || 0;
    const beforeProbs = data.before.probs || [];
    const afterProbs = data.after.probs || [];

    // Average confidence across both predictions
    const avgConfidence = (beforeConf + afterConf) / 2;
    
    // Prediction certainty (how decisive the model is)
    const beforeCertainty = Math.max(...beforeProbs);
    const afterCertainty = Math.max(...afterProbs);
    const avgCertainty = (beforeCertainty + afterCertainty) / 2;

    // Model consistency (how similar the top predictions are)
    const beforeTop3 = [...beforeProbs].sort((a, b) => b - a).slice(0, 3);
    const afterTop3 = [...afterProbs].sort((a, b) => b - a).slice(0, 3);
    const consistency = 1 - Math.abs(beforeTop3[0] - afterTop3[0]);

    // Prediction diversity (entropy-like measure)
    const calculateEntropy = (probs) => {
      return -probs.reduce((sum, p) => sum + (p > 0 ? p * Math.log2(p) : 0), 0);
    };
    const beforeEntropy = calculateEntropy(beforeProbs);
    const afterEntropy = calculateEntropy(afterProbs);
    const avgEntropy = (beforeEntropy + afterEntropy) / 2;

    // Classification quality score
    const qualityScore = (avgConfidence * 0.4 + avgCertainty * 0.4 + consistency * 0.2) * 100;

    return {
      avgConfidence: avgConfidence * 100,
      avgCertainty: avgCertainty * 100,
      consistency: consistency * 100,
      entropy: avgEntropy,
      qualityScore,
      beforeConf: beforeConf * 100,
      afterConf: afterConf * 100,
      beforeCertainty: beforeCertainty * 100,
      afterCertainty: afterCertainty * 100
    };
  };

  // Generate class-wise performance data
  const generateClassPerformance = (data) => {
    if (!data || !data.class_names) return [];

    const beforeProbs = data.before?.probs || [];
    const afterProbs = data.after?.probs || [];

    return data.class_names.map((className, index) => ({
      className,
      beforeConf: (beforeProbs[index] || 0) * 100,
      afterConf: (afterProbs[index] || 0) * 100,
      change: ((afterProbs[index] || 0) - (beforeProbs[index] || 0)) * 100,
      avgConf: ((beforeProbs[index] || 0) + (afterProbs[index] || 0)) * 50
    })).sort((a, b) => b.avgConf - a.avgConf);
  };

  const performanceMetrics = calculatePerformanceMetrics(analysisData);
  const classPerformance = generateClassPerformance(analysisData);

  if (!performanceMetrics) return null;

  // Performance radar chart data
  const radarData = [
    {
      metric: 'Confidence',
      value: performanceMetrics.avgConfidence,
      fullMark: 100
    },
    {
      metric: 'Certainty',
      value: performanceMetrics.avgCertainty,
      fullMark: 100
    },
    {
      metric: 'Consistency',
      value: performanceMetrics.consistency,
      fullMark: 100
    },
    {
      metric: 'Quality Score',
      value: performanceMetrics.qualityScore,
      fullMark: 100
    }
  ];

  // Confidence distribution data
  const confidenceDistribution = [
    { 
      range: 'High (80-100%)', 
      count: classPerformance.filter(c => c.avgConf >= 80).length,
      color: '#10b981'
    },
    { 
      range: 'Medium (60-80%)', 
      count: classPerformance.filter(c => c.avgConf >= 60 && c.avgConf < 80).length,
      color: '#f59e0b'
    },
    { 
      range: 'Low (0-60%)', 
      count: classPerformance.filter(c => c.avgConf < 60).length,
      color: '#ef4444'
    }
  ];

  const MetricCard = ({ title, value, subtitle, icon, color, status }) => (
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
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ color: color }}>{icon}</Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Box>
          {status && (
            <Chip 
              label={status}
              size="small"
              color={value > 80 ? 'success' : value > 60 ? 'warning' : 'error'}
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Box>
        
        <Typography variant="h4" sx={{ fontWeight: 700, color: color, mb: 1 }}>
          {typeof value === 'number' ? `${value.toFixed(1)}%` : value}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>

        <LinearProgress 
          variant="determinate" 
          value={typeof value === 'number' ? value : 0}
          sx={{ 
            height: 6, 
            borderRadius: 3,
            backgroundColor: alpha(color, 0.2),
            '& .MuiLinearProgress-bar': {
              backgroundColor: color
            }
          }}
        />
      </CardContent>
    </Card>
  );

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
                  <strong>{entry.dataKey}:</strong> {entry.value.toFixed(1)}%
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const getStatusText = (value) => {
    if (value >= 85) return 'Excellent';
    if (value >= 70) return 'Good';
    if (value >= 55) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        🤖 Model Performance Analytics
      </Typography>

      {/* Key Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Avg Confidence"
            value={performanceMetrics.avgConfidence}
            subtitle="Model prediction confidence"
            icon={<Psychology />}
            color="#6366f1"
            status={getStatusText(performanceMetrics.avgConfidence)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Certainty Score"
            value={performanceMetrics.avgCertainty}
            subtitle="Prediction decisiveness"
            icon={<CheckCircleOutlined />}
            color="#10b981"
            status={getStatusText(performanceMetrics.avgCertainty)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Consistency"
            value={performanceMetrics.consistency}
            subtitle="Temporal stability"
            icon={<SpeedOutlined />}
            color="#f59e0b"
            status={getStatusText(performanceMetrics.consistency)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Quality Score"
            value={performanceMetrics.qualityScore}
            subtitle="Overall performance"
            icon={<AssessmentOutlined />}
            color="#8b5cf6"
            status={getStatusText(performanceMetrics.qualityScore)}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Performance Radar Chart */}
        <Grid item xs={12} lg={6}>
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
                <Memory sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Performance Profile
                </Typography>
              </Box>

              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={alpha(theme.palette.text.secondary, 0.3)} />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                  />
                  <PolarRadiusAxis 
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
                  />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke={theme.palette.primary.main}
                    fill={alpha(theme.palette.primary.main, 0.3)}
                    strokeWidth={3}
                    dot={{ fill: theme.palette.primary.main, r: 4 }}
                  />
                </RadarChart>
              </ResponsiveContainer>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Average Performance: <strong>{radarData.reduce((sum, d) => sum + d.value, 0) / radarData.length}%</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Confidence Distribution */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Timer sx={{ color: theme.palette.secondary.main }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Confidence Distribution
                </Typography>
              </Box>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={confidenceDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {confidenceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value} classes`,
                      props.payload.range
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>

              <Box sx={{ mt: 2 }}>
                {confidenceDistribution.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        backgroundColor: item.color 
                      }} 
                    />
                    <Typography variant="body2">
                      {item.range}: <strong>{item.count} classes</strong>
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Class-wise Performance Chart */}
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
            <TrendingUpOutlined sx={{ color: '#10b981' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Class-wise Performance Analysis
            </Typography>
          </Box>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={classPerformance.slice(0, 8)} layout="horizontal">
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={alpha(theme.palette.text.secondary, 0.3)}
              />
              <XAxis 
                type="number"
                domain={[0, 100]}
                stroke={theme.palette.text.secondary}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                type="category"
                dataKey="className"
                stroke={theme.palette.text.secondary}
                tick={{ fontSize: 11 }}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="beforeConf" 
                fill={themeMode === 'dark' ? '#3b82f6' : '#2563eb'}
                name="Before" 
                radius={[0, 4, 4, 0]}
              />
              <Bar 
                dataKey="afterConf" 
                fill={themeMode === 'dark' ? '#10b981' : '#059669'}
                name="After" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              📊 Performance Insights:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 1,
                  backgroundColor: alpha('#10b981', 0.1),
                  border: '1px solid',
                  borderColor: alpha('#10b981', 0.3)
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    🎯 <strong>Top Performer:</strong> {classPerformance[0]?.className} 
                    ({classPerformance[0]?.avgConf.toFixed(1)}% avg confidence)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 1,
                  backgroundColor: alpha('#f59e0b', 0.1),
                  border: '1px solid',
                  borderColor: alpha('#f59e0b', 0.3)
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    📈 <strong>Most Improved:</strong> {
                      classPerformance.reduce((max, c) => c.change > max.change ? c : max, classPerformance[0])?.className
                    } (+{classPerformance.reduce((max, c) => c.change > max.change ? c : max, classPerformance[0])?.change.toFixed(1)}%)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ModelPerformanceAnalytics;
