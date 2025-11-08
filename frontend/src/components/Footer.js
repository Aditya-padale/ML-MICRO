import React from 'react';
import { Box, Typography, Link, Divider, Grid, Chip } from '@mui/material';
import { GitHub, Email, LinkedIn } from '@mui/icons-material';

function Footer() {
  return (
    <Box sx={{ mt: 6, py: 4 }}>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>
            🛰️ EuroSAT AI Platform
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Advanced satellite imagery analysis powered by deep learning for environmental monitoring and change detection.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label="AI-Powered" size="small" color="primary" variant="outlined" />
            <Chip label="Real-time Analysis" size="small" color="secondary" variant="outlined" />
            <Chip label="Environmental Focus" size="small" color="success" variant="outlined" />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Built with ❤️ for environmental sustainability
            </Typography>
            <Typography variant="caption" color="text.secondary">
              © 2025 EuroSAT AI Platform. Leveraging satellite technology for a better tomorrow. 🌍
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Footer;
