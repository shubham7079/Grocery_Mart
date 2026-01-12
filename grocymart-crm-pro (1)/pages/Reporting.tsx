
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { getInventoryInsights, generateSalesSummary } from '../services/geminiService';

const Reporting: React.FC = () => {
  const { products, orders } = useAppContext();
  const [inventoryInsights, setInventoryInsights] = useState<string>('Analyzing your inventory...');
  const [salesSummary, setSalesSummary] = useState<string>('Summarizing sales performance...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const [inv, sales] = await Promise.all([
        getInventoryInsights(products),
        generateSalesSummary(orders)
      ]);
      setInventoryInsights(inv || 'Error analyzing inventory.');
      setSalesSummary(sales || 'Error summarizing sales.');
      setLoading(false);
    };
    fetchInsights();
  }, [products, orders]);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Operational Insights</h1>
          <p className="text-slate-500 text-sm">AI-driven analytics and performance summaries.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-medium hover:bg-slate-50 transition-colors">
            Export PDF
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-green-700 transition-colors">
            Share Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Inventory AI Analysis</h3>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl p-6 relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 text-sm font-medium">Gemini is processing...</p>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
                {inventoryInsights}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800">Sales Summary</h3>
          </div>
          <div className="flex-1 bg-slate-50 rounded-xl p-6 relative">
             {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 text-sm font-medium">Aggregating data...</p>
              </div>
            ) : (
              <div className="text-slate-700 italic leading-relaxed">
                "{salesSummary}"
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-6">Inventory Turnover Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
             <p className="text-orange-700 text-sm font-bold uppercase tracking-wider mb-2">Slow Moving</p>
             <p className="text-2xl font-black text-orange-900">12 Items</p>
             <p className="text-orange-600 text-xs mt-1 italic">Action: Discount recommended</p>
          </div>
          <div className="p-4 bg-green-50 rounded-2xl border border-green-100">
             <p className="text-green-700 text-sm font-bold uppercase tracking-wider mb-2">High Demand</p>
             <p className="text-2xl font-black text-green-900">4 Items</p>
             <p className="text-green-600 text-xs mt-1 italic">Action: Increase re-order qty</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
             <p className="text-blue-700 text-sm font-bold uppercase tracking-wider mb-2">Expiring Soon</p>
             <p className="text-2xl font-black text-blue-900">8 Items</p>
             <p className="text-blue-600 text-xs mt-1 italic">Action: Flash sale setup</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reporting;
