import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './pages/Layout';
import './App.css';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyComplaints from './pages/MyComplaints';
import Profile from './pages/Profile';
import Management from './pages/Management';
import ReviewRequests from './pages/ReviewRequests.jsx';
import Home from './pages/Home';
import MyAssignedComplaints from './pages/MyAssignedComplaints';
import Notifications from './pages/Notifications';
import { ROLES } from '../enum/roles';
import { useAuth } from './hooks/useAuth';
import GlobalLoading from './components/GlobalLoading.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResolutionRequest from './pages/ResolutionRequest.jsx';
import ManageUsers from './pages/ManageUsers.jsx';
import AssignComplaint from './pages/AssignComplaint.jsx';
import { checkAuth } from './redux/slices/authSlice';

function App() {
  const dispatch = useDispatch();
  const { user, authChecked } = useAuth();

  useEffect(() => {
    if (!authChecked) {
      dispatch(checkAuth());
    }
  }, [authChecked, dispatch]);

  return (
    <BrowserRouter>
      <GlobalLoading />

      <Routes>
        {/* All routes inside here are protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />}>
              <Route index element={<Home />} />
            </Route>
            <Route path="my-complaints" element={<MyComplaints />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            {user?.role === ROLES.STAFF && (
              <Route path="assigned-complaints" element={<MyAssignedComplaints />} />
            )}
            {user?.role === ROLES.STAFF && (
              <Route path="complaint/resolution-request/:id" element={<ResolutionRequest />} />
            )}
            {user?.role === ROLES.ADMIN && <Route path="management" element={<Management />} />}
            {user?.role === ROLES.ADMIN && (
              <Route path="management/resolutions" element={<ReviewRequests />} />
            )}
            {user?.role === ROLES.ADMIN && (
              <Route path="management/users" element={<ManageUsers />} />
            )}
            {user?.role === ROLES.ADMIN && (
              <Route path="admin/assign-complaint/:id" element={<AssignComplaint />} />
            )}
          </Route>
        </Route>

        <Route path="/urban-resolve" element={<LandingPage />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
