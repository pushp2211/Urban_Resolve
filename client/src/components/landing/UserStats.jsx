import { Box } from '@mui/material'
import React from 'react'
import HorizontalChart from './HorizontalChart';
import { useState } from 'react';
import apiClient from '../../api/axios';
import { useEffect } from 'react';
import { useLoading } from '../../context/LoadingContext';
function UserStats() {

    const [usersData, setUsersData] = useState(null);
    const {showLoading, hideLoading } = useLoading();
    const [error, setError] = useState("");
    const [userDataArr, setUserDataArr] = useState([]);
    const map = {
        users: "Active Users",
        staffs: "Staff",
        admins: "Admins"
    }
    // const userData = Array.of(usersData);
    useEffect(()=>{
        const fetchStats = async()=>{
            setError("");
            showLoading();
            try {
                const resp = await apiClient.get('/landing/user-stats');
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
        if(!usersData){
            return;
        }
        const arr = Object.keys(map).map(key=>({
                role: map[key],
                count:usersData[key]
            }))
        setUserDataArr(arr);
        // console.log(userDataArr);
    }, [usersData]);

  return (
    <Box
        sx={{
            display:"flex",
            gap:2,
            flexDirection:{
                xs:"column",
                sm:"column",
                md:"row"
            },
            justifyContent:"center",
            alignItems:"center",
            // flexGrow:1,
        }}
    >
        <Box
            sx={{
                width:{
                    xs:"100%",
                    md:"50%",
                },
                justifySelf:"center",
                justifyItems:"center"
            }}
        >
            <HorizontalChart data={userDataArr}/>
        </Box>
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
    </Box>
  )
}

export default UserStats