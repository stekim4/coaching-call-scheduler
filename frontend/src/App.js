import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CoachDashboard from './pages/CoachDashboard';
import StudentDashboard from './pages/StudentDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/coach-dashboard' element={<CoachDashboard />} />
        <Route path='/student-dashboard' element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;