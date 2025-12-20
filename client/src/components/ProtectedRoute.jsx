import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

function ProtectedRoute() {
    const {user, loading} = useAuth();
    
    // Wait for auth check to complete before rendering
    if (loading) {
        return null; // or a loading spinner
    }
    
    if(!user){
        return(
            <Navigate to="/urban-resolve" replace/>
        )
    }
  return <Outlet/>
}

export default ProtectedRoute