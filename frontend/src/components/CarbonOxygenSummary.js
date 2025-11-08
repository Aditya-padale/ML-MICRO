import React from 'react';
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Chip } from '@mui/material';
import { estimateCarbonAndOxygen } from '../utils/carbon_oxygen_estimator';

const CarbonOxygenSummary = ({ analysisData, assumedAreaKm2 = 100 }) => {
  const summary = estimateCarbonAndOxygen(analysisData, { assumedAreaKm2 });

  // Always render something for debugging
  if (!summary) {
    return (
      <Card elevation={0} sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Carbon & Oxygen Capacity Estimates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No analysis data available for carbon/oxygen estimation.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const { totalCarbonChange, totalOxygenChange, years, sentences } = summary;

  return (
    <Card 
      elevation={0} 
      sx={{ 
        mb: 2,
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: 2,
        background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(33, 150, 243, 0.1) 100%)'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
            🌱 Carbon & Oxygen Capacity Estimates
          </Typography>
          <Chip label={`${years} years`} size="small" color="primary" />
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Total estimated carbon capacity change: <strong>{Math.round(totalCarbonChange).toLocaleString()} tons CO₂</strong>
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Total estimated oxygen capacity change: <strong>{Math.round(totalOxygenChange).toLocaleString()} tons O₂</strong>
        </Typography>

        <List dense>
          {sentences.length ? (
            sentences.map((s, i) => (
              <ListItem key={i}>
                <ListItemText primary={s} />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No significant carbon or oxygen changes detected." />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default CarbonOxygenSummary;
