import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterSociety from './pages/RegisterSociety';
// Import more as needed

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register-society" element={<RegisterSociety />} />
        {/* Add more routes */}
      </Routes>
    </Router>
  );
}

export default App;
