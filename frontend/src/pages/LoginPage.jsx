import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import Navbar from '../components/Navbar';
import { Lock, User, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(username, password);
      if (data.role === 'PUBLIC') {
        navigate('/dashboard/public');
      } else {
        setError('Officer accounts must use the official portal.');
        localStorage.clear();
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Citizen Login</h2>
            <p className="text-gray-500">Sign in to track your reported LPG issues</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-kerala-green focus:border-transparent outline-none transition-all"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-kerala-green focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-kerala-red p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full py-4 bg-kerala-green text-white font-black rounded-2xl shadow-lg hover:bg-kerala-dark transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Sign In Now'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500">
            Are you a citizen? <button onClick={() => navigate('/register')} className="text-kerala-green font-bold hover:underline">Register Complaint</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
