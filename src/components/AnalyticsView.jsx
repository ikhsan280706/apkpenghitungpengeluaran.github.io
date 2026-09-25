import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
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
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Sparkles,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Flame
} from 'lucide-react';

export default function AnalyticsView({ transactions }) {
  // -------------------------------------------------------------
  // REAL TRANSACTION DATA CALCULATIONS
  // -------------------------------------------------------------
  
  // 1. Totals
  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const netBalance = totalIncome - totalExpense;

  // 2. Income vs Expense Donut Data
  const incomeExpenseData = useMemo(() => [
    { name: 'Pemasukan', value: totalIncome, color: '#10b981' },
    { name: 'Pengeluaran', value: totalExpense, color: '#f43f5e' }
  ], [totalIncome, totalExpense]);

  // 3. Expenses per Category Data
  const categoryData = useMemo(() => {
    const categoryMap = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + Number(t.amount);
      });

    return Object.keys(categoryMap)
      .map(cat => ({
        name: cat,
        shortName: cat.split(' ')[0],
        total: categoryMap[cat],
        percentage: totalExpense > 0 ? Math.round((categoryMap[cat] / totalExpense) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);
  }, [transactions, totalExpense]);

  const highestExpenseCategory = categoryData[0] || { name: 'Belum Ada', total: 0 };

  // 4. Monthly / Timeline Trend Data
  const monthlyTrendData = useMemo(() => {
    const dateMap = {};
    
    // Sort transactions chronologically
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    sorted.forEach(t => {
      // Group by Date string (or format YYYY-MM)
      const key = t.date;
      if (!dateMap[key]) {
        dateMap[key] = { date: key, pengeluaran: 0, pemasukan: 0 };
      }
      if (t.type === 'expense') {
        dateMap[key].pengeluaran += Number(t.amount);
      } else {
        dateMap[key].pemasukan += Number(t.amount);
      }
    });

    return Object.values(dateMap);
  }, [transactions]);

  // Average Expense Per Transaction
  const expenseCount = transactions.filter(t => t.type === 'expense').length;
  const avgExpense = expenseCount > 0 ? Math.round(totalExpense / expenseCount) : 0;

  // Category Bar Colors
  const CATEGORY_COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#64748b'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-cyan-500/40 p-3 rounded-2xl shadow-2xl backdrop-blur-xl text-xs">
          <p className="font-bold text-white mb-1.5">{payload[0]?.payload?.name || label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color || entry.fill }} className="font-semibold flex items-center justify-between gap-3">
              <span>{entry.name || 'Total'}:</span>
              <span>Rp {Number(entry.value).toLocaleString('id-ID')}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Top Header Banner */}
      <div className="cosmic-glass rounded-3xl p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Pusat Analisis Keuangan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-space text-white mt-1">
              Analisis Transaksi Real-time 📊
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Wawasan mendalam tentang pola pengeluaran, pemasukan, & alokasi anggaran kos kamu.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2.5 rounded-2xl border border-blue-500/30 text-xs font-semibold text-cyan-300">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>{transactions.length} Transaksi Teranalisis</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Pemasukan */}
        <div className="cosmic-glass cosmic-glass-hover rounded-3xl p-5 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Pemasukan</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold font-space text-emerald-400">
            Rp {totalIncome.toLocaleString('id-ID')}
          </h3>
          <span className="text-[11px] text-slate-500 mt-1 block">Dari uang saku & beasiswa</span>
        </div>

        {/* KPI 2: Total Pengeluaran */}
        <div className="cosmic-glass cosmic-glass-hover rounded-3xl p-5 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Total Pengeluaran</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold font-space text-rose-400">
            Rp {totalExpense.toLocaleString('id-ID')}
          </h3>
          <span className="text-[11px] text-slate-500 mt-1 block">Total pengeluaran tercatat</span>
        </div>

        {/* KPI 3: Kategori Terboros */}
        <div className="cosmic-glass cosmic-glass-hover rounded-3xl p-5 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Kategori Terbesar</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-base font-bold text-white truncate">
            {highestExpenseCategory.name}
          </h3>
          <span className="text-[11px] text-amber-400 font-semibold mt-1 block">
            Rp {highestExpenseCategory.total.toLocaleString('id-ID')}
          </span>
        </div>

        {/* KPI 4: Rata-Rata Pengeluaran */}
        <div className="cosmic-glass cosmic-glass-hover rounded-3xl p-5 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Rata-rata / Transaksi</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl font-bold font-space text-cyan-300">
            Rp {avgExpense.toLocaleString('id-ID')}
          </h3>
          <span className="text-[11px] text-slate-500 mt-1 block">Dari {expenseCount} pengeluaran</span>
        </div>

      </div>

      {/* Main Charts Section 1: Comparison Donut & Category Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART 1: DONUT CHART (PEMASUKAN VS PENGELUARAN) */}
        <div className="lg:col-span-5 cosmic-glass rounded-3xl p-6 border border-blue-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-space">Rasio Pemasukan vs Pengeluaran</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Perbandingan alokasi dana yang masuk dibanding dana terpakai.</p>
          </div>

          <div className="h-64 w-full relative">
            {totalIncome === 0 && totalExpense === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Belum ada transaksi.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeExpenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {incomeExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* CHART 2: BAR CHART (KATEGORI PENGELUARAN) */}
        <div className="lg:col-span-7 cosmic-glass rounded-3xl p-6 border border-blue-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-space">Pengeluaran per Kategori Mahasiswa</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">Peringkat kategori pengeluaran terbesar yang kamu lakukan.</p>
          </div>

          <div className="h-64 w-full">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Belum ada data pengeluaran per kategori.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="shortName" stroke="#94a3b8" fontSize={11} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Main Charts Section 2: Timeline Trend Area Chart */}
      <div className="cosmic-glass rounded-3xl p-6 border border-blue-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="text-lg font-bold text-white font-space">Tren Arus Kas Transaksi Real</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Grafik dinamika fluktuasi pemasukan & pengeluaran harian dari data asli.</p>
          </div>
        </div>

        <div className="h-72 w-full">
          {monthlyTrendData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Belum ada riwayat tanggal transaksi.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="trendExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="trendIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} formatter={(value) => <span className="text-xs text-slate-300">{value}</span>} />
                <Area type="monotone" dataKey="pemasukan" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#trendIncome)" name="Pemasukan (Rp)" />
                <Area type="monotone" dataKey="pengeluaran" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#trendExpense)" name="Pengeluaran (Rp)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </motion.div>
  );
}
