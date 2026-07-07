'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError, apiClient, type ServiceRequest } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';

const statusLabels = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Выполнена',
  rejected: 'Отклонена',
};

export default function AdminRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        await apiClient.auth.me();
        const items = await apiClient.requests.list();
        if (active) setRequests(items);
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          router.replace('/admin/login');
          return;
        }
        if (active) setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить заявки');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [router]);

  async function logout() {
    await apiClient.auth.logout();
    router.replace('/admin/login');
  }

  if (loading) return <p className="p-8 text-center text-sm text-[#6b7280]">Загрузка...</p>;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="section-title">Заявки</h1>
          <p className="section-subtitle !mb-0">Рабочий список обращений клиентов</p>
        </div>
        <Button variant="secondary" onClick={() => void logout()}>Выйти</Button>
      </div>
      {error && <p className="mb-4 text-sm text-[#dc2626]">{error}</p>}
      <div className="overflow-x-auto rounded-lg border border-[#e5e7eb] bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#f9fafb] text-[#6b7280]">
            <tr>
              <th className="p-3">Номер</th>
              <th className="p-3">Клиент</th>
              <th className="p-3">Тема</th>
              <th className="p-3">Статус</th>
              <th className="p-3">Создана</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((item) => (
              <tr key={item.id} className="border-t border-[#e5e7eb]">
                <td className="p-3"><Link href={`/admin/requests/${item.id}`}>{item.number}</Link></td>
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.topic}</td>
                <td className="p-3">{statusLabels[item.status]}</td>
                <td className="p-3">{new Date(item.createdAt).toLocaleString('ru-RU')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && !error && <p className="p-8 text-center text-sm text-[#6b7280]">Заявок пока нет.</p>}
      </div>
    </div>
  );
}
