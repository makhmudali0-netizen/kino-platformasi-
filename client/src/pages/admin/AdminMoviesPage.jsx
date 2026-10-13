import React, { useState, useEffect, useRef } from 'react';
import { apiFetch } from '../../utils/api';
import { useNotification } from '../../context/NotificationContext';
import { 
  Film, Plus, Search, Trash2, Edit3, Star, 
  CheckCircle2, Clock, X, Eye, Sparkles, TrendingUp, ExternalLink,
  FolderUp, Smartphone, Monitor, Image, FileVideo, Upload, Check
} from 'lucide-react';

const PRESET_MOVIES = [
  {
    name: 'Interstellar (4K)',
    title: 'Yulduzlararo Sayohat (Interstellar)',
    originalTitle: 'Interstellar',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    genre: 'Fantastika, Drama, Sarguzasht',
    category: 'Mashhur kinolar',
    year: '2014',
    duration: '2 soat 49 daqiqa',
    quality: '4K Ultra HD',
    ageLimit: '12+',
    director: 'Kristofer Nolan',
    actors: 'Metyu Makkonaxi, Enn Xeteuey, Jessika Chesteyn',
    language: 'O‘zbekcha (Professional dublyaj)',
    description: 'Insoniyat kelajagi xavf ostida qolganda, bir guruh jasur fazogirlar yangi yashash sayyorasini topish maqsadida koinot tubiga yo‘l oladilar.'
  },
  {
    name: 'Gladiator 2 (4K)',
    title: 'Gladiator II',
    originalTitle: 'Gladiator II',
    poster: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    genre: 'Jangari, Tarixiy, Drama',
    category: 'Yangi kinolar',
    year: '2024',
    duration: '2 soat 28 daqiqa',
    quality: '4K Ultra HD',
    ageLimit: '16+',
    director: 'Ridli Skott',
    actors: 'Pol Meskal, Pedro Paskal, Denzel Vashington',
    language: 'O‘zbekcha (Dublyaj)',
    description: 'Maksimus jasoratidan ilhomlangan yosh qahramon Rim imperiyasining zolim hukmdorlariga qarshi Kolizey arenasida kurash olib boradi.'
  },
  {
    name: 'Sintel (Open Film)',
    title: 'Sintel: Ajdaho Sarguzashti',
    originalTitle: 'Sintel',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    genre: 'Fantastika, Animatsiya, Sarguzasht',
    category: 'Multfilm',
    year: '2023',
    duration: '52 daqiqa',
    quality: '1080p Full HD',
    ageLimit: '6+',
    director: 'Kolin Levi',
    actors: 'Halina Reijn, Tom Hoffman',
    language: 'O‘zbekcha',
    description: 'Yosh qizaloq o‘zining kichik do‘sti — ajdarho bolasini topish uchun xatarli dunyo bo‘ylab sayohatga chiqadi.'
  }
];

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [isBoostOpen, setIsBoostOpen] = useState(false);
  const [boostMovie, setBoostMovie] = useState(null);
  const [boostViews, setBoostViews] = useState('');
  const [boostRating, setBoostRating] = useState('5.0');

  // Video and Poster upload states
  const [videoSourceMode, setVideoSourceMode] = useState('file'); // 'file' | 'url'
  const [posterSourceMode, setPosterSourceMode] = useState('preset'); // 'preset' | 'file' | 'url'
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [uploadedVideoName, setUploadedVideoName] = useState('');
  const [isUploadingPoster, setIsUploadingPoster] = useState(false);
  const [posterUploadProgress, setPosterUploadProgress] = useState(0);

  const videoFileInputRef = useRef(null);
  const posterFileInputRef = useRef(null);

  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    title: '',
    originalTitle: '',
    description: '',
    poster: '',
    backdrop: '',
    videoUrl: '',
    trailerUrl: '',
    genre: 'Jangari, Drama',
    category: 'Yangi kinolar',
    year: '2024',
    duration: '2 soat 10 daqiqa',
    quality: '4K Ultra HD',
    ageLimit: '16+',
    director: '',
    actors: '',
    language: 'O‘zbekcha',
    isFeatured: 0
  });

  useEffect(() => {
    loadMovies();
  }, [status, search]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/admin/movies?status=${status}&search=${encodeURIComponent(search)}`);
      setMovies(data || []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingMovie(null);
    setUploadedVideoName('');
    setVideoUploadProgress(0);
    setVideoSourceMode('file');
    setFormData({
      title: '',
      originalTitle: '',
      description: '',
      poster: '',
      backdrop: '',
      videoUrl: '',
      trailerUrl: '',
      genre: 'Jangari, Drama',
      category: 'Yangi kinolar',
      year: '2024',
      duration: '2 soat 10 daqiqa',
      quality: '4K Ultra HD',
      ageLimit: '16+',
      director: '',
      actors: '',
      language: 'O‘zbekcha',
      isFeatured: 0
    });
    setIsModalOpen(true);
  };

  const handleApplyPreset = (preset) => {
    setFormData({
      ...formData,
      ...preset
    });
    setVideoSourceMode('url');
    showToast(`"${preset.name}" shabloni to‘ldirildi!`, 'info');
  };

  // Upload video file directly from device (computer files or phone gallery)
  const handleVideoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedVideoName(file.name);
    // If title is empty, deduce clean title from file name
    if (!formData.title) {
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setFormData(prev => ({ ...prev, title: cleanTitle }));
    }

    setIsUploadingVideo(true);
    setVideoUploadProgress(15);

    try {
      const uploadData = new FormData();
      uploadData.append('video', file);

      const token = localStorage.getItem('kinoverse_token');
      const adminPin = localStorage.getItem('kinoverse_admin_pin');
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(adminPin ? { 'x-admin-pin': adminPin } : {})
      };

      setVideoUploadProgress(45);
      const res = await fetch('/api/upload/file', {
        method: 'POST',
        headers,
        body: uploadData
      });
      const data = await res.json();
      setVideoUploadProgress(100);

      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, videoUrl: data.url }));
        showToast(`"${file.name}" qurilmadan muvaffaqiyatli yuklandi!`, 'success');
      } else {
        throw new Error(data.error || 'Video yuklashda xatolik yuz berdi');
      }
    } catch (err) {
      showToast(err.message || 'Faylni yuklashda xatolik', 'error');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Upload poster image directly from device (computer files or phone gallery)
  const handlePosterFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPoster(true);
    setPosterUploadProgress(30);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const token = localStorage.getItem('kinoverse_token');
      const adminPin = localStorage.getItem('kinoverse_admin_pin');
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(adminPin ? { 'x-admin-pin': adminPin } : {})
      };

      setPosterUploadProgress(60);
      const res = await fetch('/api/upload/file', {
        method: 'POST',
        headers,
        body: uploadData
      });
      const data = await res.json();
      setPosterUploadProgress(100);

      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, poster: data.url, backdrop: data.url }));
        showToast(`Muqova rasmi yuklandi!`, 'success');
      } else {
        throw new Error(data.error || 'Rasm yuklashda xatolik');
      }
    } catch (err) {
      showToast(err.message || 'Rasm yuklashda xatolik', 'error');
    } finally {
      setIsUploadingPoster(false);
    }
  };

  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    setUploadedVideoName(movie.videoUrl ? movie.videoUrl.split('/').pop() : '');
    setVideoSourceMode(movie.videoUrl?.startsWith('/uploads/') ? 'file' : 'url');
    setPosterSourceMode(movie.poster?.startsWith('/uploads/') ? 'file' : 'url');
    setFormData({
      title: movie.title,
      originalTitle: movie.originalTitle || '',
      description: movie.description,
      poster: movie.poster,
      backdrop: movie.backdrop,
      videoUrl: movie.videoUrl,
      trailerUrl: movie.trailerUrl || '',
      genre: movie.genre,
      category: movie.category,
      year: movie.year.toString(),
      duration: movie.duration,
      quality: movie.quality,
      ageLimit: movie.ageLimit,
      director: movie.director || '',
      actors: movie.actors || '',
      language: movie.language,
      isFeatured: movie.isFeatured ? 1 : 0
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      showToast('Kino nomini kiriting!', 'error');
      return;
    }
    if (!formData.videoUrl?.trim()) {
      showToast('Iltimos, kompyuter/telefondan video faylni tanlang yoki video havolasini kiriting!', 'error');
      return;
    }

    try {
      if (editingMovie) {
        await apiFetch(`/movies/${editingMovie.id}`, {
          method: 'PUT',
          body: formData
        });
        showToast('Kino muvaffaqiyatli tahrirlandi!', 'success');
      } else {
        await apiFetch('/movies', {
          method: 'POST',
          body: formData
        });
        showToast('Yangi kino katalogga qo‘shildi va darhol e’lon qilindi!', 'success');
      }
      setIsModalOpen(false);
      loadMovies();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (movie) => {
    if (!window.confirm(`Haqiqatan ham "${movie.title}" kinosini bazadan o‘chirmoqchimisiz?`)) return;
    try {
      await apiFetch(`/admin/movies/${movie.id}`, { method: 'DELETE' });
      showToast('Kino muvaffaqiyatli o‘chirildi!', 'success');
      loadMovies();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const res = await apiFetch(`/admin/movies/${id}/toggle-featured`, { method: 'PUT' });
      setMovies(prev =>
        prev.map(m => (m.id === id ? { ...m, isFeatured: res.isFeatured } : m))
      );
      showToast(res.isFeatured ? 'Asosiy sahifaga chiqarildi (Featured) ⭐' : 'Asosiy sahifadan olindi', 'info');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleOpenBoost = (movie) => {
    setBoostMovie(movie);
    setBoostViews((movie.viewsCount || 0).toString());
    setBoostRating((movie.rating || 5.0).toString());
    setIsBoostOpen(true);
  };

  const handleSaveBoost = async (e) => {
    e.preventDefault();
    if (!boostMovie) return;
    try {
      await apiFetch(`/admin/movies/${boostMovie.id}/boost`, {
        method: 'PUT',
        body: {
          viewsCount: parseInt(boostViews, 10) || 0,
          rating: parseFloat(boostRating) || 5.0
        }
      });
      showToast('Ko‘rsatkichlar muvaffaqiyatli oshirildi!', 'success');
      setIsBoostOpen(false);
      loadMovies();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 rounded-xl px-3 py-2"
          >
            <option value="all">Barcha kinolar ({movies.length})</option>
            <option value="approved">Faqat tasdiqlangan</option>
            <option value="pending">Kutilmoqda</option>
          </select>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Kino qidirish..."
              className="bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500"
            />
          </div>
        </div>

        {/* Primary Add Movie Button */}
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-lg shadow-red-950/50 transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Yangi Kino Joylash</span>
        </button>
      </div>

      {/* Movies Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-zinc-400">Yuklanmoqda...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-500">
            Hech qanday kino topilmadi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                <tr>
                  <th className="p-3.5">Kino</th>
                  <th className="p-3.5">Kategoriya / Janr</th>
                  <th className="p-3.5">Reyting</th>
                  <th className="p-3.5">Ko‘rishlar</th>
                  <th className="p-3.5">Holati</th>
                  <th className="p-3.5">Banner (Featured)</th>
                  <th className="p-3.5 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {movies.map(m => (
                  <tr key={m.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={m.poster} alt={m.title} className="w-10 h-14 object-cover rounded-lg flex-shrink-0 shadow-sm" />
                      <div>
                        <p className="font-bold text-white text-sm">{m.title}</p>
                        <p className="text-zinc-500 text-[11px]">{m.year} • {m.duration} • <span className="text-amber-400">{m.quality}</span></p>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <p className="font-medium text-white">{m.category}</p>
                      <p className="text-zinc-500 text-[11px]">{m.genre}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {m.rating}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-zinc-300">
                      {m.viewsCount || 0}
                    </td>
                    <td className="p-3.5">
                      {m.isApproved === 1 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          Faol
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800">
                          <Clock className="w-3 h-3" />
                          Kutilmoqda
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleFeatured(m.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          m.isFeatured
                            ? 'bg-amber-950/80 border-amber-600 text-amber-400'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-zinc-300'
                        }`}
                        title="Bosh sahifaning katta banneriga chiqarish"
                      >
                        <Star className={`w-4 h-4 ${m.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Boost views & rating button */}
                        <button
                          onClick={() => handleOpenBoost(m)}
                          className="p-1.5 hover:bg-zinc-800 text-amber-400 hover:text-amber-300 rounded-lg transition-colors"
                          title="Ko‘rsatkichlarni oshirish (Booster)"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>

                        {/* Edit Movie */}
                        <button
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Movie */}
                        <button
                          onClick={() => handleDelete(m)}
                          className="p-1.5 hover:bg-red-950 text-red-400 hover:text-red-300 rounded-lg transition-colors"
                          title="Kinoni o‘chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Movie Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-zinc-100 shadow-2xl space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Film className="w-6 h-6 text-red-500" />
              <span>{editingMovie ? 'Kinoni Tahrirlash' : 'Yangi Kino Joylash'}</span>
            </h3>

            {/* Quick Presets Picker */}
            {!editingMovie && (
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tezkor video shablonini tanlash (1-bosishda to‘ldirish):</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_MOVIES.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="px-2.5 py-1 bg-zinc-900 hover:bg-red-950 border border-zinc-800 hover:border-red-700 text-zinc-200 text-xs rounded-lg transition-colors font-semibold"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-semibold">Kino nomi *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Kino nomini kiriting"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-semibold">Asl nomi</label>
                  <input
                    type="text"
                    value={formData.originalTitle}
                    onChange={(e) => setFormData({ ...formData, originalTitle: e.target.value })}
                    placeholder="Original Title"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Video Tanlash (Kompyuter / Telefon Galereyasi yoki Havola) */}
                <div className="sm:col-span-2 space-y-2 bg-zinc-950/70 p-3.5 rounded-2xl border border-zinc-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs text-white font-bold flex items-center gap-1.5">
                      <FileVideo className="w-4 h-4 text-red-500" />
                      <span>Video fayl yoki manzil *</span>
                    </label>

                    {/* Source Mode Toggle: Fayl (Galereya/Kompyuter) vs Havola (URL) */}
                    <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setVideoSourceMode('file')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                          videoSourceMode === 'file'
                            ? 'bg-red-600 text-white shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <FolderUp className="w-3.5 h-3.5" />
                        <span>Qurilmadan fayl (Kompyuter / Galereya)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoSourceMode('url')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                          videoSourceMode === 'url'
                            ? 'bg-red-600 text-white shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Internet havolasi (URL)</span>
                      </button>
                    </div>
                  </div>

                  {videoSourceMode === 'file' ? (
                    <div className="space-y-2">
                      <input
                        type="file"
                        ref={videoFileInputRef}
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="hidden"
                      />

                      <div
                        onClick={() => !isUploadingVideo && videoFileInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-red-500/40 hover:border-red-400 bg-red-950/20 hover:bg-red-950/30 p-4 rounded-xl flex flex-col items-center justify-center text-center transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Monitor className="w-5 h-5" />
                          </div>
                          <div className="w-9 h-9 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Smartphone className="w-5 h-5" />
                          </div>
                        </div>

                        {formData.videoUrl && !isUploadingVideo ? (
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>{uploadedVideoName || formData.videoUrl.split('/').pop()}</span>
                            </p>
                            <p className="text-[11px] text-zinc-400">
                              ✓ Fayl muvaffaqiyatli saqlandi ({formData.videoUrl}). Boshqa fayl tanlash uchun bosing.
                            </p>
                          </div>
                        ) : isUploadingVideo ? (
                          <div className="space-y-2 w-full max-w-xs">
                            <p className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5">
                              <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                              <span>Video yuklanmoqda... {videoUploadProgress}%</span>
                            </p>
                            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-300"
                                style={{ width: `${videoUploadProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs font-bold text-white mb-0.5">
                              📁 Kompyuter fayllari yoki Telefonda Galereyadan videoni tanlang
                            </p>
                            <p className="text-[11px] text-zinc-400">
                              Barcha formatlar (.mp4, .mkv, .mov, .webm, .avi) qabul qilinadi. Hech qanday havola kiritish shart emas!
                            </p>
                          </div>
                        )}
                      </div>

                      {formData.videoUrl && (
                        <p className="text-[10px] text-zinc-500 font-mono break-all px-1">
                          Tanlangan video: {formData.videoUrl}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://server-nomi.uz/kino.mp4"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                      <p className="text-[10px] text-zinc-500 mt-1">
                        To‘g‘ridan-to‘g‘ri .mp4 yoki streaming videoga ega bo‘lgan internet manzilini kiriting.
                      </p>
                    </div>
                  )}
                </div>

                {/* Poster / Muqova Rasmi */}
                <div className="sm:col-span-2 space-y-2 bg-zinc-950/70 p-3.5 rounded-2xl border border-zinc-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs text-white font-bold flex items-center gap-1.5">
                      <Image className="w-4 h-4 text-amber-500" />
                      <span>Muqova rasmi (Poster - ixtiyoriy)</span>
                    </label>

                    <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setPosterSourceMode('file')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                          posterSourceMode === 'file'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <FolderUp className="w-3.5 h-3.5" />
                        <span>Qurilmadan rasm (Galereya)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPosterSourceMode('url')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                          posterSourceMode === 'url'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Rasm URL havolasi</span>
                      </button>
                    </div>
                  </div>

                  {posterSourceMode === 'file' ? (
                    <div>
                      <input
                        type="file"
                        ref={posterFileInputRef}
                        accept="image/*"
                        onChange={handlePosterFileChange}
                        className="hidden"
                      />
                      <div
                        onClick={() => !isUploadingPoster && posterFileInputRef.current?.click()}
                        className="cursor-pointer border border-dashed border-zinc-700 hover:border-amber-500/60 bg-zinc-900/60 p-3 rounded-xl flex items-center justify-center gap-3 transition-colors text-center"
                      >
                        {formData.poster ? (
                          <div className="flex items-center gap-3">
                            <img src={formData.poster} alt="Poster" className="w-10 h-14 object-cover rounded-lg border border-zinc-700" />
                            <div className="text-left">
                              <p className="text-xs font-bold text-white flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Muqova rasmi tanlandi</span>
                              </p>
                              <p className="text-[10px] text-zinc-400">Boshqa rasm tanlash uchun bosing</p>
                            </div>
                          </div>
                        ) : isUploadingPoster ? (
                          <p className="text-xs text-amber-400 font-bold">Rasm yuklanmoqda... {posterUploadProgress}%</p>
                        ) : (
                          <div className="flex items-center gap-2 text-zinc-400 text-xs">
                            <FolderUp className="w-4 h-4 text-amber-400" />
                            <span>Kompyuter yoki telefon galereyasidan muqova rasmini tanlash</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={formData.poster}
                        onChange={(e) => setFormData({ ...formData, poster: e.target.value, backdrop: e.target.value })}
                        placeholder="https://images.unsplash.com/... (ixtiyoriy)"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-semibold">Janr *</label>
                  <input
                    type="text"
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="Jangari, Fantastika"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-semibold">Kategoriya</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Yangi kinolar">Yangi kinolar</option>
                    <option value="Mashhur kinolar">Mashhur kinolar</option>
                    <option value="O‘zbek kinolari">O‘zbek kinolari</option>
                    <option value="O‘zbek tilidagi kinolar">O‘zbek tilidagi kinolar</option>
                    <option value="Multfilm">Multfilm</option>
                    <option value="Seriallar">Seriallar</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-semibold">Yil</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-semibold">Davomiyligi</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="2 soat 15 daqiqa"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-semibold">Sifat</label>
                  <select
                    value={formData.quality}
                    onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="4K Ultra HD">4K Ultra HD</option>
                    <option value="1080p Full HD">1080p Full HD</option>
                    <option value="720p HD">720p HD</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-semibold">Bosh sahifa banneri (Featured)</label>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured === 1}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked ? 1 : 0 })}
                      className="accent-red-600 w-4 h-4 rounded"
                    />
                    <span>Katta bannerga chiqarish</span>
                  </label>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-zinc-400 block mb-1 font-semibold">Tavsif *</label>
                  <textarea
                    rows="3"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Kino mazmuni haqida..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold rounded-xl text-xs shadow-lg"
                >
                  {editingMovie ? 'Saqlash' : 'Kinoni Joylash va E’lon Qilish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Views & Rating Booster Modal */}
      {isBoostOpen && boostMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-zinc-100 shadow-2xl space-y-4">
            <button
              onClick={() => setIsBoostOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span>Ko‘rsatkichlarni Boshqarish</span>
            </h3>

            <p className="text-xs text-zinc-400">
              "{boostMovie.title}" kinosining ko‘rishlar soni va reytingini o‘zgartirish:
            </p>

            <form onSubmit={handleSaveBoost} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Ko‘rishlar soni</label>
                <input
                  type="number"
                  value={boostViews}
                  onChange={(e) => setBoostViews(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1 font-semibold">Reyting (1.0 dan 5.0 gacha)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={boostRating}
                  onChange={(e) => setBoostRating(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBoostOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs"
                >
                  Oshirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
