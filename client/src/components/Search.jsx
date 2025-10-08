import React, { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import apiClient from '../api/axios';

function Search({setSearchValue, searchResult, loading, error, handleSearch, searchValue, handleOnClick}) {
//   const [email, setEmail] = useState('');
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleSearch = async () => {
//     if (!email.trim()) return;
//     setLoading(true);
//     setError('');
//     setResults([]);

//     try {
//       const { data } = await apiClient.get(`/admin/searchUser?email=${email}`);
//       // expecting an array of user objects in data.data
//       if (!data?.data?.length) {
//         setError('No users found.');
//       } else {
//         setResults(data.data);
//       }
//     } catch (err) {
//       console.error('Error searching user:', err);
//       setError('Something went wrong.');
//     } finally {
//       setLoading(false);
//     }
//   };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width:"100%",
      }}
    >
      {/* --- Search Field with Button --- */}
      <Paper
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: '2px 8px',
          backdropFilter:"initial",
          background:"backdrop(3px)",
          backgroundColor:"transparent"
        }}
      >
        <TextField
          variant="standard"
          placeholder="Enter user email"
          fullWidth
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{
            borderRadius:10,
          }}
        //   InputProps={{ disableUnderline: true }}
        />
        <IconButton onClick={handleSearch} color="" size="large">
          <SearchIcon />
        </IconButton>
      </Paper>

      {/* --- Loading / Error / Result List --- */}
      {loading && <CircularProgress size={32} sx={{ alignSelf: 'center' }} />}

      {error && (
        <Typography color="secondary" textAlign="center">
          {error}
        </Typography>
      )}

      {!loading && searchResult.length > 0 && (
        <Paper elevation={3}>
          <List dense>
            {searchResult.map((user) => (
              <ListItem key={user?._id} divider
                onClick={handleOnClick}
              >

                
                <ListItemText sx={{
                  display:"flex",
                  gap:2
                }}
                  primary={user?.fullName}
                  secondary={user?.email}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}

export default Search;