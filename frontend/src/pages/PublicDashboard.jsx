import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import {
    Plus,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    FileText,
    TrendingUp,
    LayoutDashboard,
    Bell
} from 'lucide-react';

export default function PublicDashboard() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const auth = {
        organization_name: localStorage.getItem('organization_name'),
        agency_type: localStorage.getItem('agency_type'),
        username: localStorage.getItem('username')
    };

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/complaints/items/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setComplaints(response.data);
            } catch (err) {
                console.error('Failed to fetch complaints', err);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, []);

    const stats = {
        total: complaints.length,
        resolved: complaints.filter(c => ['RESOLVED', 'CLOSED'].includes(c.status)).length,
        pending: complaints.filter(c => !['RESOLVED', 'CLOSED', 'REJECTED'].includes(c.status)).length
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'RESOLVED':
            case 'CLOSED':
            case 'APPROVED':
                return {
                    bg: 'bg-emerald-500/10',
                    text: 'text-emerald-600',
                    border: 'border-emerald-500/20',
                    icon: <CheckCircle className="w-4 h-4" />
                };
            case 'REJECTED':
                return {
                    bg: 'bg-rose-500/10',
                    text: 'text-rose-600',
                    border: 'border-rose-500/20',
                    icon: <AlertCircle className="w-4 h-4" />
                };
            case 'SUBMITTED':
                return {
                    bg: 'bg-sky-500/10',
                    text: 'text-sky-600',
                    border: 'border-sky-500/20',
                    icon: <Clock className="w-4 h-4" />
                };
            default:
                return {
                    bg: 'bg-amber-500/10',
                    text: 'text-amber-600',
                    border: 'border-amber-500/20',
                    icon: <TrendingUp className="w-4 h-4" />
                };
        }
    };

    return (
        <div className="flex-grow flex flex-col min-h-screen bg-[#FDFEFE]">
            <Navbar />

            {/* Hero Branding Section */}
            <div className="bg-kerala-green relative overflow-hidden pt-12 pb-24 h-64">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                </div>
                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                    {auth.agency_type} PORTAL
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{auth.organization_name}</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">
                                Welcome, <span className="text-kerala-gold">{auth.username}</span>
                            </h1>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/raise-complaint')}
                            className="flex items-center justify-center gap-3 px-10 py-5 bg-white text-kerala-green font-black rounded-2xl shadow-2xl hover:bg-gray-50 transition-all text-sm uppercase tracking-wider"
                        >
                            <Plus className="w-5 h-5" />
                            Raise New SOS
                        </motion.button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl w-full mx-auto px-6 lg:px-8 -mt-20">
                {/* Stats Summary Panel */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard
                        label="Total SOS"
                        value={stats.total}
                        icon={<LayoutDashboard className="w-6 h-6" />}
                        color="bg-white"
                        textColor="text-gray-900"
                    />
                    <StatCard
                        label="Active SOS"
                        value={stats.pending}
                        icon={<TrendingUp className="w-6 h-6 text-amber-500" />}
                        color="bg-white"
                        textColor="text-amber-600"
                    />
                    <StatCard
                        label="Resolved SOS"
                        value={stats.resolved}
                        icon={<CheckCircle className="w-6 h-6 text-emerald-500" />}
                        color="bg-white"
                        textColor="text-emerald-600"
                    />
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-gray-900">My SOS Reports</h2>
                            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">{complaints.length}</span>
                        </div>
                        <Bell className="w-5 h-5 text-gray-300 cursor-pointer hover:text-kerala-green transition-colors" />
                    </div>

                    <div className="p-4 md:p-8">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 gap-4">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-kerala-green"></div>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Records...</p>
                            </div>
                        ) : complaints.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <MessageSquare className="w-10 h-10 text-gray-200" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">No SOS Raised</h3>
                                <p className="text-gray-400 max-w-sm mb-8">You have no active SOS reports. If you face an LPG issue, we're here to help 24/7.</p>
                                <button
                                    onClick={() => navigate('/raise-complaint')}
                                    className="px-8 py-4 bg-kerala-light text-kerala-green font-bold rounded-2xl hover:bg-green-100 transition-all border border-kerala-green/20"
                                >
                                    Raise Your First SOS
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                <AnimatePresence>
                                    {complaints.map((complaint, index) => {
                                        const status = getStatusStyles(complaint.status);
                                        return (
                                            <motion.div
                                                key={complaint.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => navigate(`/complaints/${complaint.id}`)}
                                                className="group relative bg-white p-6 rounded-3xl border border-gray-100 hover:border-kerala-green/20 hover:shadow-xl hover:shadow-kerala-green/5 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                                            >
                                                <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-kerala-green rounded-r-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>

                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${status.bg} ${status.text} ${status.border}`}>
                                                            {status.icon}
                                                            {complaint.status.replace(/_/g, ' ')}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-300 tracking-widest">#{complaint.id}</span>
                                                    </div>

                                                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-kerala-green transition-colors leading-snug">
                                                        {complaint.description.substring(0, 120)}{complaint.description.length > 120 ? '...' : ''}
                                                    </h3>

                                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                                        <span className="flex items-center gap-2">
                                                            <div className="w-5 h-5 bg-gray-50 rounded-md flex items-center justify-center">
                                                                <Clock className="w-3 h-3" />
                                                            </div>
                                                            {new Date(complaint.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                        <span className="flex items-center gap-2">
                                                            <div className="w-5 h-5 bg-gray-50 rounded-md flex items-center justify-center">
                                                                <FileText className="w-3 h-3" />
                                                            </div>
                                                            {complaint.taluk_name || 'Location Pending'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                                                    <div className="text-left md:text-right">
                                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Last Update</p>
                                                        <p className="text-[11px] font-bold text-gray-900">{new Date(complaint.updated_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="p-4 bg-gray-50 rounded-2xl text-gray-300 group-hover:text-kerala-green group-hover:bg-green-50 transition-all">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="mt-20 py-12 text-center border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.3em]">Official Kerala LPG Grievance Cell</p>
            </footer>
        </div>
    );
}

function StatCard({ label, value, icon, color, textColor }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`${color} p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6`}
        >
            <div className="w-16 h-16 bg-gray-50 rounded-[1.5rem] flex items-center justify-center shadow-inner">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
                <p className={`text-4xl font-black ${textColor}`}>{value}</p>
            </div>
        </motion.div>
    );
}
