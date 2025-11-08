import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Chip, 
  Card, 
  CardContent,
  Divider,
  LinearProgress,
  alpha,
  Tabs,
  Tab,
  Button,
  ButtonGroup
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Timeline,
  Visibility,
  CalendarToday,
  Dashboard,
  Nature,
  BarChart as BarChartIcon,
  ShowChart,
  DonutLarge
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Import our new chart components
import LandUseDistributionChart from './LandUseDistributionChart';
import EnvironmentalHealthDashboard from './EnvironmentalHealthDashboard';
import TemporalChangeTimeline from './TemporalChangeTimeline';
import AreaChangeHeatmap from './AreaChangeHeatmap';
import CarbonOxygenSummary from './CarbonOxygenSummary';

function AnalysisDashboard({ analysis, gradcam, themeMode = 'light' }) {
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('overview'); // overview, detailed, advanced
  
  const before = analysis?.before;
  const after = analysis?.after;
  const meta = analysis?.analysis;
  const areaChanges = analysis?.area_changes;

  const MetricCard = ({ title, value, subtitle, icon, color = 'primary', trend }) => (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: `${color}.main`,
          boxShadow: `0 4px 20px ${alpha(color === 'primary' ? '#2E7D32' : '#FF6B35', 0.1)}`
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: `${color}.main`, mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              backgroundColor: alpha(color === 'primary' ? '#2E7D32' : '#FF6B35', 0.1),
              color: `${color}.main`
            }}
          >
            {icon}
          </Box>
        </Box>
        {trend !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {trend > 0 ? (
              <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
            )}
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 600,
                color: trend > 0 ? 'success.main' : 'error.main'
              }}
            >
              {Math.abs(trend).toFixed(1)}% change
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Card 
      elevation={0} 
      sx={{ 
        mb: 4,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
          color: 'white',
          p: 3
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
          📊 Analysis Results
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Comprehensive satellite imagery analysis and environmental change detection
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Before Classification"
              value={before?.pred_class || 'N/A'}
              subtitle={`Confidence: ${((before?.confidence || 0) * 100).toFixed(1)}%`}
              icon={<Assessment />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="After Classification"
              value={after?.pred_class || 'N/A'}
              subtitle={`Confidence: ${((after?.confidence || 0) * 100).toFixed(1)}%`}
              icon={<Assessment />}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Time Period"
              value={`${meta?.years_passed || 0} years`}
              subtitle={`Rate: ${(meta?.temporal_analysis?.velocity || 0).toFixed(3)}/yr`}
              icon={<CalendarToday />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Environmental Impact"
              value={meta?.environmental_impact?.impact_type || 'Unknown'}
              subtitle={`Score: ${(meta?.environmental_impact?.impact_score || 0).toFixed(2)}`}
              icon={<Timeline />}
              color="secondary"
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Classification Comparison
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={(analysis.class_names || []).map((name, idx) => ({
                    name,
                    before: (before?.probs || [])[idx] || 0,
                    after: (after?.probs || [])[idx] || 0,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="before" fill="#8884d8" name="Before" />
                    <Bar dataKey="after" fill="#82ca9d" name="After" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Impact Assessment
                </Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    {((meta?.environmental_impact?.impact_score || 0) * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Impact Score
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(meta?.environmental_impact?.impact_score || 0) * 100} 
                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Change Magnitude Analysis
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={(analysis.class_names || []).map((name, idx) => ({
                    name,
                    change: Math.abs(((after?.probs || [])[idx] || 0) - ((before?.probs || [])[idx] || 0)),
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="change" fill="#ff7c7c" name="Change Magnitude" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Area Changes */}
        {areaChanges?.summary && areaChanges.summary.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              📍 Area Changes Detected
            </Typography>
            <Grid container spacing={2}>
              {areaChanges.summary.slice(0, 4).map((change, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      border: '1px solid',
                      borderColor: change.change_km2 > 0 ? 'success.main' : 'error.main',
                      borderRadius: 2,
                      backgroundColor: alpha(change.change_km2 > 0 ? '#4CAF50' : '#F44336', 0.05)
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        {change.class}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700,
                          color: change.change_km2 > 0 ? 'success.main' : 'error.main',
                          mb: 1
                        }}
                      >
                        {change.change_km2 > 0 ? '+' : ''}{change.change_km2.toFixed(2)} km²
                      </Typography>
                      <Chip 
                        label={`${change.percentage_change > 0 ? '+' : ''}${change.percentage_change.toFixed(1)}%`} 
                        size="small" 
                        color={change.change_km2 > 0 ? 'success' : 'error'}
                        sx={{ fontWeight: 600 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* All Changes Summary */}
        {areaChanges?.summary && areaChanges.summary.length > 4 && (
          <Box sx={{ mb: 4 }}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  📋 Complete Change Summary
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {areaChanges.summary.map((change, idx) => (
                    <Typography 
                      key={idx} 
                      variant="body2" 
                      sx={{ 
                        p: 1.5,
                        backgroundColor: 'background.default',
                        borderRadius: 1,
                        borderLeft: '4px solid',
                        borderLeftColor: change.change_km2 > 0 ? 'success.main' : 'error.main'
                      }}
                    >
                      {change.description}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Navigation Tabs */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              📊 Analysis Views
            </Typography>
            <ButtonGroup size="small" variant="outlined">
              <Button 
                onClick={() => setViewMode('overview')}
                variant={viewMode === 'overview' ? 'contained' : 'outlined'}
              >
                Overview
              </Button>
              <Button 
                onClick={() => setViewMode('detailed')}
                variant={viewMode === 'detailed' ? 'contained' : 'outlined'}
              >
                Detailed
              </Button>
              <Button 
                onClick={() => setViewMode('advanced')}
                variant={viewMode === 'advanced' ? 'contained' : 'outlined'}
              >
                Advanced
              </Button>
            </ButtonGroup>
          </Box>
          
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2 }}
          >
            <Tab icon={<Dashboard />} label="Summary" />
            <Tab icon={<DonutLarge />} label="Distribution" />
            <Tab icon={<Nature />} label="Environment" />
            <Tab icon={<ShowChart />} label="Timeline" />
            <Tab icon={<BarChartIcon />} label="Heatmap" />
            {gradcam && <Tab icon={<Visibility />} label="GradCAM" />}
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            {/* Original Summary Content */}
            {/* Charts Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} lg={8}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Classification Comparison
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={(analysis.class_names || []).map((name, idx) => ({
                        name,
                        before: (before?.probs || [])[idx] || 0,
                        after: (after?.probs || [])[idx] || 0,
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="before" fill="#8884d8" name="Before" />
                        <Bar dataKey="after" fill="#82ca9d" name="After" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      Impact Assessment
                    </Typography>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                        {((meta?.environmental_impact?.impact_score || 0) * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Impact Score
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(meta?.environmental_impact?.impact_score || 0) * 100} 
                        sx={{ mt: 2, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Carbon & Oxygen Capacity Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12}>
                <CarbonOxygenSummary 
                  analysisData={analysis} 
                  assumedAreaKm2={100} 
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ mb: 4 }}>
            <LandUseDistributionChart 
              data={analysis} 
              themeMode={themeMode}
              title="Current Land Use Distribution"
            />
          </Box>
        )}

        {activeTab === 2 && (
          <Box sx={{ mb: 4 }}>
            <EnvironmentalHealthDashboard 
              analysisData={analysis} 
              themeMode={themeMode}
            />
          </Box>
        )}

        {activeTab === 3 && (
          <Box sx={{ mb: 4 }}>
            <TemporalChangeTimeline 
              analysisData={analysis} 
              themeMode={themeMode}
            />
          </Box>
        )}

        {activeTab === 4 && (
          <Box sx={{ mb: 4 }}>
            <AreaChangeHeatmap 
              analysisData={analysis} 
              themeMode={themeMode}
            />
          </Box>
        )}

        {gradcam && activeTab === 5 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              🔍 Grad-CAM Attention Maps
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Visibility sx={{ color: 'primary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Before Image Analysis
                      </Typography>
                    </Box>
                    {gradcam.before_overlay_png_b64 && (
                      <img 
                        src={`data:image/png;base64,${gradcam.before_overlay_png_b64}`} 
                        alt="GradCAM Before" 
                        style={{ 
                          width: '100%', 
                          borderRadius: 8,
                          border: '2px solid #2E7D32'
                        }} 
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Visibility sx={{ color: 'secondary.main' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        After Image Analysis
                      </Typography>
                    </Box>
                    {gradcam.after_overlay_png_b64 && (
                      <img 
                        src={`data:image/png;base64,${gradcam.after_overlay_png_b64}`} 
                        alt="GradCAM After" 
                        style={{ 
                          width: '100%', 
                          borderRadius: 8,
                          border: '2px solid #FF6B35'
                        }} 
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Area Changes Summary - Always visible */}
        {areaChanges?.summary && areaChanges.summary.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              📍 Area Changes Detected
            </Typography>
            <Grid container spacing={2}>
              {areaChanges.summary.slice(0, 4).map((change, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      border: '1px solid',
                      borderColor: change.change_km2 > 0 ? 'success.main' : 'error.main',
                      borderRadius: 2,
                      backgroundColor: alpha(change.change_km2 > 0 ? '#4CAF50' : '#F44336', 0.05)
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        {change.class}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700,
                          color: change.change_km2 > 0 ? 'success.main' : 'error.main',
                          mb: 1
                        }}
                      >
                        {change.change_km2 > 0 ? '+' : ''}{change.change_km2.toFixed(2)} km²
                      </Typography>
                      <Chip 
                        label={`${change.percentage_change > 0 ? '+' : ''}${change.percentage_change.toFixed(1)}%`} 
                        size="small" 
                        color={change.change_km2 > 0 ? 'success' : 'error'}
                        sx={{ fontWeight: 600 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

      </CardContent>
    </Card>
  );
}

export default AnalysisDashboard;
