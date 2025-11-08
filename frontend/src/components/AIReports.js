import React from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper, 
  Button, 
  Stack, 
  Card, 
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import { 
  Description, 
  Download, 
  Summarize, 
  Article,
  FileDownload
} from '@mui/icons-material';
import { exportAnalysis } from '../api';

function AIReports({ report, summary }) {
  const [tab, setTab] = React.useState(0);

  const downloadFile = (content, filename) => {
    const blob = new Blob([content || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; 
    a.download = filename; 
    a.click(); 
    URL.revokeObjectURL(url);
  };

  return (
    <Card 
      elevation={0} 
      sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
          color: 'white',
          p: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Description />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            AI-Powered Environmental Reports
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Comprehensive analysis and documentation of environmental changes
        </Typography>
      </Box>

      <CardContent sx={{ p: 0 }}>
        <Tabs 
          value={tab} 
          onChange={(e, v) => setTab(v)} 
          sx={{ 
            borderBottom: '1px solid',
            borderBottomColor: 'divider',
            px: 3
          }}
          variant="fullWidth"
        >
          <Tab 
            icon={<Article />}
            iconPosition="start"
            label="Full Report" 
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab 
            icon={<Summarize />}
            iconPosition="start"
            label="Executive Summary" 
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  📄 Complete Environmental Analysis Report
                </Typography>
                <Chip 
                  label={`${(report || '').split('\n').length} lines`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Box 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  backgroundColor: 'background.default',
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  maxHeight: '400px',
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.6
                }}
              >
                {report || (
                  <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                    <Description sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                    <Typography>No detailed report available</Typography>
                    <Typography variant="caption">
                      Enable AI reporting in the analysis configuration
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
          
          {tab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  📋 Executive Summary
                </Typography>
                <Chip 
                  label="Quick Overview"
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              </Box>
              <Box 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  backgroundColor: 'background.default',
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  maxHeight: '400px',
                  overflow: 'auto',
                  fontFamily: 'system-ui',
                  fontSize: '0.875rem',
                  lineHeight: 1.6
                }}
              >
                {summary || (
                  <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                    <Summarize sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                    <Typography>No summary report available</Typography>
                    <Typography variant="caption">
                      Enable AI reporting in the analysis configuration
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
              <Button 
                variant="outlined" 
                fullWidth
                startIcon={<FileDownload />}
                onClick={() => downloadFile(report, 'environmental_full_report.txt')}
                disabled={!report}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Download Full Report
              </Button>
              <Button 
                variant="outlined" 
                fullWidth
                color="secondary"
                startIcon={<FileDownload />}
                onClick={() => downloadFile(summary, 'environmental_summary.txt')}
                disabled={!summary}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                Download Summary
              </Button>
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AIReports;
