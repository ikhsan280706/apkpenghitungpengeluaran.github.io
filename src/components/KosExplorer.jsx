import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Heart,
  MapPin,
  Star,
  Wifi,
  Wind,
  Bath,
  Check,
  Phone,
  Sparkles,
  X,
  Building2,
  Tag,
  DollarSign,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

const INITIAL_KOS_DATA = [
  {
    id: 'k1',
    name: 'Kos Astro Residence Cyber',
    type: 'Kos Putra',
    price: 850000,
    location: 'Dekat Gerbang Utama Kampus (300m)',
    rating: 4.9,
    reviews: 24,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
    facilities: ['Wi-Fi Cepat', 'AC', 'Kamar Mandi Dalam', 'Kasur Springbed', 'Dapur Bersama', 'Free Listrik'],
    contact: '081234567890',
    description: 'Kos khusus mahasiswa dengan fasilitas super lengkap, bebas banjir, dan akses internet wifey 100Mbps 24 jam.',
    isSample: true
  },
  {
    id: 'k2',
    name: 'Kos Mahasiswi Nebula Deluxe',
    type: 'Kos Putri',
    price: 1100000,
    location: '5 Menit dari Fakultas Teknik & MIPA',
    rating: 4.8,
    reviews: 18,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    facilities: ['Wi-Fi Cepat', 'AC', 'Kamar Mandi Dalam', 'CCTV 24 Jam', 'Parkir Motor', 'Mesin Cuci'],
    contact: '089876543210',
    description: 'Kos putri eksklusif lingkungan tenang dan aman dengan penjagaan keamanan CCTV 24 jam serta ruang belajar bersama.',
    isSample: true
  },
  {
    id: 'k3',
    name: 'Kos Hemat Student Hub',
    type: 'Kos Campur',
    price: 450000,
    location: 'Dekat Halte Bus Kampus & Stasiun',
    rating: 4.5,
    reviews: 31,
    image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
    facilities: ['Wi-Fi Cepat', 'Kamar Mandi Luar', 'Kasur Busa', 'Parkir Motor', 'Free Listrik'],
    contact: '081122334455',
    description: 'Kos ekonomis harga bersahabat untuk kantong mahasiswa baru. Lokasi sangat strategis dekat warung makan & warkop 24 jam.',
    isSample: true
  },
  {
    id: 'k4',
    name: 'Kos Executive Stellar Mansion',
    type: 'Kos Campur',
    price: 1500000,
    location: 'Area Pusat Kuliner & Minimarket 24 Jam',
    rating: 5.0,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
    facilities: ['Wi-Fi Cepat', 'AC', 'Kamar Mandi Dalam', 'Water Heater', 'Balkon Pribadi', 'Free Cleaning'],
    contact: '087788990011',
    description: 'Hunian kos mewah dengan desain interior modern minimalis, dilengkapi water heater hangat dan balkon santai.',
    isSample: true
  },
  {
    id: 'k5',
    name: 'Kos Asri Kampus Hijau',
    type: 'Kos Putri',
    price: 700000,
    location: 'Depan Perpustakaan Pusat Kampus',
    rating: 4.7,
    reviews: 15,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    facilities: ['Wi-Fi Cepat', 'Kipis / Ventilasi Sejuk', 'Kamar Mandi Dalam', 'Parkir Motor', 'Dapur Bersama'],
    contact: '085566778899',
    description: 'Kos putri tenang dan asri penuh tanaman hijau. Suasana sangat nyaman untuk mahasiswa yang sedang skripsi.',
    isSample: true
  }
];

