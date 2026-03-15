import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { FileText, CheckCircle, Package, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AGENCY_FULL_NAMES, AGENCY_SHORT_NAMES } from '../utils/agencyConstants';

export default function AgencyDashboard() {
    const [complaints, setComplaints] = useState([]);
    const [stockHistory, setStockHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stockForm, setStockForm] = useState({
        location_name: '',
        product: 'LPG',
        installed_capacity: '',
        operational_capacity: '',
        opening_stock_total: '',
        opening_stock_domestic: '',
        opening_stock_non_domestic: '',
        receipts_prev_day: '',
        prev_day_dispatch: '',
        days_cover: '',
        in_transit_stock: '',
        remarks: ''
    });
    const [stockSubmitting, setStockSubmitting] = useState(false);
    const [stockMsg, setStockMsg] = useState(null);
    const [uploadingExcel, setUploadingExcel] = useState(false);

    // Get the agency code from localStorage — stored as role (AGENCY_INDANE) or agency_type (INDANE)
    const rawRole = localStorage.getItem('role') || '';
    const agencyCode = rawRole.startsWith('AGENCY_') ? rawRole.replace('AGENCY_', '') : (localStorage.getItem('agency_type') || '');
    const agencyShort = AGENCY_SHORT_NAMES[agencyCode] || agencyCode;
    const agencyFull  = AGENCY_FULL_NAMES[agencyCode]  || agencyCode;

    const formatSafeDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return isNaN(d) ? 'N/A' : d.toLocaleDateString();
    };

    const fetchAll = async () => {
        try {
            const [sosRes, stockRes] = await Promise.all([
                axios.get('/api/complaints/items/'),
                axios.get('/api/complaints/stock/')
            ]);
            setComplaints(Array.isArray(sosRes.data) ? sosRes.data : []);
            setStockHistory(Array.isArray(stockRes.data) ? stockRes.data : []);
        } catch (err) {
            console.error('Failed to load data pool');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await axios.post(`/api/complaints/items/${id}/update_agency_status/`, {
                status: newStatus,
                comments: `Status updated to ${newStatus} by Agency`
            });
            fetchAll();
        } catch (err) { alert('Status update failed'); }
    };

    const handleStockSubmit = async (e) => {
        e.preventDefault();
        setStockSubmitting(true);
        setStockMsg(null);
        try {
            await axios.post('/api/complaints/stock/', stockForm);
            setStockMsg({ type: 'success', text: 'Professional stock report submitted!' });
            setStockForm({
                location_name: '', product: 'LPG', installed_capacity: '', operational_capacity: '',
                opening_stock_total: '', opening_stock_domestic: '', opening_stock_non_domestic: '',
                receipts_prev_day: '', prev_day_dispatch: '', days_cover: '', in_transit_stock: '', remarks: ''
            });
            fetchAll();
        } catch (err) {
            setStockMsg({ type: 'error', text: 'Failed to submit report. Please check metrics.' });
        } finally {
            setStockSubmitting(false);
        }
    };

    const handleExcelUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploadingExcel(true);
        setStockMsg(null);

        try {
            const response = await axios.post('/api/complaints/stock/bulk-upload/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStockMsg({ type: 'success', text: response.data.message });
            fetchAll();
        } catch (err) {
            setStockMsg({ type: 'error', text: err.response?.data?.error || 'Excel upload failed' });
        } finally {
            setUploadingExcel(false);
            e.target.value = ''; // Reset file input
        }
    };

    const stats = {
        assigned: complaints.filter(c => c.status === 'APPROVED' || c.status === 'ASSIGNED_TO_AGENCY').length,
        in_progress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
        resolved: complaints.filter(c => c.status === 'RESOLVED').length
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 md:p-10 w-full">

                <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-1">{agencyShort} Agency Portal</h1>
                        <p className="text-sm text-gray-400 font-medium">{agencyFull}</p>
                        <p className="text-gray-500 mt-1">Official MT-based stock tracking and SOS resolution</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-kerala-green text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            {agencyShort} Branch
                        </div>
                    </div>
                </header>

                {/* SOS Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <StatCard label="Assigned SOS" value={stats.assigned} color="text-orange-500" />
                    <StatCard label="In Progress" value={stats.in_progress} color="text-blue-600" />
                    <StatCard label="Resolved SOS" value={stats.resolved} color="text-kerala-green" />
                </div>

                {/* ===== DAILY STOCK UPDATE FORM (EXCEL STYLE) ===== */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-10 overflow-hidden">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-kerala-green/10 rounded-2xl flex items-center justify-center">
                                <Package className="w-6 h-6 text-kerala-green" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Stock Overview Entry</h2>
                                <p className="text-sm text-gray-400">Enter metrics in Metric Tons (MT) or upload Excel</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                            {stockMsg && (
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${stockMsg.type === 'success' ? 'bg-green-50 text-kerala-green' : 'bg-red-50 text-red-500'}`}>
                                    {stockMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                    {stockMsg.text}
                                </div>
                            )}
                            
                            <div className="flex flex-col md:flex-row items-end gap-2">
                                <a 
                                    href="/stock_template.xlsx" 
                                    download 
                                    className="text-[10px] font-bold text-blue-600 hover:underline mb-1 ml-1 flex items-center gap-1"
                                >
                                    <FileText className="w-3 h-3" /> Download Excel Template
                                </a>
                                <div className="relative group">
                                    <input 
                                        type="file" 
                                        accept=".xlsx, .xls" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={handleExcelUpload}
                                        disabled={uploadingExcel}
                                    />
                                    <div className={`flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg group-hover:bg-blue-700 transition-all ${uploadingExcel ? 'opacity-50' : ''}`}>
                                        {uploadingExcel ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                                        {uploadingExcel ? 'Analyzing Excel...' : 'Bulk Upload Excel'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleStockSubmit} className="space-y-8">
                        {/* Section 1: Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Location Name</label>
                                <input
                                    type="text" required placeholder="e.g. Cochin LPG Bottling Plant"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-kerala-green outline-none font-medium"
                                    value={stockForm.location_name}
                                    onChange={e => setStockForm({...stockForm, location_name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Product</label>
                                <select 
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-kerala-green outline-none font-medium appearance-none"
                                    value={stockForm.product}
                                    onChange={e => setStockForm({...stockForm, product: e.target.value})}
                                >
                                    <option value="LPG">LPG</option>
                                    <option value="PROPANE">Propane</option>
                                    <option value="BUTANE">Butane</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight pl-1">Installed Capacity (MT)</label>
                                    <input type="number" step="any" required className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" placeholder="0.0" value={stockForm.installed_capacity} onChange={e => setStockForm({...stockForm, installed_capacity: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tight pl-1">Operational (MT)</label>
                                    <input type="number" step="any" required className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" placeholder="0.0" value={stockForm.operational_capacity} onChange={e => setStockForm({...stockForm, operational_capacity: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Section 2: Stock Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Opening Stock (MT)</label>
                                <div className="space-y-3">
                                    <input type="number" step="any" required placeholder="Total" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={stockForm.opening_stock_total} onChange={e => setStockForm({...stockForm, opening_stock_total: e.target.value})} />
                                    <input type="number" step="any" required placeholder="Domestic" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={stockForm.opening_stock_domestic} onChange={e => setStockForm({...stockForm, opening_stock_domestic: e.target.value})} />
                                    <input type="number" step="any" required placeholder="Non-Domestic" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={stockForm.opening_stock_non_domestic} onChange={e => setStockForm({...stockForm, opening_stock_non_domestic: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Receipts Prev Day</label>
                                    <input type="number" step="any" required className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" value={stockForm.receipts_prev_day} onChange={e => setStockForm({...stockForm, receipts_prev_day: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Previous Day Dispatch</label>
                                    <input type="number" step="any" required className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" value={stockForm.prev_day_dispatch} onChange={e => setStockForm({...stockForm, prev_day_dispatch: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Days Cover (Days)</label>
                                    <input type="number" step="any" required className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" value={stockForm.days_cover} onChange={e => setStockForm({...stockForm, days_cover: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">In Transit Stock (MT)</label>
                                    <input type="number" step="any" required className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none" value={stockForm.in_transit_stock} onChange={e => setStockForm({...stockForm, in_transit_stock: e.target.value})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Remarks</label>
                                <textarea 
                                    className="w-full h-full min-h-[140px] px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-kerala-green outline-none font-medium resize-none"
                                    placeholder="Any additional notes..."
                                    value={stockForm.remarks}
                                    onChange={e => setStockForm({...stockForm, remarks: e.target.value})}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={stockSubmitting}
                            className="w-full flex items-center justify-center gap-3 py-5 bg-kerala-green text-white font-black text-lg rounded-3xl shadow-xl hover:bg-green-700 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                        >
                            {stockSubmitting ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Package className="w-6 h-6" />}
                            {stockSubmitting ? 'Authenticating & Submitting...' : 'Submit Professional Stock Report'}
                        </button>
                    </form>
                </div>

                {/* ===== STOCK HISTORY TABLE (EXCEL STYLE) ===== */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-10 overflow-x-auto">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Stock Reports</h2>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                                <th className="p-4">Location</th>
                                <th className="p-4">Product</th>
                                <th className="p-4">Installed (MT)</th>
                                <th className="p-4">Opening Total</th>
                                <th className="p-4">Domestic</th>
                                <th className="p-4">Non-Dom</th>
                                <th className="p-4">Dispatch</th>
                                <th className="p-4">Days Cover</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {stockHistory.slice(0, 5).map(s => (
                                <tr key={s.id} className="text-sm text-gray-600 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 font-bold text-gray-900">{s.location_name || 'Unknown'}</td>
                                    <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black">{s.product_display || s.product || 'LPG'}</span></td>
                                    <td className="p-4">{s.installed_capacity || 0}</td>
                                    <td className="p-4 font-bold text-kerala-green">{s.opening_stock_total || 0}</td>
                                    <td className="p-4">{s.opening_stock_domestic || 0}</td>
                                    <td className="p-4">{s.opening_stock_non_domestic || 0}</td>
                                    <td className="p-4 text-blue-600 font-bold">{s.prev_day_dispatch || 0}</td>
                                    <td className="p-4">{s.days_cover || 0}</td>
                                    <td className="p-4 text-gray-400 font-medium">{formatSafeDate(s.created_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ===== ACTIVE SOS TICKETS ===== */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Active SOS Tickets</h2>

                    {loading ? (
                        <p className="text-gray-400">Loading...</p>
                    ) : complaints.length === 0 ? (
                        <p className="text-gray-400 italic">No SOS reports currently assigned to your agency.</p>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {complaints.map(c => (
                                <div key={c.id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="font-black text-gray-700">SOS #{c.id}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                            c.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                                            c.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>{c.status.replace(/_/g, ' ')}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{c.description}</p>
                                    <p className="text-gray-400 text-xs mb-4">Consumer: <span className="font-bold text-gray-600">{c.user_name}</span></p>
                                    <div className="flex gap-2 flex-wrap">
                                        <Link to={`/complaints/${c.id}`} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200">
                                            <FileText className="w-3 h-3" /> View
                                        </Link>
                                        {(c.status === 'ASSIGNED_TO_AGENCY' || c.status === 'APPROVED') && (
                                            <button onClick={() => handleUpdateStatus(c.id, 'IN_PROGRESS')} className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-100 rounded-xl hover:bg-blue-200">
                                                Accept & Start
                                            </button>
                                        )}
                                        {c.status === 'IN_PROGRESS' && (
                                            <button onClick={() => handleUpdateStatus(c.id, 'RESOLVED')} className="px-3 py-1.5 text-xs font-bold text-green-700 bg-green-100 rounded-xl hover:bg-green-200">
                                                Mark Resolved
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">{label}</p>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
        </div>
    );
}
