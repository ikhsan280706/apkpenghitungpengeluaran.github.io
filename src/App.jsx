import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Bell,
  Search,
  Copy,
  Check,
  Sparkles,
  PieChart,
  Settings,
  ShieldCheck,
  Eye,
  EyeOff,
  Moon,
  Trash2,
  Edit3,
  X,
  Utensils,
  Bus,
  BookOpen,
  Home,
  Coffee,
  Zap,
  Tag,
  RotateCcw,
  PlusCircle,
  Menu,
  Rocket,
  Compass,
  Star,
  Layers,
  Landmark,
  Smartphone,
  Banknote,
  ArrowRightLeft,
  BarChart2,
  Receipt
} from 'lucide-react';
import Starfield from './components/Starfield';
import ExpenseCharts from './components/ExpenseCharts';
import AnalyticsView from './components/AnalyticsView';
import KosExplorer from './components/KosExplorer';
import TransactionsView from './components/TransactionsView';
import SettingsView from './components/SettingsView';

const INITIAL_WALLETS = [
  { id: 'w1', name: 'Dompet Utama (Cash)', type: 'Cash', initialBalance: 200000, accountNumber: 'Uang Saku Tunai', color: 'cyan' },
  { id: 'w2', name: 'Bank BCA', type: 'Bank', initialBalance: 1500000, accountNumber: '8830192841', color: 'blue' },
  { id: 'w3', name: 'ShopeePay / GoPay', type: 'E-Wallet', initialBalance: 300000, accountNumber: '0812-3456-7890', color: 'indigo' },
  { id: 'w4', name: 'Tabungan Darurat Kos', type: 'Tabungan', initialBalance: 500000, accountNumber: 'SIMPANAN', color: 'purple' },
];

const INITIAL_MOCK_DATA = [
  { id: 1, name: 'Bayar Sewa Kos Bulan Ini', category: 'Tempat Tinggal / Kos', amount: 850000, date: '2026-09-01', type: 'expense', walletId: 'w2' },
  { id: 2, name: 'Uang Saku Orang Tua', category: 'Uang Saku / Beasiswa', amount: 2500000, date: '2026-09-01', type: 'income', walletId: 'w2' },
  { id: 3, name: 'Nasi Padang & Es Teh Warkop', category: 'Makanan & Minuman', amount: 35000, date: '2026-09-24', type: 'expense', walletId: 'w1' },
  { id: 4, name: 'Beli Modul Kuliah & Fotokopi', category: 'Kuliah & Buku', amount: 120000, date: '2026-09-22', type: 'expense', walletId: 'w3' },
  { id: 5, name: 'Bensin Motor Seminggu', category: 'Transportasi', amount: 45000, date: '2026-09-20', type: 'expense', walletId: 'w1' },
  { id: 6, name: 'Token Listrik Kamar Kos', category: 'Token & Listrik', amount: 100000, date: '2026-09-18', type: 'expense', walletId: 'w3' },
];

const CATEGORIES = [
  'Makanan & Minuman',
  'Transportasi',
  'Kuliah & Buku',
  'Tempat Tinggal / Kos',
  'Hiburan & Gaya Hidup',
  'Token & Listrik',
  'Uang Saku / Beasiswa',
  'Lain-lain'
];

