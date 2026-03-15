import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicPortal from './pages/PublicPortal';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PublicDashboard from './pages/PublicDashboard';
import RaiseComplaint from './pages/RaiseComplaint';
import TrackStatus from './pages/TrackStatus';
import ComplaintDetails from './pages/ComplaintDetails';
import TalukDashboard from './pages/TalukDashboard';
import DistrictDashboard from './pages/DistrictDashboard';
import CommissionerDashboard from './pages/CommissionerDashboard';
import AgencyDashboard from './pages/AgencyDashboard';
import OfficialLoginPage from './pages/OfficialLoginPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Routes>
          <Route path="/" element={<PublicPortal />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/official/login" element={<OfficialLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard/public" element={<PublicDashboard />} />
          <Route path="/dashboard/taluk" element={<TalukDashboard />} />
          <Route path="/dashboard/district" element={<DistrictDashboard />} />
          <Route path="/dashboard/commissioner" element={<CommissionerDashboard />} />
          <Route path="/dashboard/agency" element={<AgencyDashboard />} />
          <Route path="/raise-complaint" element={<RaiseComplaint />} />
          <Route path="/track-status" element={<TrackStatus />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
