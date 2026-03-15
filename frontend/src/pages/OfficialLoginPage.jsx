import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../api/auth';
import Navbar from '../components/Navbar';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';

export default function OfficialLoginPage() {
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
                setError('Public accounts cannot access the Official Portal.');
                localStorage.clear();
            } else if (data.role === 'TALUK_OFFICER') navigate('/dashboard/taluk');
            else if (data.role === 'DISTRICT_OFFICER') navigate('/dashboard/district');
            else if (data.role === 'COMMISSIONER') navigate('/dashboard/commissioner');
            else if (data.role.startsWith('AGENCY_')) navigate('/dashboard/agency');
            else navigate('/');
        } catch (err) {
            setError('Invalid official credentials. Access denied.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] shadow-2xl w-full max-w-lg"
                >
                    <div className="flex justify-center mb-8">
                        <div className="p-4 bg-kerala-gold/20 rounded-3xl border border-kerala-gold/30">
                            <ShieldCheck className="w-12 h-12 text-kerala-gold" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-white text-center mb-2">Official Portal</h1>
                    <p className="text-white/50 text-center mb-10 text-sm">Secure access for Kerala Govt Officials & Agencies</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-4">Identification ID</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="text"
                                    placeholder="Official Username"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-kerala-gold transition-all"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest pl-4">Security Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-kerala-gold transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-kerala-gold text-gray-900 font-black rounded-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? 'Authenticating...' : 'Secure Login'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-white/30 text-xs">
                        Unauthorized access to this portal is strictly prohibited and monitored.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