export default function App() {
  // Navigation Views: 'dashboard' | 'wallets' | 'analytics' | 'kos' | 'transactions' | 'settings'
  const [currentView, setCurrentView] = useState('dashboard');

  // 1. LocalStorage Integration for Wallets
  const [wallets, setWallets] = useState(() => {
    try {
      const saved = localStorage.getItem('student_wallets_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Gagal membaca wallets dari localStorage", e);
    }
    return INITIAL_WALLETS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('student_wallets_data', JSON.stringify(wallets));
    } catch (e) {
      console.error("Gagal menyimpan wallets ke localStorage", e);
    }
  }, [wallets]);

  // 2. LocalStorage Integration for Transactions
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('student_expenses_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Gagal membaca transactions dari localStorage", e);
    }
    return INITIAL_MOCK_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem('student_expenses_data', JSON.stringify(transactions));
    } catch (e) {
      console.error("Gagal menyimpan transactions ke localStorage", e);
    }
  }, [transactions]);

  // General UI States
  const [copied, setCopied] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'expense', 'income'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Transaction Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formType, setFormType] = useState('expense');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formWalletId, setFormWalletId] = useState(wallets[0]?.id || 'w1');

  // Wallet Modal States
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState(null);
  const [walletFormName, setWalletFormName] = useState('');
  const [walletFormType, setWalletFormType] = useState('Bank');
  const [walletFormBalance, setWalletFormBalance] = useState('');
  const [walletFormAccount, setWalletFormAccount] = useState('');
  const [walletFormColor, setWalletFormColor] = useState('cyan');

  // Transfer Modal States
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferFromId, setTransferFromId] = useState(wallets[0]?.id || 'w1');
  const [transferToId, setTransferToId] = useState(wallets[1]?.id || 'w2');
  const [transferAmount, setTransferAmount] = useState('');

  // Delete Confirmations
  const [deletingId, setDeletingId] = useState(null);
  const [deletingWalletId, setDeletingWalletId] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyCardNumber = () => {
    navigator.clipboard.writeText('4532 8921 3410 4289');
    setCopied(true);
    showToast('Nomor Kartu berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  // -------------------------------------------------------------
  // DYNAMIC WALLET BALANCES & SYNCHRONIZATION
  // -------------------------------------------------------------
  const getWalletCurrentBalance = (walletId, initialBal) => {
    const incomeSum = transactions
      .filter(t => t.walletId === walletId && t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenseSum = transactions
      .filter(t => t.walletId === walletId && t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return Number(initialBal) + incomeSum - expenseSum;
  };

  const totalWalletsBalance = wallets.reduce((acc, w) => {
    return acc + getWalletCurrentBalance(w.id, w.initialBalance);
  }, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  // -------------------------------------------------------------
  // TRANSACTION CRUD HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormName('');
    setFormAmount('');
    setFormCategory('Makanan & Minuman');
    setFormType('expense');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormWalletId(wallets[0]?.id || 'w1');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setFormName(item.name);
    setFormAmount(item.amount.toString());
    setFormCategory(item.category);
    setFormType(item.type);
    setFormDate(item.date);
    setFormWalletId(item.walletId || wallets[0]?.id || 'w1');
    setIsModalOpen(true);
  };

  const handleSaveTransaction = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Nama transaksi tidak boleh kosong!');
      return;
    }
    const numAmount = parseFloat(formAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Jumlah uang harus angka positif!');
      return;
    }

    if (editingId !== null) {
      setTransactions(prev => prev.map(t => t.id === editingId ? {
        ...t,
        name: formName.trim(),
        amount: numAmount,
        category: formCategory,
        type: formType,
        date: formDate,
        walletId: formWalletId
      } : t));
      showToast('Transaksi berhasil diperbarui dan grafik diperbarui!');
    } else {
      const newTransaction = {
        id: Date.now(),
        name: formName.trim(),
        amount: numAmount,
        category: formCategory,
        type: formType,
        date: formDate,
        walletId: formWalletId
      };
      setTransactions(prev => [newTransaction, ...prev]);
      showToast('Transaksi baru berhasil dicatat!');
    }

    setIsModalOpen(false);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setDeletingId(null);
    showToast('Transaksi berhasil dihapus.');
  };

  // -------------------------------------------------------------
  // WALLET CRUD HANDLERS
  // -------------------------------------------------------------
  const handleOpenAddWalletModal = () => {
    setEditingWalletId(null);
    setWalletFormName('');
    setWalletFormType('Bank');
    setWalletFormBalance('');
    setWalletFormAccount('');
    setWalletFormColor('cyan');
    setIsWalletModalOpen(true);
  };

  const handleOpenEditWalletModal = (w) => {
    setEditingWalletId(w.id);
    setWalletFormName(w.name);
    setWalletFormType(w.type);
    setWalletFormBalance(w.initialBalance.toString());
    setWalletFormAccount(w.accountNumber || '');
    setWalletFormColor(w.color || 'cyan');
    setIsWalletModalOpen(true);
  };

  const handleSaveWallet = (e) => {
    e.preventDefault();
    if (!walletFormName.trim()) {
      showToast('Nama dompet wajib diisi!');
      return;
    }
    const initBal = parseFloat(walletFormBalance) || 0;

    if (editingWalletId) {
      setWallets(prev => prev.map(w => w.id === editingWalletId ? {
        ...w,
        name: walletFormName.trim(),
        type: walletFormType,
        initialBalance: initBal,
        accountNumber: walletFormAccount.trim(),
        color: walletFormColor
      } : w));
      showToast('Dompet berhasil diperbarui!');
    } else {
      const newWallet = {
        id: `w_${Date.now()}`,
        name: walletFormName.trim(),
        type: walletFormType,
        initialBalance: initBal,
        accountNumber: walletFormAccount.trim(),
        color: walletFormColor
      };
      setWallets(prev => [...prev, newWallet]);
      showToast('Dompet baru berhasil ditambahkan!');
    }

    setIsWalletModalOpen(false);
  };

  const handleDeleteWallet = (wId) => {
    if (wallets.length <= 1) {
      showToast('Minimal harus ada 1 dompet di simpanan!');
      setDeletingWalletId(null);
      return;
    }
    setWallets(prev => prev.filter(w => w.id !== wId));
    const fallbackId = wallets.find(w => w.id !== wId)?.id || 'w1';
    setTransactions(prev => prev.map(t => t.walletId === wId ? { ...t, walletId: fallbackId } : t));
    setDeletingWalletId(null);
    showToast('Dompet berhasil dihapus!');
  };

  // Transfer Between Wallets
  const handleTransferFunds = (e) => {
    e.preventDefault();
    if (transferFromId === transferToId) {
      showToast('Dompet sumber dan dompet tujuan tidak boleh sama!');
      return;
    }
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast('Jumlah transfer harus positif!');
      return;
    }

    const fromWallet = wallets.find(w => w.id === transferFromId);
    const toWallet = wallets.find(w => w.id === transferToId);

    const dateNow = new Date().toISOString().split('T')[0];
    const transferOut = {
      id: Date.now(),
      name: `Transfer ke ${toWallet?.name || 'Dompet'}`,
      category: 'Lain-lain',
      amount: amt,
      date: dateNow,
      type: 'expense',
      walletId: transferFromId
    };
    const transferIn = {
      id: Date.now() + 1,
      name: `Transfer dari ${fromWallet?.name || 'Dompet'}`,
      category: 'Uang Saku / Beasiswa',
      amount: amt,
      date: dateNow,
      type: 'income',
      walletId: transferToId
    };

    setTransactions(prev => [transferOut, transferIn, ...prev]);
    setIsTransferModalOpen(false);
    setTransferAmount('');
    showToast(`Berhasil transfer Rp ${amt.toLocaleString('id-ID')}!`);
  };

  // Reset Data to Initial
  const handleResetData = () => {
    setWallets(INITIAL_WALLETS);
    setTransactions(INITIAL_MOCK_DATA);
    localStorage.removeItem('student_kos_favorites');
    showToast('Semua dompet, transaksi, & favorit dikembalikan ke sampel kos awal.');
  };

  // Filtered Transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesTab = activeTab === 'all' ? true : t.type === activeTab;
    const matchesCategory = selectedCategory === 'all' ? true : t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesCategory && matchesSearch;
  });

  // Icon Resolvers
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
    <div className="min-h-screen bg-[#02040a] text-slate-100 font-sans flex flex-col md:flex-row selection:bg-blue-600 selection:text-white relative pb-16 md:pb-0">
      
      {/* Background Starfield Animated Particles */}
      <Starfield />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-5 right-5 z-50 bg-slate-950/90 border border-cyan-500/50 text-cyan-200 px-4 py-3 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center gap-3 backdrop-blur-xl text-xs sm:text-sm"
          >
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 animate-spin" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950/80 border-b border-blue-500/20 backdrop-blur-xl relative z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base font-space bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
            AstroStudent 🚀
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-blue-500/30 text-slate-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-950/90 border-r border-blue-500/20 p-5 flex flex-col justify-between shrink-0 backdrop-blur-2xl transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="hidden md:flex items-center gap-3 mb-8 px-2">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/40"
            >
              <Rocket className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="font-bold text-lg font-space leading-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
                AstroStudent 🚀
              </h1>
              <span className="text-[11px] text-cyan-400 font-medium tracking-wide">COSMIC EXPENSE LAB</span>
            </div>
          </div>

          {/* 6 MAIN NAVIGATION ITEMS */}
          <nav className="space-y-1.5 mt-4 md:mt-0">
            {/* 1. Dashboard */}
            <button
              onClick={() => { setCurrentView('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                currentView === 'dashboard'
                  ? 'bg-blue-600/15 text-cyan-300 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span>Cosmic Dashboard</span>
            </button>

            {/* 2. Dompet Mahasiswa */}
            <button
              onClick={() => { setCurrentView('wallets'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                currentView === 'wallets'
                  ? 'bg-blue-600/15 text-cyan-300 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-4 h-4 text-cyan-400" />
                <span>Dompet Mahasiswa</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 font-bold">
                {wallets.length}
              </span>
            </button>

            {/* 3. Analisis Keuangan */}
            <button
              onClick={() => { setCurrentView('analytics'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                currentView === 'analytics'
                  ? 'bg-blue-600/15 text-cyan-300 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <span>Analisis Keuangan</span>
            </button>

            {/* 4. Eksplorasi Kos */}
            <button
              onClick={() => { setCurrentView('kos'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                currentView === 'kos'
                  ? 'bg-blue-600/15 text-cyan-300 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Eksplorasi Kos</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold uppercase">
                Contoh
              </span>
            </button>

            {/* 5. Kelola Transaksi */}
            <button
              onClick={() => { setCurrentView('transactions'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                currentView === 'transactions'
                  ? 'bg-blue-600/15 text-cyan-300 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4 text-cyan-400" />
                <span>Kelola Transaksi</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-blue-400/30 font-bold">
                {transactions.length}
              </span>
            </button>

            {/* 6. Pengaturan */}
            <button
              onClick={() => { setCurrentView('settings'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                currentView === 'settings'
                  ? 'bg-blue-600/15 text-cyan-300 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
              }`}
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>Pengaturan</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Storage Info */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/60 border border-blue-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2 text-xs font-semibold text-cyan-400">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>Space Storage</span>
            </div>
            <button
              onClick={handleResetData}
              className="text-[11px] text-slate-400 hover:text-rose-400 underline flex items-center gap-0.5"
              title="Reset Data ke Sample"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          <p className="text-[11px] text-slate-400">Tersimpan otomatis di localStorage browser.</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative z-10">
        
        {/* Top Header Bar */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-space text-white tracking-tight flex items-center gap-2">
              {currentView === 'dashboard' && 'Dashboard Mahasiswa'}
              {currentView === 'wallets' && 'Dompet & Rekening Mahasiswa'}
              {currentView === 'analytics' && 'Halaman Analisis Keuangan'}
              {currentView === 'kos' && 'Direktori Eksplorasi Kos'}
              {currentView === 'transactions' && 'Manajemen Transaksi Kos'}
              {currentView === 'settings' && 'Pengaturan Aplikasi'}
              <Sparkles className="w-5 h-5 text-cyan-400 inline" />
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              {currentView === 'dashboard' && 'Kelola sisa uang saku, biaya kos, & pengeluaran secara tersinkronisasi.'}
              {currentView === 'wallets' && 'Kelola berbagai akun dompet tunai, bank, & e-wallet kamu.'}
              {currentView === 'analytics' && 'Visualisasi lengkap grafik pemasukan, pengeluaran, kategori, & tren dari transaksi asli.'}
              {currentView === 'kos' && 'Cari dan simpan kos impian dekat kampus (dilengkapi label Data Contoh).'}
              {currentView === 'transactions' && 'Daftar tabel lengkap transaksi pengeluaran dan pemasukan.'}
              {currentView === 'settings' && 'Kelola akun profil mahasiswa, batas budget, & reset data.'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentView === 'dashboard' && (
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari transaksi kos..."
                  className="w-full bg-slate-950/80 border border-blue-500/20 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all backdrop-blur-md"
                />
              </div>
            )}

            {currentView === 'wallets' && (
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsTransferModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  <span>Transfer Uang</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenAddWalletModal}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 shrink-0 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tambah Dompet</span>
                </motion.button>
              </div>
            )}

            {(currentView === 'dashboard' || currentView === 'analytics' || currentView === 'transactions') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenAddModal}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 shrink-0 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Tambah Transaksi</span>
              </motion.button>
            )}
          </div>
        </motion.header>

        {/* VIEW 1: MAIN DASHBOARD */}
        {currentView === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              
              {/* MAIN FEATURE: THE BLUE COSMIC CARD */}
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative group overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] border border-cyan-400/40 cosmic-blue-card transition-all duration-300"
                >
                  <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl group-hover:bg-cyan-400/35 transition-all pointer-events-none"></div>

                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide uppercase text-cyan-100 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Total Uang Tersinkron (All Wallets)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white transition-all"
                      title="Sembunyikan / Tampilkan Sisa Uang"
                    >
                      {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="mb-6 relative z-10">
                    <span className="text-xs font-medium text-cyan-200 uppercase tracking-wider block mb-1">
                      Sisa Total Saldo Dompet Mahasiswa
                    </span>
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-3xl sm:text-4xl font-extrabold font-space tracking-tight">
                        {showBalance ? `Rp ${totalWalletsBalance.toLocaleString('id-ID')}` : '••••••••••••'}
                      </h3>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border ${
                        totalWalletsBalance >= 0 
                          ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' 
                          : 'bg-rose-500/20 border-rose-400/30 text-rose-300'
                      }`}>
                        {totalWalletsBalance >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {totalWalletsBalance >= 0 ? 'Surplus' : 'Defisit!'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10 pt-4 border-t border-white/15">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-200 border border-yellow-200/50 shadow-inner flex items-center justify-center">
                          <div className="w-6 h-4 border border-amber-600/40 rounded-sm"></div>
                        </div>
                        <span className="font-mono text-sm tracking-wider text-blue-100">
                          •••• •••• •••• 4289
                        </span>
                        <button
                          onClick={handleCopyCardNumber}
                          className="p-1 rounded hover:bg-white/15 text-blue-200 hover:text-white transition-all"
                          title="Salin Nomor Kartu"
                        >
                          {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="text-xs text-cyan-200">
                        Terhubung: <span className="font-semibold text-white">{wallets.length} Dompet Aktif</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentView('wallets')}
                        className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <Wallet className="w-3.5 h-3.5 text-cyan-300" />
                        <span>Kelola Dompet</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleOpenAddModal}
                        className="px-4 py-2.5 rounded-xl bg-white text-blue-950 hover:bg-cyan-50 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-1.5"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-blue-700" />
                        <span>Catat Transaksi</span>
                      </motion.button>
                    </div>
                  </div>

                </motion.div>
              </div>

              {/* Quick Metrics Cards */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                
                {/* Total Expense Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="cosmic-glass cosmic-glass-hover rounded-3xl p-5 border border-blue-500/20 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                      <TrendingDown className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium block">Total Pengeluaran Mahasiswa</span>
                      <h4 className="text-xl font-bold font-space text-rose-400 mt-0.5">
                        Rp {totalExpense.toLocaleString('id-ID')}
                      </h4>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {transactions.filter(t => t.type === 'expense').length} catatan pengeluaran
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Total Income Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="cosmic-glass cosmic-glass-hover rounded-3xl p-5 border border-blue-500/20 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium block">Total Pemasukan / Uang Saku</span>
                      <h4 className="text-xl font-bold font-space text-emerald-400 mt-0.5">
                        Rp {totalIncome.toLocaleString('id-ID')}
                      </h4>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        {transactions.filter(t => t.type === 'income').length} masukan saldo
                      </span>
                    </div>
                  </div>
                </motion.div>

              </div>

            </div>

            {/* Quick Chart Component */}
            <div id="charts">
              <ExpenseCharts transactions={transactions} />
            </div>

            {/* Recent Transactions Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="cosmic-glass rounded-3xl p-6 border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.1)]"
            >
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-space">Transaksi Terbaru</h3>
                  <p className="text-xs text-slate-400">Ringkasan aktivitas keuangan kos terbaru kamu.</p>
                </div>
                <button
                  onClick={() => setCurrentView('transactions')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-blue-500/30 text-cyan-300 font-bold text-xs hover:bg-slate-800 transition-all"
                >
                  Lihat Semua ({transactions.length})
                </button>
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-blue-500/20 rounded-2xl p-4">
                  <p className="text-xs text-slate-500">Belum ada catatan transaksi.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.slice(0, 4).map((item) => {
                    const linkedWallet = wallets.find(w => w.id === item.walletId);
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-blue-500/15 hover:border-cyan-500/40 transition-all gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            item.type === 'income' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold text-slate-100">{item.name}</h5>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-cyan-300 bg-blue-950/80 border border-blue-500/30 px-2 py-0.5 rounded-md font-medium">
                                {item.category}
                              </span>
                              <span className="text-[10px] text-slate-500">{item.date}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className={`text-xs font-bold font-space block ${
                            item.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                          }`}>
                            {item.type === 'income' ? '+' : '-'}Rp {item.amount.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {linkedWallet?.name || 'Dompet'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* VIEW 2: DOMPET MAHASISWA */}
        {currentView === 'wallets' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="cosmic-glass rounded-3xl p-6 border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="text-xs text-cyan-400 font-semibold tracking-wider uppercase block mb-1">
                  Ringkasan Dompet Mahasiswa
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-space text-white">
                  Rp {totalWalletsBalance.toLocaleString('id-ID')}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Total akumulasi saldo dari {wallets.length} dompet tersimpan & terhitung otomatis.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsTransferModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Transfer Antar Dompet</span>
                </button>
                <button
                  onClick={handleOpenAddWalletModal}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Tambah Dompet Baru</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {wallets.map((w) => {
                  const currBal = getWalletCurrentBalance(w.id, w.initialBalance);
                  const linkedTxCount = transactions.filter(t => t.walletId === w.id).length;

                  return (
                    <motion.div
                      key={w.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                      className="cosmic-glass cosmic-glass-hover rounded-3xl p-6 border border-blue-500/20 relative group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all"></div>

                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-300 shadow-inner">
                            {getWalletTypeIcon(w.type)}
                          </div>
                          <div>
                            <h4 className="font-bold text-base text-white">{w.name}</h4>
                            <span className="text-[11px] text-cyan-400 font-semibold">{w.type}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditWalletModal(w)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all"
                            title="Edit Dompet"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingWalletId(w.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-all"
                            title="Hapus Dompet"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mb-4 relative z-10">
                        <span className="text-xs text-slate-400 block mb-0.5">Saldo Tersedia Saat Ini</span>
                        <h3 className={`text-2xl font-extrabold font-space ${currBal >= 0 ? 'text-white' : 'text-rose-400'}`}>
                          Rp {currBal.toLocaleString('id-ID')}
                        </h3>
                      </div>

                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 relative z-10">
                        <span>{w.accountNumber || 'Nomor Akun N/A'}</span>
                        <span className="text-[11px] text-cyan-400 font-medium">
                          {linkedTxCount} transaksi sinkron
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: ANALISIS KEUANGAN */}
        {currentView === 'analytics' && (
          <AnalyticsView transactions={transactions} />
        )}

        {/* VIEW 4: EKSPLORASI KOS MAHASISWA */}
        {currentView === 'kos' && (
          <KosExplorer />
        )}

        {/* VIEW 5: KELOLA TRANSAKSI */}
        {currentView === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            wallets={wallets}
            categories={CATEGORIES}
            onOpenAddModal={handleOpenAddModal}
            onOpenEditModal={handleOpenEditModal}
            onConfirmDelete={(id) => setDeletingId(id)}
          />
        )}

        {/* VIEW 6: PENGATURAN APLIKASI */}
        {currentView === 'settings' && (
          <SettingsView
            onResetAllData={handleResetData}
            showToast={showToast}
          />
        )}

      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR FOR EXCELLENT MOBILE UX */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-slate-950/95 border-t border-blue-500/20 backdrop-blur-2xl z-40 px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            currentView === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => setCurrentView('wallets')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            currentView === 'wallets' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">Dompet</span>
        </button>

        <button
          onClick={() => setCurrentView('analytics')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            currentView === 'analytics' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px]">Analisis</span>
        </button>

        <button
          onClick={() => setCurrentView('kos')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            currentView === 'kos' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Kos</span>
        </button>

        <button
          onClick={() => setCurrentView('transactions')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            currentView === 'transactions' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Receipt className="w-5 h-5" />
          <span className="text-[10px]">Transaksi</span>
        </button>

        <button
          onClick={() => setCurrentView('settings')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-all ${
            currentView === 'settings' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px]">Setting</span>
        </button>
      </div>

      {/* MODAL: ADD / EDIT TRANSACTION */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-950 border border-cyan-500/30 rounded-3xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)]"
            >
              <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-space flex items-center gap-2">
                  {editingId ? <Edit3 className="w-5 h-5 text-cyan-400" /> : <PlusCircle className="w-5 h-5 text-cyan-400" />}
                  {editingId ? 'Edit Transaksi Mahasiswa' : 'Tambah Transaksi Baru'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTransaction} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Jenis Transaksi</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-xl border border-blue-500/20">
                    <button
                      type="button"
                      onClick={() => setFormType('expense')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        formType === 'expense' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" /> Pengeluaran
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType('income')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                        formType === 'income' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" /> Pemasukan
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-cyan-400 block mb-1.5">Pilih Dompet (Tersinkron)</label>
                  <select
                    value={formWalletId}
                    onChange={(e) => setFormWalletId(e.target.value)}
                    className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 transition-all"
                  >
                    {wallets.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.type}) - Rp {getWalletCurrentBalance(w.id, w.initialBalance).toLocaleString('id-ID')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Nama Transaksi</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Makan Siang Nasi Goreng"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-900 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Jumlah Uang (Rp)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Contoh: 35000"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Kategori Mahasiswa</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
                  >
                    {CATEGORIES.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Tanggal Transaksi</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-900 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  >
                    {editingId ? 'Simpan Perubahan' : 'Catat Transaksi'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT WALLET */}
      <AnimatePresence>
        {isWalletModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-950 border border-cyan-500/30 rounded-3xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)]"
            >
              <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-space flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-cyan-400" />
                  {editingWalletId ? 'Edit Dompet Mahasiswa' : 'Tambah Dompet Baru'}
                </h3>
                <button
                  onClick={() => setIsWalletModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveWallet} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Nama Dompet / Akun</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bank BCA / GoPay Utama"
                    value={walletFormName}
                    onChange={(e) => setWalletFormName(e.target.value)}
                    className="w-full bg-slate-900 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Tipe Dompet</label>
                  <select
                    value={walletFormType}
                    onChange={(e) => setWalletFormType(e.target.value)}
                    className="w-full bg-slate-900 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
                  >
                    <option value="Bank">Bank (BCA, Mandiri, BRI, DLL)</option>
                    <option value="E-Wallet">E-Wallet (ShopeePay, GoPay, OVO, DANA)</option>
                    <option value="Cash">Cash (Uang Tunai)</option>
                    <option value="Tabungan">Tabungan Darurat</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Saldo Awal (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 500000"
                    value={walletFormBalance}
                    onChange={(e) => setWalletFormBalance(e.target.value)}
                    className="w-full bg-slate-900 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Nomor Rekening / HP (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: 0812-3456-7890"
                    value={walletFormAccount}
                    onChange={(e) => setWalletFormAccount(e.target.value)}
                    className="w-full bg-slate-900 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsWalletModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  >
                    {editingWalletId ? 'Simpan Perubahan' : 'Simpan Dompet'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: TRANSFER BETWEEN WALLETS */}
      <AnimatePresence>
        {isTransferModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-950 border border-cyan-500/30 rounded-3xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)]"
            >
              <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white font-space flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
                  Transfer Antar Dompet
                </h3>
                <button
                  onClick={() => setIsTransferModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleTransferFunds} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Dari Dompet (Sumber)</label>
                  <select
                    value={transferFromId}
                    onChange={(e) => setTransferFromId(e.target.value)}
                    className="w-full bg-slate-900 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
                  >
                    {wallets.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} (Saldo: Rp {getWalletCurrentBalance(w.id, w.initialBalance).toLocaleString('id-ID')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Ke Dompet (Tujuan)</label>
                  <select
                    value={transferToId}
                    onChange={(e) => setTransferToId(e.target.value)}
                    className="w-full bg-slate-900 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-all"
                  >
                    {wallets.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name} (Saldo: Rp {getWalletCurrentBalance(w.id, w.initialBalance).toLocaleString('id-ID')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">Jumlah Transfer (Rp)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Contoh: 100000"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsTransferModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  >
                    Kirim Transfer
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: DELETE TRANSACTION CONFIRMATION */}
      <AnimatePresence>
        {deletingId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-950 border border-rose-500/30 rounded-3xl w-full max-w-sm p-6 shadow-[0_0_40px_rgba(244,63,94,0.25)] text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-1 font-space">Hapus Catatan Ini?</h4>
              <p className="text-xs text-slate-400 mb-6">Tindakan ini akan menghapus transaksi dari localStorage & memulihkan saldo dompet.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteTransaction(deletingId)}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: DELETE WALLET CONFIRMATION */}
      <AnimatePresence>
        {deletingWalletId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-950 border border-rose-500/30 rounded-3xl w-full max-w-sm p-6 shadow-[0_0_40px_rgba(244,63,94,0.25)] text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-1 font-space">Hapus Dompet Ini?</h4>
              <p className="text-xs text-slate-400 mb-6">Transaksi terkait akan dialihkan secara otomatis ke dompet utama.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeletingWalletId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={() => handleDeleteWallet(deletingWalletId)}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
