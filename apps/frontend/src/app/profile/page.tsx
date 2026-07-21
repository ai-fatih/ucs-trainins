'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import type { Employee } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { AuthModal } from '@/components/auth/AuthModal';
import { Badge } from '@/components/ui/Badge';
import { Bell, Download, Edit3, Trash2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const effectiveUser = hydrated ? user : null;
  const isCompany = effectiveUser?.userType === 'company';
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  const { data: employees = [], isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: api.employees.list,
    enabled: isCompany,
  });

  if (!effectiveUser) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <div className="glass-card max-w-md mx-auto p-8">
          <h2 className="text-xl font-bold mb-4">Войдите в аккаунт</h2>
          <p className="text-sm text-[#6b7280] mb-6">Для доступа к личному кабинету необходимо авторизоваться</p>
          <button onClick={() => setAuthOpen(true)} className="glass-btn">
            Войти <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <div className="glass-card text-center p-6">
            <Avatar name={effectiveUser.name} size="lg" className="mx-auto mb-3" />
            <h3 className="text-base font-semibold">{effectiveUser.name}</h3>
            <p className="text-xs text-[#6b7280]">{effectiveUser.email}</p>
            <p className="text-xs text-[#6b7280] mb-4">{effectiveUser.phone}</p>
            {isCompany && (
              <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#d1fae5] text-[#059669] mb-4">
                ✓ Договор активен до 31.12.2026
              </div>
            )}
            <hr className="my-4 border-[#e5e7eb]" />
            <Link href="/notifications" className="glass-btn !bg-white !text-[#374151] border border-[#d1d5db] w-full text-xs mb-2">
              <Bell className="w-3.5 h-3.5" /> Настройки уведомлений
            </Link>
            <button
              onClick={() => { if (confirm('Удалить аккаунт?')) toast('Аккаунт будет удалён в течение 30 дней'); }}
              className="w-full text-xs text-[#dc2626] hover:bg-red-50 py-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Удалить аккаунт
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#111827]">{isCompany ? 'Сотрудники компании' : 'Личные данные'}</h3>
              <button className="text-xs text-[#6b7280] hover:text-[#1a56db] transition-colors flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> Редактировать
              </button>
            </div>
            {isCompany ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-[#e5e7eb]"><th className="text-left py-2 text-[#6b7280] font-medium">Сотрудник</th><th className="text-left py-2 text-[#6b7280] font-medium">Должность</th><th className="text-left py-2 text-[#6b7280] font-medium">Записей</th></tr></thead>
                  <tbody>
                    {employeesLoading
                      ? Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} cols={3} />)
                      : employees.map((emp) => (
                          <tr key={emp.id} className="border-b border-[#f3f4f6] last:border-0">
                            <td className="py-2.5 font-medium text-[#111827]">{emp.name}</td>
                            <td className="py-2.5 text-[#6b7280]">{emp.position}</td>
                            <td className="py-2.5"><Badge variant={emp.bookingCount > 0 ? 'info' : 'gray'}>{emp.bookingCount}</Badge></td>
                          </tr>
                        ))
                    }
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-[#6b7280]">Имя</span><div className="font-semibold text-[#111827]">{effectiveUser.name.split(' ')[0]}</div></div>
                <div><span className="text-[#6b7280]">Фамилия</span><div className="font-semibold text-[#111827]">{effectiveUser.name.split(' ')[1] || ''}</div></div>
                <div><span className="text-[#6b7280]">Email</span><div className="font-semibold text-[#111827]">{effectiveUser.email}</div></div>
                <div><span className="text-[#6b7280]">Телефон</span><div className="font-semibold text-[#111827]">{effectiveUser.phone}</div></div>
              </div>
            )}
          </div>

          <div className="glass-card p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#111827]">Мои данные (152-ФЗ)</h3>
            </div>
            <p className="text-xs text-[#6b7280] mb-4">Управление персональными данными в соответствии с 152-ФЗ</p>
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => toast('Экспорт данных в JSON')} className="glass-btn !bg-white !text-[#374151] border border-[#d1d5db] text-xs">
                <Download className="w-3.5 h-3.5" /> Экспортировать
              </button>
              <button onClick={() => toast('Исправление данных')} className="glass-btn !bg-white !text-[#374151] border border-[#d1d5db] text-xs">
                <Edit3 className="w-3.5 h-3.5" /> Исправить
              </button>
              <button onClick={() => { if (confirm('Удалить все данные?')) toast('Аккаунт будет удалён в течение 30 дней'); }} className="text-xs text-[#dc2626] hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Удалить данные
              </button>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[#111827]">История консультаций</h3>
              <Link href="/bookings" className="text-xs text-[#1a56db] hover:underline">Все записи →</Link>
            </div>
            <div className="space-y-3">
              {[
                { date: '20.06.2026', title: 'Консультация: формирование отчётов', spec: 'Иван Петров • ⭐ 5.0' },
                { date: '05.06.2026', title: 'Тренинг: Базовый курс rkeeper', spec: 'Мария Соколова • ⭐ 4.8' },
                { date: '15.05.2026', title: 'Консультация: интеграция с 1С', spec: 'Алексей Кузнецов • ⭐ 5.0' },
              ].map((item) => (
                <div key={item.date} className="flex items-start gap-3 pb-3 border-b border-[#f3f4f6] last:border-0">
                  <div className="w-2 h-2 bg-gradient-to-br from-[#1a56db] to-[#0d9488] rounded-full mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs text-[#6b7280]">{item.date}</div>
                    <div className="text-sm font-medium text-[#111827]">{item.title}</div>
                    <div className="text-xs text-[#6b7280]">{item.spec}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
