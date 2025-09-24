import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Layout from './components/layout/Layout';
import UsersDashboard from './pages/UsersDashboard';
import './index.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<UsersDashboard />} />
          </Routes>
        </Layout>
      </Router>
    </UserProvider>
  );
}

export default App;
