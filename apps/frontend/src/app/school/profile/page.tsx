'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, UserCircle, Mail, Phone, Building2, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSchoolStats, getArenaProgress, getSchoolProfile, saveSchoolProfile, profileInitials } from '@/lib/school/storage';

export default function ProfilePage() {
  const stats = getSchoolStats();
  const arena = getArenaProgress();
  const [profile, setProfile] = useState(getSchoolProfile());

  const initials = profileInitials(profile.name);
  const inputCls = 'form-input text-sm';

  const handleSave = () => {
    saveSchoolProfile(profile);
    toast.success('Профиль сохранён');
  };

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link href="/school" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> В школу
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Профиль</h1>
        <button onClick={handleSave} className="glass-btn">
          <Save className="w-4 h-4" /> Сохранить
        </button>
      </div>

      <div className="mb-6 p-3 rounded-lg bg-[#f0f4ff] border border-[#bfdbfe] text-xs text-[#1e40af]">
        Прогресс хранится локально на этом устройстве (демо-режим без личного кабинета).
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="glass-card p-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {initials}
            </div>
            <h2 className="text-lg font-bold">{profile.name}</h2>
            <p className="text-sm text-[#6b7280]">{profile.role}</p>
            <div className="mt-4 pt-4 border-t border-[#e5e7eb]/50">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#6b7280]">Уровень</span>
                <span className="font-semibold">{stats.level}</span>
              </div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#6b7280]">Всего XP</span>
                <span className="font-semibold">{arena.xp}</span>
              </div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-[#6b7280]">Стрейн</span>
                <span className="font-semibold">{arena.streak} дн.</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6b7280]">Уроков пройдено</span>
                <span className="font-semibold">{stats.totalLessonsCompleted}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <div className="glass-card p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2"><UserCircle className="w-4 h-4" /> Личные данные</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-xs font-medium text-[#374151] mb-1.5">ФИО</span>
                <input className={inputCls} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-[#374151] mb-1.5">Роль</span>
                <input className={inputCls} value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-[#374151] mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#9ca3af]" /> Email</span>
                <input className={inputCls} type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-[#374151] mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#9ca3af]" /> Телефон</span>
                <input className={inputCls} type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </label>
              <label className="block sm:col-span-2">
                <span className="block text-xs font-medium text-[#374151] mb-1.5 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-[#9ca3af]" /> Компания</span>
                <input className={inputCls} value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
              </label>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold mb-4">Прогресс обучения</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7280]">Всего баллов получено</span>
                <span className="font-semibold text-[#1a56db]">{arena.xp}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7280]">Бейджей заработано</span>
                <span className="font-semibold text-[#ca8a04]">{stats.badgesEarned.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7280]">Сертификатов получено</span>
                <span className="font-semibold text-[#7c3aed]">{stats.certificatesEarned.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7280]">Курсов завершено</span>
                <span className="font-semibold text-[#059669]">{stats.totalCoursesCompleted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
