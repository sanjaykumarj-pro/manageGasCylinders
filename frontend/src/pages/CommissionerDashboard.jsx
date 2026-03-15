import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StockPanel from '../components/StockPanel';
import axios from 'axios';
import { FileText, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AGENCY_SHORT_NAMES } from '../utils/agencyConstants';

export default function CommissionerDashboard() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchComplaints = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/complaints/items/', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setComplaints(response.data);
        } catch (err) {
            console.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleApprove = async (complaint, manualAgencyRole = null) => {
        try {
            const token = localStorage.getItem('token');
            const payload = manualAgencyRole ? { agency: manualAgencyRole } : {};
            await axios.post(`/api/complaints/items/${complaint.id}/approve/`, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchComplaints();
        } catch (err) {
            alert('Approval failed: ' + (err.response?.data?.error || 'Unknown error. Make sure an agency is assigned.'));
        }
    };

    const handleReject = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/complaints/items/${id}/reject/`, { comments: 'Rejected by Commissioner' }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchComplaints();
        } catch (err) {
            alert('Rejection failed');
        }
    };

    const stats = {
        total: complaints.length,
        pending_approval: complaints.filter(c => c.status === 'FORWARDED_TO_COMMISSIONER').length,
        approved: complaints.filter(c => c.status === 'APPROVED' || c.status === 'ASSIGNED_TO_AGENCY' || c.status === 'RESOLVED').length
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col relative">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 md:p-10 w-full">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Commissioner</h1>
                    <p className="text-gray-500">Final review and agency assignment for Kerala LPG SOS reports</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard label="Total SOS" value={stats.total} color="text-gray-900" />
                    <StatCard label="Action Required" value={stats.pending_approval} color="text-red-500" />
                    <StatCard label="Processed" value={stats.approved} color="text-kerala-green" />
                </div>

                {/* Agency Stock Panel */}
                <StockPanel />

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">SOS — Commissioner Approval Queue</h2>

                    {loading ? (
                        <p className="text-gray-400">Loading complaints...</p>
                    ) : complaints.length === 0 ? (
                        <p className="text-gray-400 italic">No SOS reports awaiting your decision.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="py-4 font-bold">ID</th>
                                        <th className="py-4 font-bold">Consumer</th>
                                        <th className="py-4 font-bold">Agency Branch</th>
                                        <th className="py-4 font-bold">District</th>
                                        <th className="py-4 font-bold">Status</th>
                                        <th className="py-4 font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {complaints.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 font-bold text-gray-700">#{c.id}</td>
                                            <td className="py-4 text-gray-600">{c.user_name || 'Public User'}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                                    c.user_agency_type === 'INDANE' ? 'bg-orange-100 text-orange-700' :
                                                    c.user_agency_type === 'HP' ? 'bg-blue-100 text-blue-700' :
                                                    c.user_agency_type === 'BHARAT' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-500'
                                                }`}>{AGENCY_SHORT_NAMES[c.user_agency_type] || c.user_agency_type || 'N/A'}</span>
                                            </td>
                                            <td className="py-4 text-gray-600">{c.district_name || 'Kerala'}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${c.status === 'FORWARDED_TO_COMMISSIONER' ? 'bg-red-100 text-red-600' :
                                                    c.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                                        'bg-orange-100 text-orange-600'
                                                    }`}>
                                                    {c.status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="py-4 flex gap-2">
                                                <Link to={`/complaints/${c.id}`} className="p-2 text-gray-400 hover:text-kerala-green" title="View">
                                                    <FileText className="w-5 h-5" />
                                                </Link>
                                                {c.status === 'FORWARDED_TO_COMMISSIONER' && (
                                                    <>
                                                        {(!c.user_agency_type || c.user_agency_type === 'NONE') ? (
                                                            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
                                                                <select id={`assign-${c.id}`} className="text-xs bg-transparent border-none outline-none text-gray-700 font-bold cursor-pointer">
                                                                    <option value="AGENCY_INDANE">IOCL</option>
                                                                    <option value="AGENCY_HP">HPCL</option>
                                                                    <option value="AGENCY_BHARAT">BPCL</option>
                                                                </select>
                                                                <button onClick={() => {
                                                                    const sel = document.getElementById(`assign-${c.id}`).value;
                                                                    handleApprove(c, sel);
                                                                }} className="p-1 text-green-600 hover:scale-110 transition-transform" title="Approve & Manually Assign">
                                                                    <CheckCircle className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => handleApprove(c)} className="p-2 text-green-500 hover:scale-110 transition-transform" title={`Approve & Auto-assign to ${c.user_agency_type}`}>
                                                                <CheckCircle className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleReject(c.id)} className="p-2 text-red-500 hover:scale-110 transition-transform" title="Reject SOS">
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color }) {
    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 italic text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">{label}</p>
            <p className={`text-4xl font-black ${color}`}>{value}</p>
        </div>
    );
}
