import React, { useState } from 'react';
import {
  Box,
  ImageList,
  ImageListItem,
  Dialog,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

function ReviewPhotoGallery({ photos = [] }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleImageClick = (photo, index) => {
    setSelectedImage(photo);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : photos.length - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(photos[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedImage(photos[newIndex]);
  };

  if (!photos || photos.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No photos available
      </Typography>
    );
  }

  return (
    <>
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Resolution Photos ({photos.length})
        </Typography>
        <ImageList cols={photos.length >= 3 ? 3 : photos.length} gap={8}>
          {photos.map((photo, index) => (
            <ImageListItem
              key={index}
              onClick={() => handleImageClick(photo, index)}
              sx={{
                cursor: 'pointer',
                borderRadius: 1,
                overflow: 'hidden',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              <img
                src={photo}
                alt={`Resolution ${index + 1}`}
                loading="lazy"
                style={{
                  height: 120,
                  objectFit: 'cover',
                  width: '100%',
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      {/* Full Screen Image Viewer */}
      <Dialog
        open={!!selectedImage}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
            },
          },
        }}
      >
        <Box sx={{ position: 'relative', padding: 2 }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'white',
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>

          {photos.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <NavigateNextIcon />
              </IconButton>
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={selectedImage}
              alt="Full size"
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: 'white',
              textAlign: 'center',
              display: 'block',
              marginTop: 1,
            }}
          >
            {currentIndex + 1} / {photos.length}
          </Typography>
        </Box>
      </Dialog>
    </>
  );
}

export default ReviewPhotoGallery;
