import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  CartesianGrid,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { BarChart3, LineChart as LineChartIcon, Sparkles } from 'lucide-react';

export default function ExpenseCharts({ transactions }) {
  const [chartType, setChartType] = useState('category'); // 'category' or 'trend'

  // 1. Process data for Category Breakdown Chart
  const categoryMap = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
    });

  const categoryData = Object.keys(categoryMap).map((cat) => ({
    name: cat.split(' ')[0], // Shortened for axis
    fullName: cat,
    total: categoryMap[cat],
  })).sort((a, b) => b.total - a.total);

  // 2. Process data for Date Trend Chart
  const dateMap = {};
  transactions.forEach((t) => {
    if (!dateMap[t.date]) {
      dateMap[t.date] = { date: t.date, pengeluaran: 0, pemasukan: 0 };
    }
    if (t.type === 'expense') {
      dateMap[t.date].pengeluaran += Number(t.amount);
    } else {
      dateMap[t.date].pemasukan += Number(t.amount);
    }
  });

  const trendData = Object.values(dateMap).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Colors for Glowing Bar Charts
  const BAR_COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-blue-500/30 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs">
          <p className="font-bold text-white mb-1">{payload[0]?.payload?.fullName || label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-semibold">
              {entry.name || 'Total'}: Rp {Number(entry.value).toLocaleString('id-ID')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="cosmic-glass rounded-3xl p-6 mb-8 border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.12)] relative overflow-hidden"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header & Chart Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">Grafik & Visualisasi Keuangan 🚀</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Analisis visual pengeluaran dan tren keuangan mahasiswa.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-blue-500/20 text-xs">
          <button
            onClick={() => setChartType('category')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              chartType === 'category'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Per Kategori</span>
          </button>
          <button
            onClick={() => setChartType('trend')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              chartType === 'trend'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LineChartIcon className="w-3.5 h-3.5" />
            <span>Tren Waktu</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-64 sm:h-72 w-full relative z-10 pt-2">
        {chartType === 'category' ? (
          categoryData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
              Belum ada data pengeluaran untuk ditampilkan dalam grafik.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
              <defs>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="pengeluaran" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpense)" name="Pengeluaran" />
              <Area type="monotone" dataKey="pemasukan" stroke="#10b981" fillOpacity={1} fill="url(#colorIncome)" name="Pemasukan" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
