import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Quiz from "./Components/Quiz";
import Dashboard from "./Components/Dashboard";
import Detector from "./Components/Detector";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
// In App.jsx
import ExtensionSetup from './Components/ExtensionSetup';
import PrivacyPolicy from './Components/PrivacyPolicy';
import SecurityPractices from './Components/SecurityPractices';

// Add to your routes

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz/:role" element={<Quiz />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/detector" element={<Detector />} />
        <Route path="/extension" element={<ExtensionSetup />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/security" element={<SecurityPractices />} />

        
      </Routes>
      <Footer/>
    </BrowserRouter>
    
  );
}

export default App;