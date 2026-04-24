import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import RolebasedTrainings from "./Components/RolebasedTrainings";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
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
        <Route path="/rolebased-trainings/:role" element={<RolebasedTrainings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/extension" element={<ExtensionSetup />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/security" element={<SecurityPractices />} />

        
      </Routes>
      <Footer/>
    </BrowserRouter>
    
  );
}

export default App;