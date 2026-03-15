import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
    AlertTriangle, 
    Search, 
    BarChart3, 
    ShieldAlert, 
    UserCircle2, 
    ArrowRight,
    MapPin,
    HelpCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function PublicPortal() {
    const navigate = useNavigate();

    const actions = [
        {
            title: "Report LPG SOS",
            desc: "Immediate reporting for gas leaks, supply blockages, or service issues.",
            icon: <AlertTriangle className="w-8 h-8 text-rose-500" />,
            color: "border-rose-100 bg-rose-50/30",
            path: "/raise-complaint",
            btnText: "SOS Report"
        },
        {
            title: "Track Status",
            desc: "Monitor the progress of your reported issues using your phone number.",
            icon: <Search className="w-8 h-8 text-sky-500" />,
            color: "border-sky-100 bg-sky-50/30",
            path: "/track-status",
            btnText: "Track Action"
        },
        {
            title: "Refinery Stocks",
            desc: "View live Metric Ton (MT) status across all state bottling plants.",
            icon: <BarChart3 className="w-8 h-8 text-emerald-500" />,
            color: "border-emerald-100 bg-emerald-50/30",
            path: "/#stats",
            btnText: "View Stocks"
        }
    ];

    return (
        <div className="flex-grow flex flex-col min-h-screen bg-[#FDFEFE]">
            <Navbar />

            {/* Hero Branding */}
            <section className="bg-kerala-green relative overflow-hidden py-24">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-kerala-gold rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                    >
                        <ShieldAlert className="w-4 h-4 text-kerala-gold" />
                        Official Grievance Portal
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
                    >
                        LPG Management <br />
                        <span className="text-kerala-gold">Citizen Portal</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-kerala-light/80 max-w-2xl mx-auto mb-10 font-medium"
                    >
                        Report emergencies, track service resolutions, and monitor state-wide LPG stocks directly with the Civil Supplies Department. No login required for citizens.
                    </motion.p>
                </div>
            </section>

            {/* Main Action Grid */}
            <main className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 pb-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {actions.map((action, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 + 0.3 }}
                            whileHover={{ y: -8 }}
                            className={`p-10 rounded-[2.5rem] border ${action.color} backdrop-blur-sm shadow-xl shadow-gray-200/50 flex flex-col items-center text-center bg-white`}
                        >
                            <div className="w-20 h-20 rounded-3xl bg-white shadow-inner flex items-center justify-center mb-8 border border-gray-50">
                                {action.icon}
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{action.title}</h2>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">{action.desc}</p>
                            <button
                                onClick={() => navigate(action.path)}
                                className="w-full flex items-center justify-center gap-3 py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all group tracking-widest uppercase text-xs"
                            >
                                {action.btnText}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Secondary Actions */}
                <div className="mt-12 grid md:grid-cols-2 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="p-8 rounded-[2rem] bg-kerala-light border border-kerala-green/10 flex items-center justify-between group cursor-pointer"
                        onClick={() => navigate('/official/login')}
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                <UserCircle2 className="w-7 h-7 text-kerala-green" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Official Access</h3>
                                <p className="text-xs text-kerala-green font-bold">Taluk / District / Agencies</p>
                            </div>
                        </div>
                        <ArrowRight className="w-6 h-6 text-kerala-green group-hover:translate-x-1 transition-transform" />
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 flex items-center justify-between group cursor-pointer"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                <HelpCircle className="w-7 h-7 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">Public FAQ</h3>
                                <p className="text-xs text-gray-400 font-bold">Guidelines & Safety Tips</p>
                            </div>
                        </div>
                        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                </div>
            </main>

            {/* Bottom Branding */}
            <footer className="py-20 bg-gray-50 border-t border-gray-100 mt-auto">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 mb-4">
                             <MapPin className="text-kerala-green w-5 h-5" />
                             <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Government of Kerala</span>
                        </div>
                        <p className="max-w-md text-gray-400 text-xs leading-relaxed font-medium">
                            Centralized LPG monitoring system managed by the Civil Supplies and Consumer Affairs Department to ensure energy security for all citizens.
                        </p>
                        <p className="mt-12 text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em]">
                            Energy Safety & Transparency Unit
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
