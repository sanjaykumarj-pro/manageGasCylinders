import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';

import { logout, getAuthData } from '../api/auth';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { token, role } = getAuthData();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Kerala Govt Logo" className="h-14 w-auto drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-kerala-green leading-tight">LPG Dashboard</h1>
              <p className="text-xs text-gray-500 font-medium">Government of Kerala</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-kerala-green font-medium transition-colors">Home</Link>

            {token ? (
              <>
                <Link to={
                  role === 'PUBLIC' ? "/dashboard/public" :
                    role === 'TALUK_OFFICER' ? "/dashboard/taluk" :
                      role === 'DISTRICT_OFFICER' ? "/dashboard/district" :
                        role === 'COMMISSIONER' ? "/dashboard/commissioner" :
                          role?.startsWith('AGENCY_') ? "/dashboard/agency" : "/"
                } className="text-gray-600 hover:text-kerala-green font-medium transition-colors">Dashboard</Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/raise-complaint" className="text-gray-600 hover:text-kerala-green font-medium transition-colors">Citizen SOS</Link>
                <Link to="/official/login" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 uppercase text-[10px] tracking-widest">Official Portal</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
