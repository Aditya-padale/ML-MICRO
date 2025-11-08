import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Card, 
  CardContent,
  LinearProgress,
  Chip,
  alpha
} from '@mui/material';
import { Timeline, TrendingUp, Psychology } from '@mui/icons-material';

function FuturePredictions({ predictions }) {
  const conf = predictions?.confidence ?? 0;
  const preds = predictions?.predictions || [];

  return (
    <Card 
      elevation={0} 
      sx={{ 
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          color: 'white',
          p: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Timeline />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Future Predictions
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          AI-powered forecasting and trend analysis
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Prediction Confidence
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {(conf * 100).toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={conf * 100} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: conf > 0.7 ? 'success.main' : conf > 0.4 ? 'warning.main' : 'error.main',
                borderRadius: 4
              }
            }} 
          />
        </Box>

        {preds.length > 0 ? (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Projected Land Use Changes
            </Typography>
            <List dense sx={{ p: 0 }}>
              {preds.slice(0, 5).map((p, idx) => (
                <ListItem 
                  key={idx} 
                  sx={{ 
                    px: 0,
                    py: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 1,
                    backgroundColor: alpha('#6366F1', 0.02)
                  }}
                >
                  <Box sx={{ width: '100%', px: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {p.land_type}
                      </Typography>
                      <Chip 
                        label={`${(p.probability * 100).toFixed(1)}%`}
                        size="small"
                        color={p.probability > 0.7 ? 'success' : p.probability > 0.4 ? 'warning' : 'default'}
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Psychology sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        Impact: {p.environmental_impact}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={p.probability * 100} 
                      sx={{ 
                        height: 4, 
                        borderRadius: 2,
                        mt: 1,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: p.probability > 0.7 ? 'success.main' : p.probability > 0.4 ? 'warning.main' : 'grey.400',
                          borderRadius: 2
                        }
                      }} 
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 4,
              backgroundColor: 'background.default',
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider'
            }}
          >
            <TrendingUp sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              No significant future trends detected
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Analysis indicates stable environmental conditions
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default FuturePredictions;
