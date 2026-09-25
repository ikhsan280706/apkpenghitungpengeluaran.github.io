import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag,
  PlusCircle,
  Search,
  Edit3,
  Trash2,
  Utensils,
  Bus,
  BookOpen,
  Home,
  Coffee,
  Zap,
  Wallet,
  Landmark,
  Smartphone,
  Banknote,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles
} from 'lucide-react';

export default function TransactionsView({
  transactions,
  wallets,
  categories,
  onOpenAddModal,
  onOpenEditModal,
  onConfirmDelete
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'expense', 'income'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(t => {
    const matchesTab = activeTab === 'all' ? true : t.type === activeTab;
    const matchesCategory = selectedCategory === 'all' ? true : t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Makanan & Minuman': return <Utensils className="w-4 h-4 text-amber-400" />;
      case 'Transportasi': return <Bus className="w-4 h-4 text-sky-400" />;
      case 'Kuliah & Buku': return <BookOpen className="w-4 h-4 text-purple-400" />;
      case 'Tempat Tinggal / Kos': return <Home className="w-4 h-4 text-indigo-400" />;
      case 'Hiburan & Gaya Hidup': return <Coffee className="w-4 h-4 text-pink-400" />;
      case 'Token & Listrik': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'Uang Saku / Beasiswa': return <Wallet className="w-4 h-4 text-emerald-400" />;
      default: return <Tag className="w-4 h-4 text-slate-400" />;
    }
  };

  const getWalletTypeIcon = (type) => {
    switch (type) {
      case 'Bank': return <Landmark className="w-4 h-4 text-cyan-400" />;
      case 'E-Wallet': return <Smartphone className="w-4 h-4 text-purple-400" />;
      case 'Cash': return <Banknote className="w-4 h-4 text-emerald-400" />;
      default: return <Wallet className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Top Banner */}
      <div className="cosmic-glass rounded-3xl p-6 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Manajemen Transaksi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-space text-white">
            Kelola Transaksi Mahasiswa 📝
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Daftar lengkap riwayat pengeluaran & pemasukan yang tersinkron otomatis ke dompet.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Transaksi Baru</span>
        </button>
      </div>

      {/* Filter Bar Controls */}
      <div className="cosmic-glass rounded-3xl p-5 border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau kategori..."
            className="w-full bg-slate-950 border border-blue-500/20 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-blue-500/20 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'all' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab('expense')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'expense' ? 'bg-rose-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pengeluaran
            </button>
            <button
              onClick={() => setActiveTab('income')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'income' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pemasukan
            </button>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-blue-500/20 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Transactions Table / Cards List */}
      <div className="cosmic-glass rounded-3xl p-6 border border-blue-500/20">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-blue-500/20 rounded-2xl p-6">
            <Tag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-slate-300">Tidak ada transaksi ditemukan</h4>
            <p className="text-xs text-slate-500 mt-1">Sesuaikan pencarian atau catat transaksi pengeluaran baru.</p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold hover:bg-blue-600/30 transition-all inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Catat Transaksi Baru
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTransactions.map((item) => {
                const linkedWallet = wallets.find(w => w.id === item.walletId);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    layout
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-blue-500/15 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                        item.type === 'income' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-slate-100">{item.name}</h5>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-[11px] text-cyan-300 bg-blue-950/80 border border-blue-500/30 px-2 py-0.5 rounded-md font-medium">
                            {item.category}
                          </span>
                          {linkedWallet && (
                            <span className="text-[11px] text-indigo-300 bg-indigo-950/80 border border-indigo-500/30 px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                              {getWalletTypeIcon(linkedWallet.type)}
                              {linkedWallet.name}
                            </span>
                          )}
                          <span className="text-xs text-slate-500">{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <div className="text-left sm:text-right">
                        <span className={`text-sm font-bold font-space block ${
                          item.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                        }`}>
                          {item.type === 'income' ? '+' : '-'}Rp {item.amount.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                          {item.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 pl-2 sm:border-l sm:border-slate-800">
                        <button
                          onClick={() => onOpenEditModal(item)}
                          className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                          title="Edit Transaksi"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onConfirmDelete(item.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
