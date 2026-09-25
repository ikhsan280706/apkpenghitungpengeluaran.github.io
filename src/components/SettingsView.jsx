import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Moon,
  Database,
  Target,
  Check,
  Save,
  Trash2
} from 'lucide-react';

export default function SettingsView({ onResetAllData, showToast }) {
  const [studentName, setStudentName] = useState(() => localStorage.getItem('student_profile_name') || 'IKHSAN MAHASISWA');
  const [campusName, setCampusName] = useState(() => localStorage.getItem('student_campus') || 'Universitas Negeri Cyber');
  const [monthlyTarget, setMonthlyTarget] = useState(() => localStorage.getItem('student_monthly_budget') || '2000000');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem('student_profile_name', studentName);
    localStorage.setItem('student_campus', campusName);
    localStorage.setItem('student_monthly_budget', monthlyTarget);
    showToast('Pengaturan profil & anggaran berhasil disimpan!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Top Banner */}
      <div className="cosmic-glass rounded-3xl p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold font-space text-white">Pengaturan Aplikasi ⚙️</h2>
            <p className="text-xs sm:text-sm text-slate-400">Kelola profil mahasiswa, target anggaran bulanan, & penyimpanan data.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Settings */}
        <div className="cosmic-glass rounded-3xl p-6 border border-blue-500/20 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white font-space">Profil Mahasiswa</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Nama Pemilik Akun</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Nama Kampus / Universitas</label>
              <input
                type="text"
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Target Batas Budget Bulanan (Rp)</label>
              <input
                type="number"
                value={monthlyTarget}
                onChange={(e) => setMonthlyTarget(e.target.value)}
                className="w-full bg-slate-950 border border-blue-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil & Budget</span>
            </button>
          </form>
        </div>

        {/* System & Storage Preferences */}
        <div className="space-y-6">
          
          {/* Appearance & Theme */}
          <div className="cosmic-glass rounded-3xl p-6 border border-blue-500/20 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Moon className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-base text-white font-space">Tampilan & Mode</h3>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Space Dark Theme</h4>
                  <p className="text-[11px] text-slate-400">Latar belakang kosmik pekat & efek bintang kedip.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Aktif
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-cyan-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Notifikasi Toast Info</h4>
                  <p className="text-[11px] text-slate-400">Tampilkan pesan singkat saat transaksi diperbarui.</p>
                </div>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                  notificationsEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {notificationsEnabled ? 'Aktif' : 'Nonaktif'}
              </button>
            </div>
          </div>

          {/* LocalStorage Data Reset */}
          <div className="cosmic-glass rounded-3xl p-6 border border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Database className="w-5 h-5 text-rose-400" />
              <h3 className="font-bold text-base text-white font-space">Reset Memori localStorage</h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Jika ingin mengembalikan seluruh data dompet, transaksi, & favorit kos ke data awal sampel, gunakan tombol reset di bawah.
            </p>

            <button
              onClick={onResetAllData}
              className="w-full py-2.5 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 font-bold text-xs hover:bg-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Seluruh Data Aplikasi</span>
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
