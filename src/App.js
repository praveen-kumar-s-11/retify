// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FirebaseAppProvider } from 'reactfire';
import { auth, firebaseConfig } from './firebase';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import PostProperty from './components/PostProperties';
import SellerPage from './components/Seller';
import PrivateRoute from './components/PrivateRoute';
import useAuthToken from './components/useAuthToken';

const App = () => {
  const [user, loading, error] = useAuthState(auth);
  useAuthToken(); // Handle token expiry

  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <Router>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" /> : <Login />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/home" />} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/SellerPage" element={<PrivateRoute><SellerPage /></PrivateRoute>} />
          <Route path="/PostProperty" element={<PrivateRoute><PostProperty /></PrivateRoute>} />
        </Routes>
      </Router>
    </FirebaseAppProvider>
  );
};

export default App;
