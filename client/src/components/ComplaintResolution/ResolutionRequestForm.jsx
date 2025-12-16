import { useState } from 'react';
import { Button, TextField, Box, Typography, IconButton } from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';
import apiClient from '../../api/axios';

function ResolutionRequestForm({ complaintId, onSuccess }) {
  const [photos, setPhotos] = useState([]);
    const [notes, setNotes] = useState('');
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (photos.length + files.length > 5) {
            alert('Maximum 5 photos allowed');
            return;
        }
        
        setPhotos([...photos, ...files]);
        
        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (index) => {
        setPhotos(photos.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (photos.length < 2) {
            alert('At least 2 photos are required');
            return;
        }
        
        setLoading(true);
        
        const formData = new FormData();
        photos.forEach(photo => {
            formData.append('photos', photo);
        });
        formData.append('notes', notes);
        
        try {
            const response = await apiClient.post(
                `/staff/complaints/${complaintId}/submit-resolution`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            alert('Resolution request submitted successfully!');
            onSuccess();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Failed to submit resolution request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Submit Resolution Request
            </Typography>
            
            <Typography color="text.secondary" sx={{ mb: 2 }}>
                Upload at least 2 photos showing the resolved complaint
            </Typography>
            
            {/* Photo upload */}
            <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCamera />}
                sx={{ mb: 2 }}
            >
                Add Photos ({photos.length}/5)
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handlePhotoChange}
                />
            </Button>
            
            {/* Photo previews */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                {previews.map((preview, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                        <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            style={{ width: 100, height: 100, objectFit: 'cover' }}
                        />
                        <IconButton
                            size="small"
                            onClick={() => removePhoto(index)}
                            sx={{
                                position: 'absolute',
                                top: -10,
                                right: -10,
                                bgcolor: 'background.paper'
                            }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Box>
                ))}
            </Box>
            
            {/* Notes */}
            <TextField
                fullWidth
                multiline
                rows={4}
                label="Resolution Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe what was done to resolve the complaint..."
                sx={{ mb: 2 }}
            />
            
            <Button
                type="submit"
                variant="contained"
                disabled={photos.length < 2 || loading}
                fullWidth
            >
                {loading ? 'Submitting...' : 'Submit Resolution Request'}
            </Button>
        </Box>
    );
}

export default ResolutionRequestForm