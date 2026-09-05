import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Slider,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import Cropper from 'react-easy-crop';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CloseIcon from '@mui/icons-material/Close';
import CropIcon from '@mui/icons-material/Crop';
import { getCroppedImg } from '../utils/cropImage';

export default function ImageCropModal({
  open,
  imageSrc,
  onClose,
  onCropComplete,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onCropChange = (newCrop) => setCrop(newCrop);
  const onZoomChange = (newZoom) => setZoom(newZoom);

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setProcessing(true);
    try {
      const croppedFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      if (croppedFile) {
        onCropComplete(croppedFile);
      }
      onClose();
    } catch (error) {
      console.error('Error while cropping image:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleModalClose = () => {
    if (!processing) {
      // Reset state on close
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
      maxWidth="xs"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 4,
          backgroundColor: isDark
            ? alpha(theme.palette.background.paper, 0.9)
            : theme.palette.background.paper,
          backdropFilter: 'blur(16px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          boxShadow: theme.shadows[16],
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          fontWeight: 600,
          fontSize: '1.1rem',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CropIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" fontWeight={600}>
            Crop Profile Picture
          </Typography>
        </Box>
        <IconButton
          onClick={handleModalClose}
          size="small"
          disabled={processing}
          sx={{ color: 'text.secondary' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0, position: 'relative' }}>
        {/* Cropper Container */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: { xs: 280, sm: 320 },
            backgroundColor: isDark ? '#121212' : '#222222',
          }}
        >
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              cropShape="round"
              showGrid={true}
              onCropChange={onCropChange}
              onCropComplete={handleCropComplete}
              onZoomChange={onZoomChange}
            />
          )}
        </Box>

        {/* Controls Section */}
        <Box sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Zoom Slider */}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              Zoom
            </Typography>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
              <ZoomOutIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                onChange={(_, val) => setZoom(val)}
                disabled={processing}
                size="small"
                sx={{
                  color: theme.palette.primary.main,
                }}
              />
              <ZoomInIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </Stack>
          </Box>

          {/* Quick Rotate Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<RotateRightIcon />}
              onClick={handleRotate}
              disabled={processing}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                borderColor: alpha(theme.palette.divider, 0.4),
                color: 'text.primary',
              }}
            >
              Rotate 90°
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={handleModalClose}
          color="inherit"
          disabled={processing}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={processing}
          startIcon={
            processing ? <CircularProgress size={16} color="inherit" /> : null
          }
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            px: 2.5,
            fontWeight: 600,
          }}
        >
          {processing ? 'Processing...' : 'Apply & Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
