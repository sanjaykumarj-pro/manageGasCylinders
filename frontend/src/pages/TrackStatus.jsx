import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Search, 
    ArrowLeft, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Smartphone, 
    Hash,
    MapPin,
    Calendar,
    ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function TrackStatus() {
    const [token, setToken] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [complaint, setComplaint] = useState(null);
    const navigate = useNavigate();

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setComplaint(null);

        try {
            const params = {};
            if (token) params.token = token;
            if (phone) params.phone = phone;

            const response = await axios.get('/api/complaints/items/track/', { params });
            setComplaint(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'No SOS report found with these details.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'RESOLVED': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
            case 'REJECTED': return 'text-rose-500 bg-rose-50 border-rose-100';
            default: return 'text-amber-500 bg-amber-50 border-amber-100';
        }
    };

    return (
        <div className="flex-grow flex flex-col min-h-screen bg-[#F8FAFC]">
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-6 py-12 w-full">
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-kerala-green mb-10 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Portal
                </motion.button>

                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Search Form */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Track <span className="text-kerala-green">SOS</span></h1>
                            <p className="text-gray-500 text-sm font-medium">Verify the resolution status of your emergency report.</p>
                        </div>

                        <form onSubmit={handleTrack} className="space-y-6">
                            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Token ID</label>
                                    <div className="relative">
                                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                        <input
                                            type="text"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-kerala-green outline-none transition-all font-bold text-gray-900 text-sm"
                                            placeholder="e.g. 1042"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="relative py-2 flex items-center justify-center">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                                    <span className="relative px-4 bg-white text-[10px] font-black text-gray-300 uppercase tracking-widest">OR</span>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Phone Number</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                        <input
                                            type="tel"
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-kerala-green outline-none transition-all font-bold text-gray-900 text-sm"
                                            placeholder="Your registered phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    disabled={loading || (!token && !phone)}
                                    className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 uppercase text-xs tracking-widest shadow-xl shadow-gray-200"
                                >
                                    <Search className="w-4 h-4" />
                                    {loading ? 'Searching...' : 'Search Status'}
                                </button>
                            </div>
                        </form>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4"
                            >
                                <AlertCircle className="w-6 h-6 text-rose-500" />
                                <p className="text-xs font-bold text-rose-600 uppercase tracking-wider leading-relaxed">{error}</p>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Result Content */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {complaint ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Status Card */}
                                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-10">
                                        <div className="flex justify-between items-start mb-10">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">Current Status</p>
                                                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border text-xs font-black uppercase tracking-widest shadow-sm ${getStatusColor(complaint.status)}`}>
                                                    <Clock className="w-4 h-4" />
                                                    {complaint.status_display}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-2">Token ID</p>
                                                <p className="text-3xl font-black text-gray-900 tracking-tighter">#{complaint.id}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-50">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Complainant</p>
                                                <p className="font-bold text-gray-900">{complaint.consumer_name || complaint.user_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Submitted On</p>
                                                <div className="flex items-center gap-2 text-gray-900 font-bold">
                                                    <Calendar className="w-4 h-4 text-kerala-green" />
                                                    {new Date(complaint.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Location</p>
                                                <div className="flex items-start gap-2 text-gray-900 font-bold">
                                                    <MapPin className="w-4 h-4 text-kerala-green mt-1 shrink-0" />
                                                    {complaint.location_details}, {complaint.taluk_name}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status History */}
                                        <div className="mt-10">
                                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-6">Processing Timeline</p>
                                            <div className="space-y-6">
                                                {complaint.history?.map((h, i) => (
                                                    <div key={i} className="flex gap-6 items-start group">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className="w-4 h-4 rounded-full border-2 border-kerala-green bg-white shrink-0"></div>
                                                            {i !== complaint.history.length - 1 && <div className="w-0.5 h-12 bg-gray-100"></div>}
                                                        </div>
                                                        <div className="pt-0.5">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{h.status_display}</p>
                                                            <p className="text-sm font-bold text-gray-900 mb-1">{h.comments}</p>
                                                            <p className="text-[10px] text-gray-400">{new Date(h.changed_at).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center p-12 text-center bg-white rounded-[2.5rem] border border-gray-100 shadow-inner"
                                >
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                                        <Search className="w-10 h-10 text-gray-200" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Status Insight</h3>
                                    <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
                                        Enter your Token ID or Phone Number to view real-time resolution updates.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
