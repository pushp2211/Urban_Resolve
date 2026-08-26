import React, { useCallback, useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import ComplaintCard from './ComplaintCard';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../api/axios';
import ComplaintDetailedDialog from './ComplaintDetailedDialog';
import FilterBar from './FilterBar';
import { Container } from '@mui/material';
import { useLoading } from '../hooks/useLoading';
import { SNACK_SEVERITY } from '../../enum/snackSeverity';
import Snack from './Snack';

function ComplaintList({ filter = {} }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const observerRef = useRef(null);


  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [openDetailedDialogue, setOpenDetailedDialogue] = useState(false);

  const { showLoading, hideLoading } = useLoading();

  const [snackMessage, setSnackMessage] = useState('');
  const [showSnack, setShowSnack] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState(SNACK_SEVERITY.INFO);

  const page = parseInt(searchParams.get('page')) || 1;
  const serializedFilter = JSON.stringify(filter || {});

  useEffect(() => {
    const query = new URLSearchParams(searchParams);
    query.set('page', String(page));

    if (filter && typeof filter === 'object') {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query.set(key, String(value));
        }
      });
    }



    if (page === 1) {
      showLoading();
    } else {
      setLoading(true);
    }
    setError('');

    const fetchComplaints = async () => {
      try {
        const response = await apiClient.get(`/service?${query.toString()}`);


        const newComplaints = response.data?.data?.complaints || [];
        const currentPage = Number(response.data?.data?.currentPage || page);
        const totalPages = Number(response.data?.data?.totalPages || 1);

        if (page > 1) {
          setComplaints((prev) => {
            const existingIds = new Set(prev.map((c) => c._id));
            const freshItems = newComplaints.filter((c) => !existingIds.has(c._id));
            return [...prev, ...freshItems];
          });
        } else {
          setComplaints(newComplaints);
        }

        setHasNextPage(currentPage < totalPages);
      } catch (err) {

        console.error('Complaint fetch error:', err);
        setError('Error while fetching complaints, Try again later');
        setSnackMessage('Error while fetching complaints, Try again later');
        setShowSnack(true);
        setSnackSeverity(SNACK_SEVERITY.ERROR);
      } finally {
        hideLoading();
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [searchParams.toString(), serializedFilter, page]);

  const lastComplaintElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !loading) {
            setSearchParams((prevParams) => {
              const params = new URLSearchParams(prevParams);
              const currentPage = parseInt(params.get('page')) || 1;
              params.set('page', String(currentPage + 1));
              return params;
            });
          }
        },
        { threshold: 0.5 }
      );

      if (node) observerRef.current.observe(node);
    },
    [loading, hasNextPage, setSearchParams]
  );

  const handleOnClick = (complaint) => {
    setSelectedComplaint(complaint);
    setOpenDetailedDialogue(true);
  };

  const onAssign = (updatedComplaint) => {
    setComplaints((prevComplaints) =>
      prevComplaints.map((complaint) =>
        complaint?._id === updatedComplaint?._id ? updatedComplaint : complaint
      )
    );
  };

  return (
    <>
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Container
          sx={{
            paddingX: {
              xs: 4,
              md: 3,
            },
          }}
        >
          <FilterBar />
        </Container>

        {complaints.length === 0 && !loading && (
          <Box sx={{ my: 4, color: 'text.secondary', textAlign: 'center' }}>
            No complaints found.
          </Box>
        )}

        <Grid
          container
          spacing={3}
          columns={4}
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {complaints.map((complaint, index) => {
            const isLast = complaints.length === index + 1;
            return (
              <Grid
                key={complaint._id}
                ref={isLast ? lastComplaintElementRef : undefined}
                onClick={() => handleOnClick(complaint)}
              >
                <ComplaintCard complaint={complaint} />
              </Grid>
            );
          })}
        </Grid>

        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              my: 4,
              alignItems: 'center',
            }}
          >
            <CircularProgress size={36} />
          </Box>
        )}

        {!loading && !hasNextPage && complaints.length > 0 && (
          <Typography sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
            You've reached the end of the list.
          </Typography>
        )}

        {error && (
          <Typography color="error" sx={{ textAlign: 'center', my: 4 }}>
            {error}
          </Typography>
        )}
      </Box>

      <ComplaintDetailedDialog
        complaint={selectedComplaint}
        open={openDetailedDialogue}
        onClose={() => setOpenDetailedDialogue(false)}
        onAssign={onAssign}
      />
      <Snack
        message={snackMessage}
        openStatus={showSnack}
        severity={snackSeverity}
        setOpenStatus={setShowSnack}
      />
    </>
  );
}

export default ComplaintList;
