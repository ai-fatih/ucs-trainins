'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, UserCircle, Mail, Phone, Building2 } from 'lucide-react';
import { getSchoolStats, getArenaProgress } from '@/lib/school/storage';

export default function ProfilePage() {
  const stats = getSchoolStats();
  const arena = getArenaProgress();

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link href="/school" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> На главную
      </Link>

      <h1 className="text-2xl font-bold mb-6">Профиль</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="glass-card p-6 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              ФВ
            </div>
            <h2 className="text-lg font-bold">Фатихов Владислав</h2>
            <p className="text-sm text-[#6b7280]">Обучающийся</p>
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
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#9ca3af]" />
                <span>vladislav@example.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-[#9ca3af]" />
                <span>+7 (999) 123-45-67</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-[#9ca3af]" />
                <span>ООО «УЮТНАЯ КОМПАНИЯ СЕРВИС»</span>
              </div>
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