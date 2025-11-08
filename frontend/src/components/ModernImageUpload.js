import React, { useState, useCallback } from 'react';
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
  Chip,
  LinearProgress,
  Divider
} from '@mui/material';
import { 
  CloudUpload, 
  PhotoCamera, 
  Settings, 
  Timeline,
  Assessment,
  Delete,
  Visibility,
  RocketLaunch
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

function ModernImageUpload({ onUpload }) {
  const [beforeYear, setBeforeYear] = useState(2010);
  const [afterYear, setAfterYear] = useState(2020);
  const [withGradcam, setWithGradcam] = useState(true);
  const [withReport, setWithReport] = useState(true);
  const [futureYears, setFutureYears] = useState(5);
  const [reportDetail, setReportDetail] = useState('Both');
  const [previews, setPreviews] = useState({ before: null, after: null });
  const [files, setFiles] = useState({ before: null, after: null });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const onDrop = useCallback((acceptedFiles, type) => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews((p) => ({ ...p, [type]: url }));
      setFiles((f) => ({ ...f, [type]: file }));
    }
  }, []);

  const beforeDropzone = useDropzone({
    onDrop: (files) => onDrop(files, 'before'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    multiple: false
  });

  const afterDropzone = useDropzone({
    onDrop: (files) => onDrop(files, 'after'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    multiple: false
  });

  const clearPreview = (type) => {
    if (previews[type]) {
      URL.revokeObjectURL(previews[type]);
    }
    setPreviews((p) => ({ ...p, [type]: null }));
    setFiles((f) => ({ ...f, [type]: null }));
  };

  const handleAnalyze = async () => {
    if (!files.before || !files.after) {
      alert('Please upload both before and after images');
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(0);

    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    const formData = new FormData();
    formData.append('before_image', files.before);
    formData.append('after_image', files.after);
    formData.append('before_year', beforeYear);
    formData.append('after_year', afterYear);

    try {
      await onUpload(formData, {
        withGradcam,
        withReport,
        futureYears,
        reportDetail
      });
      setUploadProgress(100);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  const DropZone = ({ type, dropzone, title, icon, color }) => {
    const hasFile = !!previews[type];

    return (
      <Card
        {...dropzone.getRootProps()}
        sx={{
          height: 280,
          cursor: 'pointer',
          border: hasFile 
            ? `2px solid ${color}` 
            : '2px dashed #e2e8f0',
          borderRadius: 3,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: color,
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${color}20`,
          }
        }}
      >
        <input {...dropzone.getInputProps()} />
        <CardContent
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative'
          }}
        >
          {hasFile ? (
            <>
              <Box
                component="img"
                src={previews[type]}
                alt={`${type} preview`}
                sx={{
                  width: '100%',
                  height: '70%',
                  objectFit: 'cover',
                  borderRadius: 2,
                  mb: 2
                }}
              />
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  clearPreview(type);
                }}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'error.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'error.dark',
                  }
                }}
                size="small"
              >
                <Delete fontSize="small" />
              </IconButton>
              <Typography variant="body2" color={color} fontWeight={600}>
                ✓ {files[type]?.name}
              </Typography>
            </>
          ) : (
            <>
              <Box
                sx={{
                  p: 3,
                  borderRadius: '50%',
                  bgcolor: `${color}10`,
                  mb: 3
                }}
              >
                {React.cloneElement(icon, { 
                  sx: { fontSize: 48, color } 
                })}
              </Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Drag & drop or click to upload
              </Typography>
              <Chip 
                label="JPG, PNG, GIF up to 10MB"
                size="small"
                variant="outlined"
              />
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          gutterBottom
          sx={{ fontWeight: 700 }}
        >
          Upload Satellite Images
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload before and after satellite images to analyze environmental changes using AI
        </Typography>
      </Box>

      {/* Upload Areas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1
            }}>
              <PhotoCamera sx={{ color: 'primary.main' }} /> Before Image
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload the earlier satellite image for comparison
            </Typography>
          </Box>
          <DropZone
            type="before"
            dropzone={beforeDropzone}
            title="Before Image"
            icon={<CloudUpload />}
            color="#2563eb"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1
            }}>
              <Timeline sx={{ color: 'secondary.main' }} /> After Image
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload the recent satellite image for comparison
            </Typography>
          </Box>
          <DropZone
            type="after"
            dropzone={afterDropzone}
            title="After Image"
            icon={<CloudUpload />}
            color="#7c3aed"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Configuration Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Settings sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Analysis Configuration
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Year Inputs */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Before Year"
              type="number"
              value={beforeYear}
              onChange={(e) => setBeforeYear(Number(e.target.value))}
              inputProps={{ min: 1990, max: 2030 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="After Year"
              type="number"
              value={afterYear}
              onChange={(e) => setAfterYear(Number(e.target.value))}
              inputProps={{ min: 1990, max: 2030 }}
            />
          </Grid>

          {/* Analysis Options */}
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Visibility />
                  Generate GradCAM Visualization
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
                  color="secondary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assessment />
                  Generate AI Report
                </Box>
              }
            />
          </Grid>

          {withReport && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Future Prediction Years"
                  type="number"
                  value={futureYears}
                  onChange={(e) => setFutureYears(Number(e.target.value))}
                  inputProps={{ min: 1, max: 20 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Report Detail Level"
                  value={reportDetail}
                  onChange={(e) => setReportDetail(e.target.value)}
                >
                  <MenuItem value="Summary">Summary</MenuItem>
                  <MenuItem value="Full">Detailed</MenuItem>
                  <MenuItem value="Both">Both</MenuItem>
                </TextField>
              </Grid>
            </>
          )}
        </Grid>
      </Box>

      {/* Progress Bar */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="primary.main">
                  Processing images...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(uploadProgress)}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #2563eb, #7c3aed)'
                  }
                }}
              />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyze Button */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleAnalyze}
          disabled={!files.before || !files.after || isAnalyzing}
          startIcon={<RocketLaunch />}
          sx={{
            py: 1.5,
            px: 4,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: 3,
            minWidth: 200
          }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
        </Button>

        {/* Feature indicators */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="AI-Powered" size="small" variant="outlined" />
          <Chip label="Real-time" size="small" variant="outlined" />
          <Chip label="High Accuracy" size="small" variant="outlined" />
        </Box>
      </Box>
    </Paper>
  );
}

export default ModernImageUpload;
