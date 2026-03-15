import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ArrowLeft, Clock, User, MessageSquare, CheckCircle, AlertCircle, FileText, MapPin, ArrowRight, XCircle, Factory } from 'lucide-react';

export default function ComplaintDetails() {
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [agency, setAgency] = useState('');
    const navigate = useNavigate();

    const fetchComplaint = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/complaints/items/${id}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComplaint(response.data);
        } catch (err) {
            console.error('Failed to fetch complaint details', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const handleAction = async (actionUrl, data = {}) => {
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/complaints/items/${id}/${actionUrl}/`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchComplaint();
            setShowApproveModal(false);
        } catch (err) {
            alert('Action failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kerala-green"></div>
            </div>
        </div>
    );

    if (!complaint) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-center justify-center">
                <p className="text-gray-500">Complaint not found.</p>
            </div>
        </div>
    );

    const userRole = localStorage.getItem('role');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="max-w-4xl w-full mx-auto p-6 md:p-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-kerala-green mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Dashboard
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Complaint #{complaint.id}</span>
                                <span className={`px-4 py-1 rounded-full text-xs font-black uppercase ${complaint.status === 'REJECTED' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                    }`}>
                                    {complaint.status?.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">{complaint.description}</h1>

                            <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 italic">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Location</p>
                                    <p className="text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {complaint.taluk_name || 'Taluk'}, {complaint.district_name || 'District'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Submitted On</p>
                                    <p className="text-gray-900 flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> {new Date(complaint.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Action Buttons for Officers */}
                            <div className="mt-8 flex flex-wrap gap-4">
                                {userRole === 'TALUK_OFFICER' && (complaint.status === 'SUBMITTED' || complaint.status === 'UNDER_TALUK_REVIEW') && (
                                    <>
                                        <button onClick={() => handleAction('forward_to_district')} disabled={submitting} className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all">
                                            <ArrowRight className="w-4 h-4" /> Forward to District
                                        </button>
                                        <button onClick={() => handleAction('reject', { comments: 'Rejected by Taluk Officer' })} disabled={submitting} className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all">
                                            <XCircle className="w-4 h-4" /> Reject
                                        </button>
                                    </>
                                )}

                                {userRole === 'DISTRICT_OFFICER' && complaint.status === 'UNDER_DISTRICT_REVIEW' && (
                                    <>
                                        <button onClick={() => handleAction('forward_to_commissioner')} disabled={submitting} className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                                            <ArrowRight className="w-4 h-4" /> Forward to Commissioner
                                        </button>
                                        <button onClick={() => handleAction('reject', { comments: 'Rejected by District Officer' })} disabled={submitting} className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all">
                                            <XCircle className="w-4 h-4" /> Reject
                                        </button>
                                    </>
                                )}

                                {userRole === 'COMMISSIONER' && complaint.status === 'FORWARDED_TO_COMMISSIONER' && (
                                    <>
                                        <button onClick={() => setShowApproveModal(true)} disabled={submitting} className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-kerala-green text-white font-bold rounded-xl hover:bg-kerala-dark transition-all">
                                            <CheckCircle className="w-4 h-4" /> Approve & Assign
                                        </button>
                                        <button onClick={() => handleAction('reject', { comments: 'Rejected by Commissioner' })} disabled={submitting} className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all">
                                            <XCircle className="w-4 h-4" /> Reject
                                        </button>
                                    </>
                                )}

                                {userRole?.startsWith('AGENCY_') && (
                                    <>
                                        {complaint.status === 'APPROVED' && (
                                            <button onClick={() => handleAction('update_agency_status', { status: 'IN_PROGRESS' })} disabled={submitting} className="flex-1 min-w-[150px] py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all">
                                                Accept Ticket
                                            </button>
                                        )}
                                        {complaint.status === 'IN_PROGRESS' && (
                                            <button onClick={() => handleAction('update_agency_status', { status: 'RESOLVED' })} disabled={submitting} className="flex-1 min-w-[150px] py-3 bg-kerala-green text-white font-bold rounded-xl hover:bg-kerala-dark transition-all">
                                                Mark as Resolved
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </motion.div>

                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-kerala-green" />
                                Processing History
                            </h2>

                            <div className="space-y-6">
                                {complaint.history && complaint.history.length > 0 ? (
                                    complaint.history.map((step, idx) => (
                                        <motion.div
                                            key={step.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="relative pl-8 border-l-2 border-gray-100 pb-2"
                                        >
                                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-kerala-green"></div>
                                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-bold text-gray-900">{step.status?.replace(/_/g, ' ')}</span>
                                                    <span className="text-xs text-gray-400">{new Date(step.created_at).toLocaleString()}</span>
                                                </div>
                                                <p className="text-gray-600 mb-4">{step.comments || "No comments provided."}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <User className="w-3 h-3" />
                                                    <span>Updated by {step.changed_by_name || 'System'}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No history records yet.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Meta Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Agency Assigned</span>
                                    <span className="font-bold text-gray-900">{complaint.assigned_agency?.replace('AGENCY_', '') || 'Not Assigned'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Supporting Doc</span>
                                    {complaint.supporting_document ? (
                                        <a href={complaint.supporting_document} target="_blank" className="text-kerala-green font-bold hover:underline">View File</a>
                                    ) : (
                                        <span className="text-gray-400">None</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-kerala-green/10 p-8 rounded-3xl border border-kerala-green/20">
                            <h3 className="font-bold text-kerala-green mb-2">Notice</h3>
                            <p className="text-sm text-gray-600">
                                Your status updates are visible to Taluk, District, and Commission offices in real-time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approval Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">Final Approval</h3>
                        <p className="text-gray-500 mb-6">Assign an agency to resolve this complaint.</p>

                        <div className="space-y-4 mb-8">
                            <label className="block">
                                <span className="text-sm font-bold text-gray-700 ml-1 text-white/0">Agency Type</span>
                                <div className="relative mt-2">
                                    <Factory className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-kerala-green appearance-none"
                                        value={agency}
                                        onChange={(e) => setAgency(e.target.value)}
                                    >
                                        <option value="">Choose Agency</option>
                                        <option value="AGENCY_INDANE">Indane</option>
                                        <option value="AGENCY_BHARAT">Bharat Gas</option>
                                        <option value="AGENCY_HP">HP Gas</option>
                                    </select>
                                </div>
                            </label>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setShowApproveModal(false)} className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-2xl transition-all">Cancel</button>
                            <button onClick={() => handleAction('approve', { agency })} className="flex-1 py-4 font-bold bg-kerala-green text-white rounded-2xl shadow-lg hover:bg-kerala-dark transition-all">Approve</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
