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
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  alpha
} from '@mui/material';
import { 
  Lightbulb, 
  Warning, 
  Shield, 
  Nature,
  ExpandMore,
  PriorityHigh,
  Timeline
} from '@mui/icons-material';

function Recommendations({ recommendations }) {
  // DEBUG: Log what we receive
  console.log('Recommendations component received:', recommendations);
  console.log('Type of recommendations:', typeof recommendations);
  console.log('Is array:', Array.isArray(recommendations));
  
  const recs = recommendations || [];
  console.log('After fallback, recs:', recs);
  
  const urgent = recs.filter(r => r.includes('🚨') || r.toLowerCase().includes('urgent'));
  const preventive = recs.filter(r => r.includes('🔮') || r.toLowerCase().includes('proactive'));
  const general = recs.filter(r => !urgent.includes(r) && !preventive.includes(r));
  
  console.log('Categorized recommendations:', { urgent, preventive, general });

  const Section = ({ title, items, icon, color = 'primary', severity }) => (
    <Accordion 
      elevation={0}
      sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 2,
        '&:before': { display: 'none' },
        '&.Mui-expanded': {
          borderColor: `${color}.main`,
          backgroundColor: alpha(color === 'primary' ? '#2E7D32' : color === 'warning' ? '#FF9800' : '#1976D2', 0.02)
        }
      }}
    >
      <AccordionSummary 
        expandIcon={<ExpandMore />}
        sx={{ 
          '& .MuiAccordionSummary-content': {
            alignItems: 'center',
            gap: 2
          }
        }}
      >
        <Box 
          sx={{ 
            p: 1, 
            borderRadius: 1, 
            backgroundColor: alpha(color === 'primary' ? '#2E7D32' : color === 'warning' ? '#FF9800' : '#1976D2', 0.1),
            color: `${color}.main`
          }}
        >
          {icon}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {severity && (
            <Chip 
              label={severity}
              size="small"
              color={color}
              sx={{ mt: 0.5, fontWeight: 600 }}
            />
          )}
        </Box>
        <Chip 
          label={`${items.length} items`}
          size="small"
          variant="outlined"
          color={color}
        />
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        {items.length > 0 ? (
          <List dense sx={{ p: 0 }}>
            {items.map((r, i) => (
              <ListItem 
                key={`${title}-${i}`} 
                sx={{ 
                  px: 0,
                  py: 1,
                  borderBottom: i < items.length - 1 ? '1px solid' : 'none',
                  borderBottomColor: 'divider'
                }}
              >
                <ListItemText 
                  primary={r}
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    sx: { lineHeight: 1.6 }
                  }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 2,
              backgroundColor: 'background.default',
              borderRadius: 1,
              border: '1px dashed',
              borderColor: 'divider'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No specific {title.toLowerCase()} identified
            </Typography>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );

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
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: 'white',
          p: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Lightbulb />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Actionable Recommendations
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          AI-generated insights and environmental action plans
        </Typography>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Section 
          title="Urgent Actions" 
          items={urgent} 
          icon={<PriorityHigh />}
          color="error"
          severity="Critical"
        />
        
        <Section 
          title="Preventive Measures" 
          items={preventive} 
          icon={<Shield />}
          color="warning"
          severity="Important"
        />
        
        <Section 
          title="General Recommendations" 
          items={general} 
          icon={<Nature />}
          color="primary"
          severity="Advisory"
        />

        {urgent.length === 0 && preventive.length === 0 && general.length === 0 && (
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
            <Lightbulb sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              No specific recommendations generated
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Analysis indicates no immediate action required
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default Recommendations;
