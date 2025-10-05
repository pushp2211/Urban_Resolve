import React from 'react';
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
import Home from './pages/Home';
import { Navigate } from 'react-router-dom';

function App() {
// pinCode, locality, city, dateRange, status
  return (
    <BrowserRouter>
    <FilterProvider>
      <Routes>
        {/* All routes inside here are now protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} /> {/*directly route to  dashboard*/}
            <Route path='dashboard' element={<Dashboard/>}>
              <Route index element={<Home/>}/>
            </Route>
            <Route path="highlights" element={<Highlights />} />
            <Route path="my-complaints" element={<MyComplaints />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        
      </Routes>
      </FilterProvider>
    </BrowserRouter>
  )
}

export default App
