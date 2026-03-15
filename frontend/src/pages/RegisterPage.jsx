import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/auth';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { User, Lock, Mail, Phone, Building, Factory, AlertCircle, CheckCircle, MapPin, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone_number: '',
        consumer_number: '',
        organization_name: '',
        agency_type: 'NONE',
        address: '',
        district: '',
        taluk: ''
    });
    const [districts, setDistricts] = useState([]);
    const [taluks, setTaluks] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/complaints/districts/')
            .then(res => setDistricts(res.data))
            .catch(err => console.error("Error fetching districts:", err));
    }, []);

    useEffect(() => {
        if (formData.district) {
            axios.get(`/api/complaints/taluks/?district=${formData.district}`)
                .then(res => setTaluks(res.data))
                .catch(err => console.error("Error fetching taluks:", err));
        } else {
            setTaluks([]);
        }
    }, [formData.district]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData);
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.username?.[0] || 'Registration failed. Please try again.');
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
                    className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-500">Register to report and track LPG issues</p>
                    </div>

                    {success ? (
                        <div className="text-center py-10">
                            <CheckCircle className="w-20 h-20 text-kerala-green mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900">Registration Successful!</h3>
                            <p className="text-gray-500">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-8">
                            {/* Section 1: Account Credentials */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-kerala-green/10 text-kerala-green flex items-center justify-center text-sm">1</span>
                                    Account Credentials
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Username</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input name="username" type="text" required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-kerala-green" placeholder="johndoe" value={formData.username} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input name="email" type="email" required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-kerala-green" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input name="password" type="password" required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-kerala-green" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Section 2: Consumer Details */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-kerala-green/10 text-kerala-green flex items-center justify-center text-sm">2</span>
                                    Consumer Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Consumer Number</label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input name="consumer_number" type="text" required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-kerala-green" placeholder="123456789" value={formData.consumer_number} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input name="phone_number" type="text" required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-kerala-green" placeholder="+91 9876543210" value={formData.phone_number} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Select Agency</label>
                                        <div className="relative">
                                            <Factory className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                            <select name="agency_type" required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-kerala-green appearance-none" value={formData.agency_type} onChange={handleChange}>
                                                 <option value="NONE">Select Your Oil Corporation</option>
                                                 <option value="INDANE">IOCL – Indian Oil Corporation Limited</option>
                                                 <option value="HP">HPCL – Hindustan Petroleum Corporation Limited</option>
                                                 <option value="BHARAT">BPCL – Bharat Petroleum Corporation Limited</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Section 3: Location Details */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-kerala-green/10 text-kerala-green flex items-center justify-center text-sm">3</span>
                                    Location Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">District</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                            <select name="district" required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-kerala-green appearance-none" value={formData.district} onChange={handleChange}>
                                                <option value="">Select District</option>
                                                {districts.map(d => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Taluk</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                                            <select name="taluk" required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-kerala-green appearance-none" value={formData.taluk} onChange={handleChange}>
                                                <option value="">Select Taluk</option>
                                                {taluks.map(t => (
                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Society / Org Name</label>
                                        <div className="relative">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input name="organization_name" type="text" required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-kerala-green" placeholder="Your Org / Society" value={formData.organization_name} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                {error && (
                                    <div className="bg-red-50 text-kerala-red p-4 rounded-xl flex items-center gap-3 text-sm font-medium mb-4">
                                        <AlertCircle className="w-5 h-5" />
                                        {error}
                                    </div>
                                )}

                                <button
                                    disabled={loading}
                                    className="w-full py-4 bg-kerala-green text-white font-black rounded-2xl shadow-lg hover:bg-kerala-dark transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Register Account'}
                                </button>

                                <p className="text-center mt-6 text-sm text-gray-500">
                                    Already have an account? <Link to="/login" className="text-kerala-green font-bold hover:underline">Sign In</Link>
                                </p>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
