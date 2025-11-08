import React, { useRef, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Grid, 
  Switch, 
  FormControlLabel, 
  Paper,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Divider,
  Chip,
  alpha
} from '@mui/material';
import { 
  CloudUpload, 
  PhotoCamera, 
  Settings, 
  Timeline,
  Assessment,
  Delete,
  Visibility
} from '@mui/icons-material';

function ImageUpload({ onUpload }) {
  const beforeRef = useRef();
  const afterRef = useRef();
  const [beforeYear, setBeforeYear] = useState(2010);
  const [afterYear, setAfterYear] = useState(2020);
  const [withGradcam, setWithGradcam] = useState(true);
  const [withReport, setWithReport] = useState(true);
  const [futureYears, setFutureYears] = useState(5);
  const [reportDetail, setReportDetail] = useState('Both');
  const [previews, setPreviews] = useState({ before: null, after: null });
  const [files, setFiles] = useState({ before: null, after: null });

  const onFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews((p) => ({ ...p, [type]: url }));
      setFiles((f) => ({ ...f, [type]: file }));
    }
  };

  const clearPreview = (type) => {
    setPreviews((p) => ({ ...p, [type]: null }));
    setFiles((f) => ({ ...f, [type]: null }));
    if (type === 'before') {
      beforeRef.current.value = '';
    } else {
      afterRef.current.value = '';
    }
  };

  const submit = () => {
    console.log('Submit button clicked');
    const before = files.before;
    const after = files.after;
    console.log('Files:', { before: before?.name, after: after?.name });
    
    if (!before || !after) {
      console.log('Missing files, cannot submit');
      return;
    }
    
    const formData = new FormData();
    formData.append('before', before);
    formData.append('after', after);
    formData.append('before_year', beforeYear);
    formData.append('after_year', afterYear);
    
    console.log('FormData prepared, calling onUpload with options:', { withGradcam, withReport, futureYears, reportDetail });
    onUpload(formData, { withGradcam, withReport, futureYears, reportDetail });
  };

  const UploadArea = ({ title, fileRef, type, year, setYear }) => (
    <Card 
      sx={{ 
        height: '100%',
        border: '2px dashed',
        borderColor: previews[type] ? 'primary.main' : 'grey.300',
        borderRadius: 3,
        background: previews[type] 
          ? `linear-gradient(135deg, ${alpha('#2E7D32', 0.1)}, ${alpha('#FF6B35', 0.1)})`
          : 'background.paper',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PhotoCamera sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        {previews[type] ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box 
              sx={{ 
                flex: 1,
                backgroundImage: `url(${previews[type]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: 2,
                mb: 2,
                minHeight: 200,
                position: 'relative'
              }}
            >
              <IconButton
                onClick={() => clearPreview(type)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
                }}
                size="small"
              >
                <Delete />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Visibility sx={{ fontSize: 16, color: 'success.main' }} />
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                Image uploaded successfully
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box 
            sx={{ 
              flex: 1,
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              minHeight: 200,
              cursor: 'pointer',
              '&:hover .upload-icon': {
                transform: 'scale(1.1)',
                color: 'primary.main'
              }
            }}
            onClick={() => fileRef.current?.click()}
          >
            <CloudUpload 
              className="upload-icon"
              sx={{ 
                fontSize: 48, 
                color: 'grey.400',
                mb: 2,
                transition: 'all 0.3s ease'
              }} 
            />
            <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500, mb: 1 }}>
              Click to upload satellite image
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supports PNG, JPG, JPEG formats
            </Typography>
          </Box>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          style={{ display: 'none' }}
          onChange={(e) => onFileChange(e, type)}
        />

        <Divider sx={{ my: 2 }} />

        <TextField
          label={`${title} Year`}
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </CardContent>
    </Card>
  );

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 4,
        background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.05), rgba(255, 107, 53, 0.05))',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            background: 'linear-gradient(135deg, #2E7D32, #FF6B35)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
            mb: 1
          }}
        >
          Upload Satellite Images
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload before and after satellite images to detect environmental changes
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <UploadArea 
            title="Before Image" 
            fileRef={beforeRef} 
            type="before"
            year={beforeYear}
            setYear={setBeforeYear}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <UploadArea 
            title="After Image" 
            fileRef={afterRef} 
            type="after"
            year={afterYear}
            setYear={setAfterYear}
          />
        </Grid>
      </Grid>

      <Card sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Settings sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
              Analysis Configuration
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={withGradcam} 
                    onChange={(e) => setWithGradcam(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Assessment sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">Enable GradCAM Analysis</Typography>
                  </Box>
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={withReport} 
                    onChange={(e) => setWithReport(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Timeline sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">Generate AI Report</Typography>
                  </Box>
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Future Prediction Years"
                type="number"
                value={futureYears}
                onChange={(e) => setFutureYears(parseInt(e.target.value))}
                variant="outlined"
                size="small"
                fullWidth
                inputProps={{ min: 1, max: 20 }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Report Detail Level"
                value={reportDetail}
                onChange={(e) => setReportDetail(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <MenuItem value="Summary">Summary</MenuItem>
                <MenuItem value="Detailed">Detailed</MenuItem>
                <MenuItem value="Both">Both</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center' }}>
        <Button
          onClick={submit}
          variant="contained"
          size="large"
          disabled={!files.before || !files.after}
          startIcon={<CloudUpload />}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #2E7D32, #FF6B35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #1B5E20, #E65100)',
              transform: 'translateY(-2px)',
              boxShadow: 6
            },
            '&:disabled': {
              background: 'grey.300',
              color: 'grey.500'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Analyze Changes
        </Button>
        
        {(!files.before || !files.after) && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Chip 
              label="Upload both images to continue" 
              size="small" 
              color="warning" 
              variant="outlined"
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default ImageUpload;
