import React, { useState } from 'react';
import { useGrocery } from '../context/GroceryContext';
import { UserProfile } from '../types';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  UtensilsCrossed,
  Calendar,
  Store,
  Bell,
  ShieldCheck,
  Check,
  Save,
  Smartphone,
  Download,
  Sparkles,
  Award,
  Crown,
  Heart,
  Volume2,
} from 'lucide-react';
import { playPriyamGreeting } from '../utils/priyamVoiceGreeter';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, showToast, setIsApkModalOpen, items, purchaseHistory } = useGrocery();

  // Local form state initialized from context
  const [profileForm, setProfileForm] = useState<UserProfile>({
    name: settings.user.name || 'Priyam Roy',
    email: settings.user.email || 'priyamroy772@gmail.com',
    phone: settings.user.phone || '+91 98765 43210',
    avatarEmoji: settings.user.avatarEmoji || '🛒',
    city: settings.user.city || 'Kolkata, WB',
    householdSize: settings.user.householdSize || 4,
    dietaryPreference: settings.user.dietaryPreference || 'All',
    preferredShoppingDay: settings.user.preferredShoppingDay || 'Sunday',
    primaryStore: settings.user.primaryStore || 'Local Mandi & Supermarket',
    lowStockAlerts: settings.user.lowStockAlerts ?? true,
    memberSince: settings.user.memberSince || 'Oct 2026',
    isSignedIn: true,
    authMethod: settings.user.authMethod || 'phone',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [voiceGreetingEnabled, setVoiceGreetingEnabled] = useState<boolean>(
    settings.voiceGreetingEnabled !== false
  );

  const availableEmojis = ['🛒', '👨‍🍳', '👩‍🌾', '🥦', '🍎', '🧺', '🥗', '🥘', '👑', '⭐'];

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleToggleVoiceGreeting = () => {
    const nextVal = !voiceGreetingEnabled;
    setVoiceGreetingEnabled(nextVal);
    updateSettings({ voiceGreetingEnabled: nextVal });
    showToast(
      nextVal
        ? 'Voice greeting ("Hi Priyam!") enabled on app open'
        : 'Voice greeting disabled',
      'info'
    );
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileForm.name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }

    updateSettings({
      voiceGreetingEnabled,
      user: {
        ...settings.user,
        ...profileForm,
      },
    });

    setIsSaved(true);
    showToast('Profile updated successfully!', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Page Title */}
      <div className="px-1 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-display">
            My Profile & Preferences
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Personalize your grocery shopper profile and household settings
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold">
          <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>PRO Shopper</span>
        </div>
      </div>

      {/* 1. Hero Identity Card */}
      <div className="rounded-3xl bg-gradient-to-br from-[#FFF7B8] via-[#FFD745] to-[#F5B400] p-5 border border-[#FFECA8] shadow-md shadow-amber-400/20 text-slate-950 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-4">
          {/* Avatar with Emoji Picker Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsEditingAvatar(!isEditingAvatar)}
              className="w-16 h-16 rounded-2xl bg-white shadow-md border-2 border-amber-300 flex items-center justify-center text-3xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Change Avatar Emoji"
            >
              <span>{profileForm.avatarEmoji || '🛒'}</span>
            </button>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
              ✎
            </span>
          </div>

          {/* User Primary Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-950 font-display truncate">
                {profileForm.name}
              </h3>
              <span className="bg-[#00B050] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-xs">
                PRO
              </span>
            </div>
            <p className="text-xs font-semibold text-amber-950/90 truncate mt-0.5">
              {profileForm.email}
            </p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-amber-950/80 mt-1">
              <span>{profileForm.phone}</span>
              <span>·</span>
              <span>{profileForm.city}</span>
            </div>
          </div>
        </div>

        {/* Emoji Selector Tray if active */}
        {isEditingAvatar && (
          <div className="mt-3.5 p-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-amber-200/80 flex items-center justify-between gap-1">
            {availableEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  handleChange('avatarEmoji', emoji);
                  setIsEditingAvatar(false);
                }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg hover:scale-110 active:scale-95 transition-all cursor-pointer ${
                  profileForm.avatarEmoji === emoji ? 'bg-[#FFD21F] shadow-xs' : 'hover:bg-amber-100/50'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Quick Shopper Stats */}
        <div className="mt-4 pt-3.5 border-t border-amber-950/10 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-white/60 backdrop-blur-xs">
            <span className="text-[10px] font-extrabold text-amber-900 uppercase block tracking-wider">
              Active Items
            </span>
            <span className="text-base font-black text-slate-950 tabular-nums">
              {items.length}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white/60 backdrop-blur-xs">
            <span className="text-[10px] font-extrabold text-amber-900 uppercase block tracking-wider">
              Total Shopped
            </span>
            <span className="text-base font-black text-slate-950 tabular-nums">
              {purchaseHistory.length}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white/60 backdrop-blur-xs">
            <span className="text-[10px] font-extrabold text-amber-900 uppercase block tracking-wider">
              Member Since
            </span>
            <span className="text-xs font-black text-slate-950">
              {profileForm.memberSince}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Professional Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-4">
        {/* Personal Details Section */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Personal Information
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Full Name */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 mb-1 block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. Priyam Roy"
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Mobile Number & Email in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="priyamroy772@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* City / Area */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 mb-1 block">
                City / Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g. Kolkata, West Bengal"
                  className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Household & Grocery Habits Section */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <UtensilsCrossed className="w-4 h-4 text-amber-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Household & Shopping Preferences
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Household Members */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Family / Household Size</span>
              </label>
              <select
                value={profileForm.householdSize}
                onChange={(e) => handleChange('householdSize', Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
              >
                <option value={1}>1 Person (Solo Living)</option>
                <option value={2}>2 People (Couple / Roommates)</option>
                <option value={3}>3 People (Small Family)</option>
                <option value={4}>4 People (Medium Family)</option>
                <option value={5}>5+ People (Joint Family)</option>
              </select>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <UtensilsCrossed className="w-3.5 h-3.5 text-slate-400" />
                <span>Dietary Preference</span>
              </label>
              <select
                value={profileForm.dietaryPreference}
                onChange={(e) => handleChange('dietaryPreference', e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
              >
                <option value="All">All / Non-Vegetarian</option>
                <option value="Vegetarian">Pure Vegetarian</option>
                <option value="Eggetarian">Eggetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Jain">Jain Friendly</option>
              </select>
            </div>

            {/* Preferred Shopping Day */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferred Shopping Day</span>
              </label>
              <select
                value={profileForm.preferredShoppingDay}
                onChange={(e) => handleChange('preferredShoppingDay', e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
              >
                <option value="Sunday">Sunday (Weekend Stockup)</option>
                <option value="Saturday">Saturday</option>
                <option value="Monday">Monday (Week Start)</option>
                <option value="Wednesday">Wednesday (Midweek Refresh)</option>
                <option value="Friday">Friday</option>
                <option value="Any Day">Flexible / Any Day</option>
              </select>
            </div>

            {/* Primary Supermarket */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 mb-1 flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-slate-400" />
                <span>Primary Grocery Store</span>
              </label>
              <input
                type="text"
                value={profileForm.primaryStore}
                onChange={(e) => handleChange('primaryStore', e.target.value)}
                placeholder="e.g. Local Mandi, Blinkit, DMart"
                className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Low Stock Alerts Switch */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  Stock Low & Shopping Reminders
                </span>
                <span className="text-[10px] text-slate-500">
                  Notify when key kitchen staples need replenishment
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleChange('lowStockAlerts', !profileForm.lowStockAlerts)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                profileForm.lowStockAlerts ? 'bg-[#10B981]' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  profileForm.lowStockAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sweet Female Voice Greeting on App Open Switch */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 block leading-tight">
                    Sweet Female Voice Greeting
                  </span>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 uppercase tracking-wider">
                    "Hi Priyam!"
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">
                  Plays sweet female voice on app launch
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playPriyamGreeting(true);
                  showToast('Playing: "Hi Priyam!"', 'info');
                }}
                className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-black border border-amber-200 transition-all cursor-pointer flex items-center gap-1"
                title="Test Voice Greeting"
              >
                <Volume2 className="w-3 h-3" />
                <span>Test</span>
              </button>

              <button
                type="button"
                onClick={handleToggleVoiceGreeting}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  voiceGreetingEnabled ? 'bg-[#10B981]' : 'bg-slate-300'
                }`}
                title={voiceGreetingEnabled ? 'Voice Greeting is Enabled' : 'Voice Greeting is Disabled'}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    voiceGreetingEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Profile Button */}
        <button
          type="submit"
          className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-[#FFD21F] to-[#F5AE00] text-slate-950 font-black text-xs shadow-md shadow-amber-400/30 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4 stroke-[3] text-emerald-900" />
              <span>Profile Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>Save Profile Changes</span>
            </>
          )}
        </button>
      </form>

      {/* 3. Android APK Mobile Install Card */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-900 flex items-center justify-center shrink-0 border border-amber-200">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Android APK Mobile Edition
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Install as native app on Android or home screen PWA
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsApkModalOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>APK</span>
        </button>
      </div>

      {/* 4. Local Storage Security & Privacy Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-slate-600 flex items-center gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <p className="text-[11px] font-medium leading-tight">
          Your profile, grocery checklist, and expenses are encrypted and securely stored on your local device.
        </p>
      </div>
    </div>
  );
};
