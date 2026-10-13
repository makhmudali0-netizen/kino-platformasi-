import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { apiFetch } from '../utils/api';
import { Link } from 'react-router-dom';
import { 
  User, Mail, AtSign, Shield, Heart, Clock, 
  Upload, Users, Edit3, Save, Camera, Film,
  FolderUp, Smartphone, Monitor, CheckCircle2, RefreshCw, ExternalLink
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, setIsAuthModalOpen } = useAuth();
  const { showToast } = useNotification();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarSourceMode, setAvatarSourceMode] = useState('file'); // 'file' | 'url'
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);

  const avatarFileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localBlobUrl = URL.createObjectURL(file);
    setAvatar(localBlobUrl);
    setIsUploadingAvatar(true);
    setAvatarUploadProgress(25);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const token = localStorage.getItem('kinoverse_token');
      const adminPin = localStorage.getItem('kinoverse_admin_pin');
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(adminPin ? { 'x-admin-pin': adminPin } : {})
      };

      setAvatarUploadProgress(60);
      const res = await fetch('/api/upload/file', {
        method: 'POST',
        headers,
        body: uploadData
      });
      const data = await res.json();
      setAvatarUploadProgress(100);

      if (data.success && data.url) {
        setAvatar(data.url);
        // Persist immediately in database and update global user state
        await updateProfile({ avatar: data.url });
        showToast('Profil rasmi qurilmangizdan muvaffaqiyatli yuklandi va saqlandi!', 'success');
      } else {
        throw new Error(data.error || 'Rasm yuklashda xatolik yuz berdi');
      }
    } catch (err) {
      showToast(err.message || 'Rasm yuklashda xatolik', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="p-8 rounded-3xl bg-zinc-900 border border-zinc-800 max-w-md space-y-4">
          <User className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Mening Profilim</h2>
          <p className="text-xs text-zinc-400">
            Profil ma’lumotlarini ko‘rish va o‘zgartirish uchun avval tizimga kiring.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-sm"
          >
            Kirish
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, avatar });
      setIsEditing(false);
      showToast('Profil ma’lumotlari muvaffaqiyatli saqlandi!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
  ];

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Profile Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            
            {/* Avatar & Device Picker */}
            <div className="relative group">
              <input
                type="file"
                ref={avatarFileInputRef}
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
              <div
                onClick={() => !isUploadingAvatar && avatarFileInputRef.current?.click()}
                className="relative cursor-pointer rounded-full overflow-hidden ring-4 ring-red-600/40 shadow-2xl transition-transform hover:scale-105"
                title="Rasmni o‘zgartirish uchun bosing (Kompyuter yoki Galereya)"
              >
                <img
                  src={avatar || user.avatar}
                  alt={user.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity">
                  {isUploadingAvatar ? (
                    <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                  ) : (
                    <>
                      <Camera className="w-6 h-6 text-white mb-1" />
                      <span className="text-[10px] font-bold">O‘zgartirish</span>
                    </>
                  )}
                </div>
              </div>

              {/* Camera Action Badge */}
              <button
                type="button"
                onClick={() => !isUploadingAvatar && avatarFileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg border-2 border-zinc-900 group-hover:scale-110 transition-transform cursor-pointer"
                title="Kompyuter yoki telefon galereyasidan rasm tanlash"
              >
                {isUploadingAvatar ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* User Meta */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h1>
                  <p className="text-xs text-zinc-400 mt-0.5">@{user.username}</p>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-1.5 self-center sm:self-start bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Bekor qilish' : 'Profilni tahrirlash'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  {user.email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <strong className="text-amber-400 uppercase font-mono text-[11px]">{user.role}</strong>
                </span>
                <span>•</span>
                <span className="text-[11px] font-mono text-zinc-500">ID: {user.id}</span>
              </div>
            </div>

          </div>

          {/* Edit Form Drawer */}
          {isEditing && (
            <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-zinc-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1 font-semibold">To‘liq ism</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Avatar Tanlash: Qurilmadan (Galereya/Kompyuter) yoki Havola */}
                <div className="space-y-2 bg-zinc-950/70 p-3.5 rounded-2xl border border-zinc-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs text-white font-bold flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-red-500" />
                      <span>Profil rasmi (Avatar)</span>
                    </label>

                    <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setAvatarSourceMode('file')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                          avatarSourceMode === 'file'
                            ? 'bg-red-600 text-white shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <FolderUp className="w-3.5 h-3.5" />
                        <span>Qurilmadan (Galereya)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarSourceMode('url')}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                          avatarSourceMode === 'url'
                            ? 'bg-red-600 text-white shadow-sm'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>URL Havola</span>
                      </button>
                    </div>
                  </div>

                  {avatarSourceMode === 'file' ? (
                    <div>
                      <div
                        onClick={() => !isUploadingAvatar && avatarFileInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-red-500/40 hover:border-red-400 bg-red-950/20 hover:bg-red-950/30 p-3.5 rounded-xl flex items-center justify-center gap-3 transition-colors text-center group"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Monitor className="w-4 h-4" />
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Smartphone className="w-4 h-4" />
                          </div>
                        </div>

                        {isUploadingAvatar ? (
                          <div className="text-left">
                            <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Rasm yuklanmoqda... {avatarUploadProgress}%</span>
                            </p>
                          </div>
                        ) : (
                          <div className="text-left">
                            <p className="text-xs font-bold text-white">
                              📁 Kompyuter fayllari yoki Galereyadan rasm tanlash
                            </p>
                            <p className="text-[10px] text-zinc-400">
                              Telefoningizda Galereya, kompyuterda rasmlar ochiladi (JPG, PNG, WEBP)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Preset Avatars */}
              <div>
                <label className="text-xs text-zinc-400 block mb-2 font-semibold">
                  Yoki tayyor avatarlardan tanlang:
                </label>
                <div className="flex items-center gap-3">
                  {sampleAvatars.map((avUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAvatar(avUrl)}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-transform hover:scale-110 ${
                        avatar === avUrl ? 'border-red-500 ring-2 ring-red-500/50' : 'border-zinc-700'
                      }`}
                    >
                      <img src={avUrl} alt="Preset avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-lg transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{loading ? 'Saqlanmoqda...' : 'O‘zgarishlarni saqlash'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/favorites"
            className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-red-600/10 text-red-500 w-fit mb-3 group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <p className="text-2xl font-black text-white">{user.stats?.favorites || 0}</p>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">Sevimli kinolar</p>
          </Link>

          <Link
            to="/history"
            className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 w-fit mb-3 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-white">{user.stats?.history || 0}</p>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">Ko‘rish tarixi</p>
          </Link>

          <Link
            to="/friends"
            className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 w-fit mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-white">{user.stats?.friends || 0}</p>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">Do‘stlar</p>
          </Link>

          <Link
            to="/upload"
            className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 transition-all group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 w-fit mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-white">{user.stats?.uploads || 0}</p>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">Yuklangan kinolar</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