export default function KosExplorer() {
  // Favorites stored in LocalStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('student_kos_favorites');
      return saved ? JSON.parse(saved) : ['k1']; // Default sample favorite
    } catch (e) {
      return ['k1'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('student_kos_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Gagal menyimpan favorit ke localStorage', e);
    }
  }, [favorites]);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all', 'Kos Putra', 'Kos Putri', 'Kos Campur'
  const [priceRange, setPriceRange] = useState('all'); // 'all', '<500k', '500k-1m', '1m-1.5m', '>1.5m'
  const [viewTab, setViewTab] = useState('all'); // 'all', 'favorites'
  const [selectedFacility, setSelectedFacility] = useState('all');

  // Selected Kos for Detail Modal
  const [selectedKosModal, setSelectedKosModal] = useState(null);

  // Toggle Favorite
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered Kos List
  const filteredKosList = useMemo(() => {
    return INITIAL_KOS_DATA.filter((kos) => {
      // 1. Search Query
      const matchesSearch =
        kos.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        kos.location.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Type
      const matchesType = selectedType === 'all' ? true : kos.type === selectedType;

      // 3. Price Range
      let matchesPrice = true;
      if (priceRange === '<500k') matchesPrice = kos.price < 500000;
      else if (priceRange === '500k-1m') matchesPrice = kos.price >= 500000 && kos.price <= 1000000;
      else if (priceRange === '1m-1.5m') matchesPrice = kos.price > 1000000 && kos.price <= 1500000;
      else if (priceRange === '>1.5m') matchesPrice = kos.price > 1500000;

      // 4. Facility
      const matchesFacility =
        selectedFacility === 'all' ? true : kos.facilities.includes(selectedFacility);

      // 5. Favorites Tab
      const matchesFavorites = viewTab === 'favorites' ? favorites.includes(kos.id) : true;

      return matchesSearch && matchesType && matchesPrice && matchesFacility && matchesFavorites;
    });
  }, [searchQuery, selectedType, priceRange, selectedFacility, viewTab, favorites]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Top Banner & Sample Badge */}
      <div className="cosmic-glass rounded-3xl p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Info className="w-3 h-3 text-cyan-400" />
                <span>Data Contoh</span>
              </span>
              <span className="text-xs text-slate-400">Direktori Kos Mahasiswa Kampus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-space text-white">
              Eksplorasi Kos Mahasiswa 🏠
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Cari kamar kos nyaman dekat kampus dengan filter harga, fasilitas, & tipe hunian.
            </p>
          </div>

          {/* View Tab Switcher: All Kos vs Favorites */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-blue-500/20 text-xs">
            <button
              onClick={() => setViewTab('all')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                viewTab === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua Kos ({INITIAL_KOS_DATA.length})
            </button>
            <button
              onClick={() => setViewTab('favorites')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                viewTab === 'favorites'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current text-rose-300" />
              <span>Favorit Saya ({favorites.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar Controls */}
      <div className="cosmic-glass rounded-3xl p-5 border border-blue-500/20 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kos / lokasi..."
              className="w-full bg-slate-950 border border-blue-500/20 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-blue-500/20 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Tipe (Putra / Putri / Campur)</option>
            <option value="Kos Putra">Kos Putra 👦</option>
            <option value="Kos Putri">Kos Putri 👧</option>
            <option value="Kos Campur">Kos Campur 👫</option>
          </select>

          {/* Price Range Filter */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="bg-slate-950 border border-blue-500/20 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Rentang Harga</option>
            <option value="<500k">&lt; Rp 500.000 / bln</option>
            <option value="500k-1m">Rp 500.000 - 1.000.000</option>
            <option value="1m-1.5m">Rp 1.000.000 - 1.500.000</option>
            <option value=">1.5m">&gt; Rp 1.500.000 / bln</option>
          </select>

          {/* Facility Filter */}
          <select
            value={selectedFacility}
            onChange={(e) => setSelectedFacility(e.target.value)}
            className="bg-slate-950 border border-blue-500/20 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Semua Fasilitas Utama</option>
            <option value="AC">Fasilitas AC ❄️</option>
            <option value="Kamar Mandi Dalam">Kamar Mandi Dalam 🚿</option>
            <option value="Free Listrik">Bebas Listrik ⚡</option>
            <option value="Parkir Motor">Parkir Motor 🛵</option>
          </select>

        </div>
      </div>

      {/* Kos Cards Grid */}
      {filteredKosList.length === 0 ? (
        <div className="cosmic-glass rounded-3xl p-12 text-center border border-dashed border-blue-500/20">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-300">Tidak ada hunian kos yang cocok</h4>
          <p className="text-xs text-slate-500 mt-1">Coba atur ulang kata kunci atau filter pencarian kamu.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('all');
              setPriceRange('all');
              setSelectedFacility('all');
              setViewTab('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold hover:bg-blue-600/30 transition-all"
          >
            Reset Filter Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredKosList.map((kos) => {
              const isFav = favorites.includes(kos.id);
              return (
                <motion.div
                  key={kos.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                  className="cosmic-glass cosmic-glass-hover rounded-3xl overflow-hidden border border-blue-500/20 flex flex-col justify-between relative group"
                >
                  {/* Image & Header Badges */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={kos.image}
                      alt={kos.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

                    {/* Sample Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                        Data Contoh
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-600/80 backdrop-blur-md text-[10px] font-bold text-white">
                        {kos.type}
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(kos.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all ${
                        isFav
                          ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                          : 'bg-black/40 text-slate-300 border-white/20 hover:text-rose-400'
                      }`}
                      title={isFav ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Price Tag Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] text-cyan-200 block uppercase font-medium">Harga Sewa</span>
                        <h4 className="text-xl font-extrabold font-space text-white tracking-tight">
                          Rp {kos.price.toLocaleString('id-ID')}
                          <span className="text-xs font-normal text-slate-300"> /bln</span>
                        </h4>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-black/60 px-2 py-1 rounded-lg backdrop-blur-md">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{kos.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-white font-space group-hover:text-cyan-300 transition-colors">
                        {kos.name}
                      </h3>
                      <div className="flex items-start gap-1.5 mt-1.5 text-xs text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{kos.location}</span>
                      </div>
                    </div>

                    {/* Facilities Preview */}
                    <div className="flex flex-wrap gap-1.5">
                      {kos.facilities.slice(0, 3).map((fac, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-900 border border-blue-500/20 text-slate-300 px-2 py-0.5 rounded-md font-medium"
                        >
                          {fac}
                        </span>
                      ))}
                      {kos.facilities.length > 3 && (
                        <span className="text-[10px] text-cyan-400 font-semibold">
                          +{kos.facilities.length - 3} lainnya
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => setSelectedKosModal(kos)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600/20 border border-blue-500/30 text-cyan-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Lihat Detail Kos</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: DETAIL KOS */}
      {/* ============================================================ */}
      <AnimatePresence>
        {selectedKosModal && (
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
              className="bg-slate-950 border border-cyan-500/30 rounded-3xl w-full max-w-lg p-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-y-auto max-h-[90vh]"
            >
              {/* Modal Header Image */}
              <div className="relative h-56 rounded-2xl overflow-hidden mb-4 bg-slate-900">
                <img
                  src={selectedKosModal.image}
                  alt={selectedKosModal.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedKosModal(null)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-slate-300 hover:text-white backdrop-blur-md"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-cyan-300 uppercase tracking-wider">
                    Data Contoh
                  </span>
                </div>
              </div>

              {/* Kos Title & Price */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-xl font-bold font-space text-white">{selectedKosModal.name}</h3>
                  <span className="text-xs text-cyan-400 font-semibold">{selectedKosModal.type}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Biaya per Bulan</span>
                  <h4 className="text-xl font-extrabold font-space text-cyan-300">
                    Rp {selectedKosModal.price.toLocaleString('id-ID')}
                  </h4>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-4 bg-slate-900 p-3 rounded-xl border border-blue-500/20">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{selectedKosModal.location}</span>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Deskripsi Kos</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedKosModal.description}</p>
              </div>

              {/* Facilities */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Fasilitas Lengkap</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedKosModal.facilities.map((fac, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs text-slate-200 bg-slate-900/80 border border-blue-500/20 p-2 rounded-xl"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => toggleFavorite(selectedKosModal.id)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                    favorites.includes(selectedKosModal.id)
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(selectedKosModal.id) ? 'fill-current' : ''}`} />
                  <span>{favorites.includes(selectedKosModal.id) ? 'Disimpan' : 'Favorit'}</span>
                </button>

                <a
                  href={`https://wa.me/${selectedKosModal.contact}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs text-center shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>Hubungi Pemilik Kos</span>
                </a>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
