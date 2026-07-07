'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ApiError,
  apiClient,
  type RequestStatus,
  type ServiceRequest,
} from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';

const statusLabels = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Выполнена',
  rejected: 'Отклонена',
};

export default function AdminRequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<ServiceRequest | null>(null);
  const [comment, setComment] = useState('');
  const [feedbackUrl, setFeedbackUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        await apiClient.auth.me();
        const request = await apiClient.requests.get(id);
        if (active) setItem(request);
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          router.replace('/admin/login');
          return;
        }
        if (active) setError(loadError instanceof Error ? loadError.message : 'Не удалось загрузить заявку');
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [id, router]);

  async function updateStatus(status: RequestStatus) {
    setSaving(true);
    setError('');
    try {
      setItem(await apiClient.requests.updateStatus(id, status));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Не удалось изменить статус');
    } finally {
      setSaving(false);
    }
  }

  async function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!comment.trim()) return;
    setSaving(true);
    setError('');
    try {
      await apiClient.requests.addComment(id, comment);
      setItem(await apiClient.requests.get(id));
      setComment('');
    } catch (commentError) {
      setError(commentError instanceof Error ? commentError.message : 'Не удалось добавить комментарий');
    } finally {
      setSaving(false);
    }
  }

  async function generateFeedbackLink() {
    setSaving(true);
    setError('');
    try {
      const result = await apiClient.requests.createFeedbackLink(id);
      setFeedbackUrl(result.url);
    } catch (linkError) {
      setError(linkError instanceof Error ? linkError.message : 'Не удалось создать ссылку');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-8 text-center text-sm text-[#6b7280]">Загрузка...</p>;
  if (!item) return <p className="p-8 text-center text-sm text-[#dc2626]">{error || 'Заявка не найдена'}</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/admin/requests" className="mb-4 inline-block text-sm">← Все заявки</Link>
      <h1 className="section-title">{item.number}</h1>
      {error && <p className="mb-4 text-sm text-[#dc2626]">{error}</p>}

      <section className="mb-6 rounded-lg border border-[#e5e7eb] bg-white p-6">
        <dl className="grid gap-3 text-sm md:grid-cols-2">
          <div><dt className="text-[#6b7280]">Клиент</dt><dd className="font-medium">{item.name}</dd></div>
          <div><dt className="text-[#6b7280]">Контакт</dt><dd className="font-medium">{item.contact}</dd></div>
          <div><dt className="text-[#6b7280]">Организация</dt><dd>{item.organization || '—'}</dd></div>
          <div><dt className="text-[#6b7280]">Тип услуги</dt><dd>{item.serviceType}</dd></div>
          <div className="md:col-span-2"><dt className="text-[#6b7280]">Тема</dt><dd>{item.topic}</dd></div>
          <div className="md:col-span-2"><dt className="text-[#6b7280]">Описание</dt><dd className="whitespace-pre-wrap">{item.description}</dd></div>
        </dl>
      </section>

      <section className="mb-6 rounded-lg border border-[#e5e7eb] bg-white p-6">
        <h2 className="mb-3 font-semibold">Статус</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(statusLabels) as RequestStatus[]).map((status) => (
            <Button key={status} variant={item.status === status ? 'primary' : 'secondary'} disabled={saving} onClick={() => void updateStatus(status)}>
              {statusLabels[status]}
            </Button>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-[#e5e7eb] bg-white p-6">
        <h2 className="mb-3 font-semibold">Внутренние комментарии</h2>
        <div className="mb-4 space-y-3">
          {item.comments?.map((entry) => (
            <div key={entry.id} className="rounded-md bg-[#f9fafb] p-3 text-sm">
              <p className="whitespace-pre-wrap">{entry.text}</p>
              <p className="mt-1 text-xs text-[#6b7280]">{entry.adminUser.email} · {new Date(entry.createdAt).toLocaleString('ru-RU')}</p>
            </div>
          ))}
          {item.comments?.length === 0 && <p className="text-sm text-[#6b7280]">Комментариев нет.</p>}
        </div>
        <form onSubmit={addComment}>
          <Textarea label="Новый комментарий" required maxLength={2000} value={comment} onChange={(event) => setComment(event.target.value)} />
          <Button type="submit" loading={saving}>Добавить</Button>
        </form>
      </section>

      <section className="mb-6 rounded-lg border border-[#e5e7eb] bg-white p-6">
        <h2 className="mb-3 font-semibold">Ссылка для отзыва</h2>
        <Button disabled={saving} onClick={() => void generateFeedbackLink()}>Создать или показать ссылку</Button>
        {feedbackUrl && <p className="mt-3 break-all rounded bg-[#f9fafb] p-3 text-sm">{feedbackUrl}</p>}
      </section>

      <section className="rounded-lg border border-[#e5e7eb] bg-white p-6">
        <h2 className="mb-3 font-semibold">История статусов</h2>
        <ul className="space-y-2 text-sm">
          {item.history?.map((entry) => (
            <li key={entry.id}>
              {entry.fromStatus ? `${statusLabels[entry.fromStatus]} → ` : ''}{statusLabels[entry.toStatus]}
              <span className="text-[#6b7280]"> · {new Date(entry.createdAt).toLocaleString('ru-RU')}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
