import React from 'react'
import { useTheme, Box, Typography } from '@mui/material'
import Search from '../Search';
function UserProfileSearch({searchResult, searchValue, setSearchValue, loading, error, handleOnUserClick}) {
    const theme = useTheme();
    return (
    <Box
        sx={{
          flexGrow: 1,
          borderRadius: '2rem',
          backgroundColor:
            theme.palette.mode === 'dark' ? '#3c4042' : '#f1f0fa',
          paddingY: 2,
          paddingX: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          minHeight: {
            lg: '25rem',
            xs: '20rem',
          },
          // width:"100%"
        }}
      >
        <Typography
          sx={{
            width: '100%',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
          // variant='h7'
        >
          SEARCH TO GET USER PROFILE AND <br /> MANAGE THEIR ROLE
        </Typography>

        <Search
          searchResult={searchResult}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={loading}
          error={error}
          handleOnClick={handleOnUserClick}
        />
      </Box>
  )
}

export default UserProfileSearch