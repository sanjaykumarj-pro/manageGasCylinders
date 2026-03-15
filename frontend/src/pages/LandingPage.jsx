import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, BarChart3, Clock, Users, CheckCircle2, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function LandingPage() {
  const [stats, setStats] = useState({
    total_complaints: 0,
    resolved_complaints: 0,
    district_breakdown: []
  });

  useEffect(() => {
    // Fetch stats from our backend API
    axios.get('/api/complaints/stats/analytics/')
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="flex-grow">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-kerala-green overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute transform -rotate-12 -left-20 -top-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute transform rotate-12 -right-20 -bottom-20 w-96 h-96 bg-kerala-gold rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center lg:text-left grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Transparent LPG <br />
                <span className="text-kerala-gold">Complaint Tracking</span>
              </h1>
              <p className="text-lg text-kerala-light mb-8 max-w-xl">
                A centralized portal by the Government of Kerala to ensure your LPG concerns are addressed with transparency and efficiency by dedicated administrative officers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {localStorage.getItem('token') ? (
                  <>
                    <Link to={
                      localStorage.getItem('role') === 'PUBLIC' ? "/dashboard/public" :
                        localStorage.getItem('role') === 'TALUK_OFFICER' ? "/dashboard/taluk" :
                          localStorage.getItem('role') === 'DISTRICT_OFFICER' ? "/dashboard/district" :
                            localStorage.getItem('role') === 'COMMISSIONER' ? "/dashboard/commissioner" :
                              localStorage.getItem('role')?.startsWith('AGENCY_') ? "/dashboard/agency" : "/"
                    } className="px-8 py-4 bg-white text-kerala-green font-bold rounded-xl shadow-xl hover:bg-gray-100 transition-all active:scale-95 text-lg text-center">
                      Go to Dashboard
                    </Link>
                    {localStorage.getItem('role') === 'PUBLIC' && (
                      <Link to="/raise-complaint" className="px-8 py-4 bg-kerala-dark text-white font-bold rounded-xl shadow-xl hover:bg-black transition-all active:scale-95 text-lg border border-white/20 text-center">
                        Raise Complaint
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link to="/register" className="px-8 py-4 bg-white text-kerala-green font-bold rounded-xl shadow-xl hover:bg-gray-100 transition-all active:scale-95 text-lg text-center">
                      Register Complaint
                    </Link>
                    <Link to="/login" className="px-8 py-4 bg-kerala-dark text-white font-bold rounded-xl shadow-xl hover:bg-black transition-all active:scale-95 text-lg border border-white/20 text-center">
                      Track Status
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl"
            >
              <div className="grid grid-cols-2 gap-6">
                <StatCard icon={<FileText className="text-white" />} label="Registered" value={stats.total_complaints} />
                <StatCard icon={<CheckCircle2 className="text-kerala-gold" />} label="Resolved" value={stats.resolved_complaints} />
                <StatCard icon={<Users className="text-white" />} label="Active Users" value="1.2k+" />
                <StatCard icon={<BarChart3 className="text-white" />} label="Districts" value="14" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How it Works</h2>
            <div className="w-20 h-1 bg-kerala-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <FeatureItem
              icon={<ShieldCheck className="w-8 h-8 text-kerala-green" />}
              title="State Verified"
              desc="Direct connection to Civil Supplies Department and administrative officers."
            />
            <FeatureItem
              icon={<Clock className="w-8 h-8 text-kerala-green" />}
              title="Real-time Tracking"
              desc="Monitor your complaint as it moves through Taluk and District levels."
            />
            <FeatureItem
              icon={<FileText className="w-8 h-8 text-kerala-green" />}
              title="Direct Action"
              desc="Automated assignment to Indane, HP, or Bharat Gas agencies for quick resolution."
            />
          </div>
        </div>
      </section>

      {/* District Stats Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">District-wise Activity</h2>
              <p className="text-gray-500">Live complaint statistics across Kerala districts.</p>
            </div>
            <button className="text-kerala-green font-bold hover:underline">View Full Reports →</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.district_breakdown.map((d, i) => (
              <div key={i} className="card-kerala text-center">
                <h3 className="font-bold text-gray-800 mb-1">{d.name}</h3>
                <p className="text-2xl font-black text-kerala-green">{d.count}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mt-2">Complaints</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-kerala-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-kerala-light/60 text-sm">© 2026 Government of Kerala. All Rights Reserved.</p>
          <p className="text-kerala-light/40 text-xs mt-2 italic">Official Platform for LPG Management - Civil Supplies Department</p>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4">{icon}</div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm text-kerala-light/70">{label}</p>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="text-center group">
      <div className="w-16 h-16 bg-kerala-light rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
      <div className="mt-8">
        <Link to="/register" className="inline-flex items-center gap-2 text-kerala-green font-bold hover:underline">
          Get Started →
        </Link>
      </div>
    </div>
  );
}
