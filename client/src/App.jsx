import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Button from '@mui/material/Button'
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './pages/Layout';
import './App.css'
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Highlights from './pages/Highlights';
import MyComplaints from './pages/MyComplaints';
import Profile from './pages/Profile';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* All routes inside here are now protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="highlights" element={<Highlights />} />
            <Route path="my-complaints" element={<MyComplaints />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
