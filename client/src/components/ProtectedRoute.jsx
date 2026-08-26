import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate, Outlet } from 'react-router-dom'
import WelcomeLoader from './WelcomeLoader';
function ProtectedRoute() {
    const {user, loading} = useAuth();
    
    // Wait for auth check to complete before rendering
    if (loading) {
        return <WelcomeLoader/>; // or a loading spinner
    }
    
    if(!user){
        return(
            <Navigate to="/urban-resolve" replace/>
        )
    }
  return <Outlet/>
}

export default ProtectedRoute