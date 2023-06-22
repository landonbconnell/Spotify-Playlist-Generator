import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LogInPage from './pages/LogInPage';
import HomePage from './pages/HomePage';
import OrganizeLikedSongs from './features/OrganizeLikedSongs';
import { CssBaseline } from '@mui/material';

const App = () => (
  <>
    <CssBaseline />
    <Routes>
      <Route path="/" element={<LogInPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route
        path="/home/organize_liked_songs"
        element={<OrganizeLikedSongs />}
      />
    </Routes>
  </>
);

export default App;
