// src/App.js
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

function App() {
  return (
    <Box display="flex" flexDirection="column" minH="100vh">
      <Header />
      <Box flex="1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/terms" element={<div>Terms Page</div>} />
          <Route path="/privacy" element={<div>Privacy Page</div>} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  );
}

export default App;