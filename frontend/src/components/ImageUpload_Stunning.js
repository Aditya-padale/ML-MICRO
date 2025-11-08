import React, { useRef, useState, useCallback } from 'react';
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
  alpha,
  Tooltip,
  LinearProgress
} from '@mui/material';
import { 
  CloudUpload, 
  PhotoCamera, 
  Settings, 
  Timeline,
  Assessment,
  Delete,
  Visibility,
  AutoAwesome,
  RocketLaunch,
  Science
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

function EnhancedImageUpload({ onUpload }) {
  const [beforeYear, setBeforeYear] = useState(2010);
  const [afterYear, setAfterYear] = useState(2020);
  const [withGradcam, setWithGradcam] = useState(true);
  const [withReport, setWithReport] = useState(true);
  const [futureYears, setFutureYears] = useState(5);
  const [reportDetail, setReportDetail] = useState('Both');
  const [previews, setPreviews] = useState({ before: null, after: null });
  const [files, setFiles] = useState({ before: null, after: null });
  const [draggedType, setDraggedType] = useState(null);
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
    multiple: false,
    onDragEnter: () => setDraggedType('before'),
    onDragLeave: () => setDraggedType(null)
  });

  const afterDropzone = useDropzone({
    onDrop: (files) => onDrop(files, 'after'),
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    multiple: false,
    onDragEnter: () => setDraggedType('after'),
    onDragLeave: () => setDraggedType(null)
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

    // Simulate progress
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

  const DropZone = ({ type, dropzone, title, subtitle }) => {
    const isActive = draggedType === type;
    const hasFile = !!previews[type];

    return (
      <motion.div
        {...dropzone.getRootProps()}
        whileHover={{ scale: 1.02, rotateX: 2 }}
        whileTap={{ scale: 0.98 }}
        animate={isActive ? { scale: 1.05, rotateY: 5 } : {}}
        style={{ perspective: 1000 }}
      >
        <input {...dropzone.getInputProps()} />
        <Card
          sx={{
            height: 280,
            cursor: 'pointer',
            border: isActive ? '3px dashed #00D4FF' : hasFile ? '2px solid #00E676' : '2px dashed rgba(255, 255, 255, 0.2)',
            background: hasFile 
              ? 'linear-gradient(135deg, rgba(0, 230, 118, 0.1) 0%, rgba(0, 212, 255, 0.05) 100%)'
              : isActive 
              ? 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(255, 107, 157, 0.05) 100%)'
              : 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: hasFile 
                ? 'linear-gradient(135deg, rgba(0, 230, 118, 0.15) 0%, rgba(0, 212, 255, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(0, 212, 255, 0.15) 0%, rgba(255, 107, 157, 0.1) 100%)',
              borderColor: hasFile ? '#00E676' : '#00D4FF',
              boxShadow: hasFile 
                ? '0 12px 40px rgba(0, 230, 118, 0.2)'
                : '0 12px 40px rgba(0, 212, 255, 0.2)'
            }
          }}
        >
          {/* Animated background pattern */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(255, 107, 157, 0.3) 0%, transparent 50%)
              `
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          <CardContent
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1
            }}
          >
            {hasFile ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ width: '100%', height: '100%', position: 'relative' }}
              >
                <Box
                  component="img"
                  src={previews[type]}
                  alt={`${type} preview`}
                  sx={{
                    width: '100%',
                    height: '80%',
                    objectFit: 'cover',
                    borderRadius: 2,
                    mb: 1,
                    filter: 'brightness(1.1) contrast(1.1)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                  }}
                />
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        clearPreview(type);
                      }}
                      sx={{
                        background: 'rgba(255, 82, 82, 0.8)',
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        '&:hover': {
                          background: 'rgba(255, 82, 82, 1)',
                          boxShadow: '0 4px 16px rgba(255, 82, 82, 0.4)'
                        }
                      }}
                      size="small"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </motion.div>
                </Box>
                <Typography variant="body2" color="success.main" fontWeight={600}>
                  ✓ {files[type]?.name}
                </Typography>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center' }}
              >
                <motion.div
                  animate={isActive ? { 
                    scale: [1, 1.2, 1], 
                    rotate: [0, 180, 360],
                    filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)']
                  } : {}}
                  transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
                >
                  <CloudUpload 
                    sx={{ 
                      fontSize: 60, 
                      color: isActive ? '#00D4FF' : 'rgba(255, 255, 255, 0.6)',
                      mb: 2,
                      filter: isActive ? 'drop-shadow(0 0 20px #00D4FF)' : 'none'
                    }} 
                  />
                </motion.div>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="primary.main" 
                  sx={{ 
                    mt: 1, 
                    display: 'block',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Click or drag to upload
                </Typography>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #00D4FF 0%, #FF6B9D 50%, #00E676 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 2
            }}
          >
            🚀 Upload Satellite Images
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Compare satellite images from different time periods to detect environmental changes 
            using our advanced AI analysis system
          </Typography>
        </Box>
      </motion.div>

      {/* Upload Areas */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <PhotoCamera /> Before Image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload the earlier satellite image for comparison
              </Typography>
            </Box>
            <DropZone
              type="before"
              dropzone={beforeDropzone}
              title="Before Image"
              subtitle="Drop your before satellite image here"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 600, 
                color: 'secondary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <Timeline /> After Image
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upload the recent satellite image for comparison
              </Typography>
            </Box>
            <DropZone
              type="after"
              dropzone={afterDropzone}
              title="After Image"
              subtitle="Drop your after satellite image here"
            />
          </Grid>
        </Grid>
      </motion.div>

      {/* Configuration Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Card sx={{ 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Settings sx={{ mr: 1, color: 'primary.main' }} />
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover': {
                        '& fieldset': {
                          borderColor: 'primary.main',
                          boxShadow: '0 0 10px rgba(0, 212, 255, 0.2)'
                        }
                      }
                    }
                  }}
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover': {
                        '& fieldset': {
                          borderColor: 'secondary.main',
                          boxShadow: '0 0 10px rgba(255, 107, 157, 0.2)'
                        }
                      }
                    }
                  }}
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Bar */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            style={{ marginBottom: '2rem' }}
          >
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="primary.main">
                Uploading and analyzing images... {Math.round(uploadProgress)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={uploadProgress}
              sx={{
                height: 8,
                borderRadius: 4,
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #00D4FF, #FF6B9D, #00E676)'
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analyze Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{ textAlign: 'center' }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={handleAnalyze}
          disabled={!files.before || !files.after || isAnalyzing}
          startIcon={<RocketLaunch />}
          sx={{
            py: 2,
            px: 6,
            fontSize: '1.1rem',
            fontWeight: 700,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #00D4FF 0%, #FF6B9D 50%, #00E676 100%)',
            boxShadow: '0 12px 40px rgba(0, 212, 255, 0.3)',
            textTransform: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #0099CC 0%, #CC557E 50%, #00B248 100%)',
              boxShadow: '0 16px 48px rgba(0, 212, 255, 0.4)',
              transform: 'translateY(-2px)'
            },
            '&:disabled': {
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.5)'
            }
          }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Start AI Analysis'}
        </Button>

        {/* Feature chips */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          {[
            { label: 'AI-Powered', icon: <AutoAwesome />, color: '#00D4FF' },
            { label: 'Real-time Processing', icon: <Timeline />, color: '#FF6B9D' },
            { label: 'Advanced Analytics', icon: <Science />, color: '#00E676' }
          ].map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <Chip
                icon={feature.icon}
                label={feature.label}
                sx={{
                  background: `${feature.color}20`,
                  border: `1px solid ${feature.color}40`,
                  color: feature.color,
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: feature.color
                  }
                }}
              />
            </motion.div>
          ))}
        </Box>
      </motion.div>
    </Box>
  );
}

export default EnhancedImageUpload;
