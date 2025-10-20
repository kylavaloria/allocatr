import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
//import ResourceManagement from './pages/ResourceManagement';
import TestAPI from './pages/TestAPI';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
         
          <Route path="/test-api" element={<TestAPI />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
