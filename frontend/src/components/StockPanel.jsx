import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, TrendingDown, RefreshCw } from 'lucide-react';
import { AGENCY_FULL_NAMES, AGENCY_SHORT_NAMES } from '../utils/agencyConstants';

const AGENCY_COLORS = {
    INDANE: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', accent: 'text-orange-600' },
    HP:     { bg: 'bg-blue-50',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',     accent: 'text-blue-600'   },
    BHARAT: { bg: 'bg-green-50',  border: 'border-green-200',  badge: 'bg-green-100 text-green-700',   accent: 'text-green-600'  },
};

export default function StockPanel() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRefreshed, setLastRefreshed] = useState(null);

    const formatSafeDate = (dateStr) => {
        if (!dateStr) return { date: 'N/A', time: '' };
        const d = new Date(dateStr);
        if (isNaN(d)) return { date: 'N/A', time: '' };
        return {
            date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    const fetchStock = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/complaints/stock/');
            // Keep all records to show multiple locations per agency
            setStocks(response.data);
            setLastRefreshed(new Date());
        } catch (err) {
            console.error('Failed to fetch stock data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStock(); }, []);

    const agencyOrder = ['INDANE', 'HP', 'BHARAT'];

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-10 overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-kerala-green/10 rounded-2xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-kerala-green" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Professional Stock Overview</h2>
                        <p className="text-sm text-gray-400">Detailed Metric Ton (MT) reports from all agencies</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {lastRefreshed && (
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hidden md:block">
                            Updated: {lastRefreshed.toLocaleTimeString()}
                        </p>
                    )}
                    <button
                        onClick={fetchStock}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Sync Data
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <RefreshCw className="w-8 h-8 animate-spin text-kerala-green" />
                </div>
            ) : stocks.length === 0 ? (
                <div className="py-20 text-center">
                    <Package className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium italic">Waiting for daily stock reports from agencies...</p>
                </div>
            ) : (
                <div className="overflow-x-auto -mx-1">
                    <table className="w-full text-left border-separate border-spacing-y-2">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="px-6 py-4">OMC</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Opening Stock (MT)</th>
                                <th className="px-6 py-4">Receipts</th>
                                <th className="px-6 py-4">Dispatch</th>
                                <th className="px-6 py-4">Days Cover</th>
                                <th className="px-6 py-4 text-right">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map(s => {
                                const c = AGENCY_COLORS[s.agency_type] || { bg: 'bg-gray-50', border: 'border-gray-200', accent: 'text-gray-600' };
                                return (
                                    <tr key={s.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5 first:rounded-l-2xl border-y border-l border-gray-100 bg-white">
                                            <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${c.badge || 'bg-gray-100 text-gray-600'}`}>
                                                {AGENCY_SHORT_NAMES[s.agency_type] || s.agency_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 border-y border-gray-100 bg-white">
                                            <p className="font-bold text-gray-900">{s.location_name}</p>
                                        </td>
                                        <td className="px-6 py-5 border-y border-gray-100 bg-white">
                                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded italic uppercase">{s.product_display}</span>
                                        </td>
                                        <td className="px-6 py-5 border-y border-gray-100 bg-white">
                                            <p className="text-lg font-black text-kerala-green">{s.opening_stock_total} <span className="text-[10px] text-gray-400 font-normal">MT</span></p>
                                            <div className="flex gap-2 text-[8px] font-bold uppercase mt-1">
                                                <span className="text-gray-400">Dom: {s.opening_stock_domestic}</span>
                                                <span className="text-gray-400">Non-Dom: {s.opening_stock_non_domestic}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 border-y border-gray-100 bg-white">
                                            <p className="text-md font-bold text-gray-700">{s.receipts_prev_day} <span className="text-[10px] text-gray-400 font-normal uppercase">MT</span></p>
                                        </td>
                                        <td className="px-6 py-5 border-y border-gray-100 bg-white text-blue-600">
                                            <p className="text-md font-bold">{s.prev_day_dispatch} <span className="text-[10px] text-blue-400 font-normal uppercase">MT</span></p>
                                        </td>
                                        <td className="px-6 py-5 border-y border-gray-100 bg-white">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className={`h-full ${s.days_cover > 5 ? 'bg-kerala-green' : 'bg-orange-500'}`} style={{ width: `${Math.min(s.days_cover * 10, 100)}%` }}></div>
                                                </div>
                                                <p className="text-sm font-black text-gray-900">{s.days_cover} <span className="text-[10px] text-gray-400 font-normal">Days</span></p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 last:rounded-r-2xl border-y border-r border-gray-100 bg-white text-right">
                                            <p className="text-xs font-bold text-gray-400">{formatSafeDate(s.created_at).date}</p>
                                            <p className="text-[10px] text-gray-300 font-medium uppercase mt-0.5">{formatSafeDate(s.created_at).time}</p>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
