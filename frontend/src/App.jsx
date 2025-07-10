// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import Sign from './pages/Sign';
import Share from './pages/Share';
import Download from './pages/Download';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import {Toaster} from "sonner"; 

const App = () => {
  return (
    <>
      <Toaster position='top-right' richColors/>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sign/:id"
          element={
            <ProtectedRoute>
              <Sign />
            </ProtectedRoute>
          }
        />
        <Route
          path="/share"
          element={
            <ProtectedRoute>
              <Share />
            </ProtectedRoute>
          }
        />
        <Route
          path="/download/:id"
          element={
            <ProtectedRoute>
              <Download />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
