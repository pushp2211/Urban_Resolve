import React from 'react'
import { Box } from '@mui/material'
import HorizontalChart from './HorizontalChart';
import { useState, useEffect } from 'react';
import { useLoading } from '../../context/LoadingContext';
import apiClient from '../../api/axios';
function ComplaintStats() {
    const [complaintData, setUsersData] = useState(null);
    const {showLoading, hideLoading } = useLoading();
    const [error, setError] = useState("");
    const [complaintDataArr, setComplaintDataArr] = useState([]);
    const map = {
        pending: "Pending",
        inProgress: "In Progress",
        resolved: "Resolved",
        total: "Registered"
    }
    useEffect(()=>{
        const fetchStats = async()=>{
            setError("");
            showLoading();
            try {
                const resp = await apiClient.get('/landing/complaint-stats');
                // console.log(resp.data.data);
                setUsersData(resp.data.data);
            } catch (error) {
                console.log(error.message);
            }
            finally{
                hideLoading();
            }
        }
        fetchStats();
    }, [])

    useEffect(()=>{
        if(!complaintData){
            return;
        }
        const arr = Object.keys(map).map(key=>({
                role: map[key],
                count:complaintData[key]
            }))
        setComplaintDataArr(arr);
        console.log(complaintDataArr);
    }, [complaintData]);
  return (
    <Box
            sx={{
                display:"flex",
                gap:2,
                flexDirection:{
                    xs:"column-reverse",
                    sm:"row",
                    lg:"row"
                },
                justifyContent:"center",
                alignItems:"center",
                // flexGrow:1,
            }}
        >
            <Box 
                sx={{
                    textAlign:"center",
                    paddingX:{
                        lg:"5rem",
                        md:"3rem",
                        sm:"1rem",
                        xs:"0.3rem"
                    },
                    fontSize:"1.2rem"
                }}
            >
                Many of our citizens are helping to create a cleaner, safer, and smarter city. Register today to report problems,
                track solutions, and contribute directly to meaningful urban change.
            </Box>
            <Box
                sx={{
                    width:{
                        xs:"100%",
                        md:"50%",
                    },
                    justifySelf:"center"
                }}
            >
                <HorizontalChart data={complaintDataArr}/>
            </Box>
            
        </Box>
  )
}

export default ComplaintStats