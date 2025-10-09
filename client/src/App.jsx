import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Button from '@mui/material/Button'
import ProtectedRoute from './components/ProtectedRoute';
import { FilterProvider } from './context/FilterContext';
import Layout from './pages/Layout';
import './App.css'
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Highlights from './pages/Highlights';
import MyComplaints from './pages/MyComplaints';
import Profile from './pages/Profile';
import Management from './pages/Management';
import Home from './pages/Home';
import { Navigate } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import MyAssignedComplaints from './pages/MyAssignedComplaints';
import { ROLES } from '../enum/roles';
import { useAuth } from './context/AuthContext';
function App() {
  const {user} = useAuth();
// pinCode, locality, city, dateRange, status
const [curTheme, setTheme] = useState("light");
  return (
    <BrowserRouter>
    <ThemeProvider theme={theme} >
    <FilterProvider>
      <Routes>
        {/* All routes inside here are now protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} /> {/*directly route to  dashboard*/}
            <Route path='dashboard' element={<Dashboard/>}>
              <Route index element={<Home/>}/>
            </Route>
            <Route path="my-complaints" element={<MyComplaints />} />
            <Route path="profile" element={<Profile />} />
            {user?.role === ROLES.STAFF && <Route path="assigned-complaints" element={<MyAssignedComplaints />} />}
            {user?.role ===ROLES.ADMIN && <Route path='management' element={<Management/>}/>}
          </Route>
          
        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        
      </Routes>
      </FilterProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
