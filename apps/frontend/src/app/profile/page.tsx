'use client';
import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import type { Employee } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const isCompany = user?.userType === 'company';

  const { data: employees = [], isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: api.employees.list,
    enabled: isCompany,
  });

  if (!user) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold mb-4">Войдите в аккаунт</h2>
        <Link href="/auth/login" className="btn-primary">Войти</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <Card className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#e8effa] text-[#1a56db] flex items-center justify-center text-2xl font-bold mx-auto mb-3">{user.name.charAt(0)}</div>
            <h3 className="text-base font-semibold">{user.name}</h3>
            <p className="text-xs text-[#6b7280]">{user.email}</p>
            <p className="text-xs text-[#6b7280] mb-4">{user.phone}</p>
            {isCompany && <div className="badge bg-[#d1fae5] text-[#059669] text-xs mb-4">✓ Договор активен до 31.12.2026</div>}
            <hr className="my-4 border-[#e5e7eb]" />
            <Link href="/notifications" className="btn-secondary !w-full !text-xs !mb-2">Настройки уведомлений</Link>
            <Button variant="danger" size="sm" className="!w-full" onClick={() => { if (confirm('Удалить аккаунт?')) toast('Аккаунт будет удалён в течение 30 дней'); }}>Удалить аккаунт</Button>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{isCompany ? 'Сотрудники компании' : 'Личные данные'}</h3>
              <Button variant="ghost" size="sm">Редактировать</Button>
            </div>
            {isCompany ? (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#e5e7eb]"><th className="text-left py-2 text-[#6b7280] font-medium">Сотрудник</th><th className="text-left py-2 text-[#6b7280] font-medium">Должность</th><th className="text-left py-2 text-[#6b7280] font-medium">Записей</th></tr></thead>
                <tbody>
                  {employeesLoading
                    ? Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} cols={3} />)
                    : employees.map((emp) => (
                        <tr key={emp.id} className="border-b border-[#f3f4f6]">
                          <td className="py-2.5 font-medium">{emp.name}</td>
                          <td className="py-2.5 text-[#6b7280]">{emp.position}</td>
                          <td className="py-2.5"><Badge variant={emp.bookingCount > 0 ? 'info' : 'gray'}>{emp.bookingCount}</Badge></td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            ) : (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-[#6b7280]">Имя</span><div className="font-semibold">{user.name.split(' ')[0]}</div></div>
                <div><span className="text-[#6b7280]">Фамилия</span><div className="font-semibold">{user.name.split(' ')[1] || ''}</div></div>
                <div><span className="text-[#6b7280]">Email</span><div className="font-semibold">{user.email}</div></div>
                <div><span className="text-[#6b7280]">Телефон</span><div className="font-semibold">{user.phone}</div></div>
              </div>
            )}
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Мои данные (152-ФЗ)</h3>
            </div>
            <p className="text-xs text-[#6b7280] mb-4">Управление персональными данными в соответствии с 152-ФЗ</p>
            <div className="flex gap-3 flex-wrap">
              <Button variant="secondary" size="sm" onClick={() => toast('Экспорт данных в JSON')}>📥 Экспортировать</Button>
              <Button variant="secondary" size="sm" onClick={() => toast('Исправление данных')}>✏️ Исправить</Button>
              <Button variant="danger" size="sm" onClick={() => { if (confirm('Удалить все данные?')) toast('Аккаунт будет удалён в течение 30 дней'); }}>🗑 Удалить данные</Button>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">История консультаций</h3>
              <Link href="/bookings" className="text-xs text-[#1a56db]">Все записи →</Link>
            </div>
            <div className="space-y-3">
              {[
                { date: '20.06.2026', title: 'Консультация: настройка отчётов', spec: 'Иван Петров • ⭐ 5.0' },
                { date: '05.06.2026', title: 'Тренинг: Базовый курс rkeeper', spec: 'Мария Соколова • ⭐ 4.8' },
                { date: '15.05.2026', title: 'Консультация: интеграция с 1С', spec: 'Алексей Кузнецов • ⭐ 5.0' },
              ].map((item) => (
                <div key={item.date} className="flex items-start gap-3 pb-3 border-b border-[#f3f4f6] last:border-0">
                  <div className="w-2 h-2 bg-[#1a56db] rounded-full mt-1.5 shrink-0" />
                  <div>
                    <div className="text-xs text-[#6b7280]">{item.date}</div>
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-[#6b7280]">{item.spec}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
