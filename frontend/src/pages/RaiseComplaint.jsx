import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
    MessageSquare, 
    MapPin, 
    Upload, 
    Send, 
    AlertCircle, 
    ArrowLeft, 
    UserCircle2, 
    Phone, 
    Hash, 
    CheckCircle2, 
    Package, 
    Scale, 
    Building2 
} from 'lucide-react';

export default function RaiseComplaint() {
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [district, setDistrict] = useState('');
    const [districts, setDistricts] = useState([]);
    const [taluk, setTaluk] = useState(localStorage.getItem('taluk') || '');
    const [taluks, setTaluks] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [agencyType, setAgencyType] = useState('');
    const [cylinderCount, setCylinderCount] = useState(1);
    const [cylinderWeight, setCylinderWeight] = useState('');
    const [consumerNumber, setConsumerNumber] = useState('');
    const [centerType, setCenterType] = useState('OTHERS');
    const [sector, setSector] = useState('DOMESTIC');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successId, setSuccessId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                const response = await axios.get('/api/complaints/districts/');
                setDistricts(response.data);
            } catch (err) {
                console.error('Failed to fetch districts');
            }
        };
        fetchDistricts();
    }, []);

    useEffect(() => {
        const fetchTaluks = async () => {
            if (!district) {
                setTaluks([]);
                return;
            }
            try {
                const response = await axios.get(`/api/complaints/taluks/?district=${district}`);
                setTaluks(response.data);
                if (response.data.length > 0) {
                    setTaluk(response.data[0].id);
                }
            } catch (err) {
                console.error('Failed to fetch taluks');
            }
        };
        fetchTaluks();
    }, [district]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = {
            description,
            location_details: location,
            taluk,
            consumer_name: name,
            consumer_phone: phone,
            consumer_agency_type: agencyType,
            cylinder_count: cylinderCount,
            cylinder_weight: cylinderWeight,
            consumer_number: consumerNumber,
            center_type: centerType,
            sector: sector
        };

        try {
            const token = localStorage.getItem('token');
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await axios.post('/api/complaints/items/', data, { headers });
            setSuccessId(res.data.id);
        } catch (err) {
            setError('Failed to submit SOS. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (successId) {
        return (
            <div className="flex-grow flex flex-col min-h-screen bg-kerala-green items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl"
                >
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4">SOS Recorded</h2>
                    <p className="text-gray-500 mb-10 leading-relaxed text-sm">Your emergency report has been sent to the Civil Supplies Department. Please save your Token ID for tracking.</p>
                    
                    <div className="bg-gray-50 rounded-3xl p-8 mb-10 border border-gray-100 shadow-inner">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">Your Token ID</p>
                        <p className="text-5xl font-black text-kerala-green tracking-tighter">#{successId}</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black transition-all uppercase text-xs tracking-widest shadow-xl shadow-gray-200"
                        >
                            Return Home
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full py-5 bg-white text-gray-400 font-bold rounded-2xl border border-gray-100 hover:bg-gray-50 transition-all text-xs uppercase tracking-widest"
                        >
                            Track Status
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex-grow flex flex-col min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex-grow flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl p-10 lg:p-14 border border-gray-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-kerala-green/5 rounded-bl-full pointer-events-none"></div>
                    
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-kerala-green mb-10 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Portal
                    </button>

                    <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Raise an <span className="text-kerala-green">SOS</span></h2>
                    <p className="text-gray-500 mb-12 text-sm font-medium">Citizen Emergency Response Unit</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Consumer Name</label>
                                <div className="relative">
                                    <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-kerala-green outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 text-sm"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Mobile Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                    <input
                                        type="tel"
                                        required
                                        className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-kerala-green outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 text-sm"
                                        placeholder="10 digit number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Consumer Number</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-kerala-green outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 text-sm"
                                        placeholder="Consumer ID / SV Number"
                                        value={consumerNumber}
                                        onChange={(e) => setConsumerNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Center Type</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                    <select
                                        required
                                        className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-kerala-green outline-none transition-all font-bold text-gray-900 text-sm appearance-none"
                                        value={centerType}
                                        onChange={(e) => setCenterType(e.target.value)}
                                    >
                                        <option value="HOSPITAL">Hospitals</option>
                                        <option value="EDUCATION">Educational institutes</option>
                                        <option value="PHARMA">Pharmaceutical Industry</option>
                                        <option value="SEED">Seed Processing industry</option>
                                        <option value="FISHERIES">Fisheries Industry</option>
                                        <option value="TRANSPORT_CANTEEN">Airline/ Railway Canteens</option>
                                        <option value="RESTAURANT">Restaurant/Dhaba</option>
                                        <option value="HOTEL">Hotel Industry</option>
                                        <option value="CORPORATE_CANTEEN">Corporate Canteen</option>
                                        <option value="INDUSTRIAL_CANTEEN">Industrial Canteens</option>
                                        <option value="GUEST_HOUSE">Corporate Guest House</option>
                                        <option value="FOOD_DIARY">Food Processing/Diary Industry</option>
                                        <option value="STEEL">Steel Industry</option>
                                        <option value="POWER">Power Industry</option>
                                        <option value="AUTOMOBILE">Automobile Industry</option>
                                        <option value="CERAMIC_GLASS">Ceramic/ Glass Industry</option>
                                        <option value="TEXTILE_DYE">Textile/Dye Industry</option>
                                        <option value="FOUNDRY">Foundry Forge Industry</option>
                                        <option value="CHEMICAL_PLASTIC">Chemical / Plastics Industry</option>
                                        <option value="OTHERS">Others / Case-to-case basis</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Sector</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['DOMESTIC', 'COMMERCIAL'].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setSector(s)}
                                            className={`py-5 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                                                sector === s 
                                                ? 'border-kerala-green bg-kerala-green text-white shadow-xl shadow-kerala-green/20' 
                                                : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-100'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">LPG Company</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['INDANE', 'HP', 'BHARAT'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setAgencyType(type)}
                                        className={`py-5 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                                            agencyType === type 
                                            ? 'border-kerala-green bg-kerala-green text-white shadow-xl shadow-kerala-green/20' 
                                            : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-100'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">No. of Cylinders</label>
                                <div className="relative">
                                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-kerala-green outline-none transition-all font-bold text-gray-900 text-sm"
                                        value={cylinderCount}
                                        onChange={(e) => setCylinderCount(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Cylinder Weight (kg)</label>
                                <div className="relative">
                                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                    <select
                                        required
                                        className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-kerala-green outline-none transition-all font-bold text-gray-900 text-sm appearance-none"
                                        value={cylinderWeight}
                                        onChange={(e) => setCylinderWeight(e.target.value)}
                                    >
                                        <option value="">Select Weight</option>
                                        <option value="5kg">5 kg</option>
                                        <option value="14.2kg">14.2 kg (Domestic)</option>
                                        <option value="19kg">19 kg (Commercial)</option>
                                        <option value="47.5kg">47.5 kg</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Emergency Description</label>
                            <div className="relative">
                                <MessageSquare className="absolute left-4 top-4 text-gray-300 w-5 h-5" />
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-kerala-green outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 text-sm"
                                    placeholder="Describe the issue (e.g., Gas leak, refilled failed...)"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">District</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                    <select
                                        required
                                        className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-kerala-green appearance-none font-bold text-gray-900 text-sm"
                                        value={district}
                                        onChange={(e) => {
                                            setDistrict(e.target.value);
                                            setTaluk(''); // Reset taluk when district changes
                                        }}
                                    >
                                        <option value="">Select District</option>
                                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Taluk Area</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                    <select
                                        required
                                        disabled={!district}
                                        className={`w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-kerala-green appearance-none font-bold text-gray-900 text-sm ${!district ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        value={taluk}
                                        onChange={(e) => setTaluk(e.target.value)}
                                    >
                                        <option value="">{district ? 'Select Taluk' : 'Select District First'}</option>
                                        {taluks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Specific Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-kerala-green outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 text-sm"
                                        placeholder="House Name / Street"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-rose-50 text-rose-600 p-5 rounded-2xl flex items-center gap-4 text-xs font-black uppercase tracking-widest border border-rose-100">
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-4 py-6 bg-kerala-green text-white font-black rounded-3xl shadow-2xl shadow-kerala-green/20 hover:bg-kerala-dark transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
                        >
                            {loading ? 'Submitting...' : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Launch Emergency SOS
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}


