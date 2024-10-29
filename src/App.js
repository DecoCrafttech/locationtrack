// src/App.js
import React from 'react';
import LiveLocation from './LiveLocation';
import TrackLocation from './TrackLocation';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div>
        <h1>Live Location Sharing App</h1>
        <Routes >
          <Route path="/track/:userId" element={<TrackLocation userId="user1" />} />
          <Route path="/" element={<LiveLocation userId="user1" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
