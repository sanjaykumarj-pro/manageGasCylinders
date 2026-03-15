import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StockPanel from '../components/StockPanel';
import axios from 'axios';
import { FileText, ArrowRight, XCircle, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AGENCY_FULL_NAMES, AGENCY_SHORT_NAMES } from '../utils/agencyConstants';

const AGENCY_BRANCHES = [
    { key: 'ALL',    label: 'All Corporations',                                        color: 'bg-gray-100 text-gray-700'   },
    { key: 'INDANE', label: 'IOCL – Indian Oil',                                       color: 'bg-orange-100 text-orange-700' },
    { key: 'HP',     label: 'HPCL – Hindustan Petroleum',                              color: 'bg-blue-100 text-blue-700'   },
    { key: 'BHARAT', label: 'BPCL – Bharat Petroleum',                                 color: 'bg-green-100 text-green-700' },
    { key: 'NONE',   label: 'Unassigned / Not Mentioned',                              color: 'bg-gray-100 text-gray-500'   },
];

const AGENCY_BADGE = {
    INDANE: 'bg-orange-100 text-orange-700',
    HP: 'bg-blue-100 text-blue-700',
    BHARAT: 'bg-green-100 text-green-700',
    NONE: 'bg-gray-100 text-gray-500',
};

export default function TalukDashboard() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeBranch, setActiveBranch] = useState('ALL');

    const fetchComplaints = async () => {
        try {
            const response = await axios.get('/api/complaints/items/');
            setComplaints(response.data);
        } catch (err) {
            console.error('Failed to fetch SOS reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaints(); }, []);

    const handleForward = async (id) => {
        try {
            await axios.post(`/api/complaints/items/${id}/forward_to_district/`, {});
            fetchComplaints();
        } catch (err) { alert('Forwarding failed'); }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`/api/complaints/items/${id}/reject/`, { comments: 'Rejected by Taluk Officer' });
            fetchComplaints();
        } catch (err) { alert('Rejection failed'); }
    };

    // Determine agency branch (handles both logged-in users and anonymous consumers)
    const getAgency = (c) => c.consumer_agency_type || c.user_agency_type || 'NONE';

    // Filter by active branch
    const filtered = activeBranch === 'ALL'
        ? complaints
        : complaints.filter(c => getAgency(c) === activeBranch);

    const stats = {
        pending: complaints.filter(c => c.status === 'UNDER_TALUK_REVIEW').length,
        forwarded: complaints.filter(c => c.status === 'UNDER_DISTRICT_REVIEW' || c.status === 'FORWARDED_TO_COMMISSIONER').length,
        indane: complaints.filter(c => getAgency(c) === 'INDANE').length,
        hp: complaints.filter(c => getAgency(c) === 'HP').length,
        bharat: complaints.filter(c => getAgency(c) === 'BHARAT').length,
        unassigned: complaints.filter(c => getAgency(c) === 'NONE').length,
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto p-6 md:p-10 w-full">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">Taluk Supply Officer</h1>
                    <p className="text-gray-500">Review and forward SOS reports for your assigned jurisdiction.</p>
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                    <StatCard label="Pending Review" value={stats.pending} color="text-kerala-green" />
                    <StatCard label="Forwarded" value={stats.forwarded} color="text-blue-600" />
                    <StatCard label="Indane" value={stats.indane} color="text-orange-500" />
                    <StatCard label="HP Gas" value={stats.hp} color="text-blue-500" />
                    <StatCard label="Bharat Gas" value={stats.bharat} color="text-green-600" />
                </div>

                {/* Agency Stock Panel */}
                <StockPanel />

                {/* Agency Branch Filter Tabs */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {AGENCY_BRANCHES.map(branch => (
                        <button
                            key={branch.key}
                            onClick={() => setActiveBranch(branch.key)}
                            className={`px-5 py-2 rounded-full font-bold text-sm transition-all border-2 ${
                                activeBranch === branch.key
                                    ? `${branch.color} border-current scale-105 shadow-md`
                                    : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {branch.label}
                            <span className="ml-2 text-xs opacity-70">
                                ({branch.key === 'ALL' ? complaints.length : complaints.filter(c => getAgency(c) === branch.key).length})
                            </span>
                        </button>
                    ))}
                </div>

                {/* SOS Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        SOS Reports — {AGENCY_BRANCHES.find(b => b.key === activeBranch)?.label}
                    </h2>

                    {loading ? (
                        <p className="text-gray-400">Loading SOS reports...</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-gray-400 italic">No SOS reports found for this branch.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 text-gray-400 text-sm uppercase tracking-wider">
                                        <th className="py-4 font-bold">ID</th>
                                        <th className="py-4 font-bold">Consumer</th>
                                        <th className="py-4 font-bold">Agency Branch</th>
                                        <th className="py-4 font-bold">Taluk</th>
                                        <th className="py-4 font-bold">Status</th>
                                        <th className="py-4 font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 font-bold text-gray-700">#{c.id}</td>
                                            <td className="py-4 text-gray-600">{c.consumer_name || c.user_name || 'Public User'}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${AGENCY_BADGE[getAgency(c)] || AGENCY_BADGE.NONE}`}>
                                                    {AGENCY_SHORT_NAMES[getAgency(c)] || getAgency(c) || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-4 text-gray-500 text-sm">{c.taluk_name || '-'}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                                    c.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                    c.status === 'UNDER_TALUK_REVIEW' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-600'
                                                }`}>
                                                    {c.status.replace(/_/g, ' ')}
                                                </span>
                                            </td>
                                            <td className="py-4 flex gap-2">
                                                <Link to={`/complaints/${c.id}`} className="p-2 text-gray-400 hover:text-kerala-green" title="View Details">
                                                    <FileText className="w-5 h-5" />
                                                </Link>
                                                {c.status === 'UNDER_TALUK_REVIEW' && (
                                                    <>
                                                        <button onClick={() => handleForward(c.id)} className="p-2 text-orange-400 hover:text-orange-600" title="Forward to District">
                                                            <ArrowRight className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => handleReject(c.id)} className="p-2 text-red-400 hover:text-red-600" title="Reject">
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
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-1">{label}</p>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
        </div>
    );
}
