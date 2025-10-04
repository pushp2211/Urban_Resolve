import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Button from '@mui/material/Button'
import ProtectedRoute from './components/ProtectedRoute';

import './App.css'
import SignIn from './pages/SignIn';
import Register from './pages/Register';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* All routes inside here are now protected */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="my-complaints" element={<MyComplaints />} />
          </Route>
        </Route> */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
