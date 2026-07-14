'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { apiClient, type FeedbackRequestSummary } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { getStatusLabel } from '@/lib/utils';

export default function FeedbackPage() {
  const { token } = useParams<{ token: string }>();
  const [summary, setSummary] = useState<FeedbackRequestSummary | null>(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiClient.feedback.get(token)
      .then((data) => { if (active) setSummary(data); })
      .catch((loadError: unknown) => { if (active) setError(loadError instanceof Error ? loadError.message : 'Ссылка недоступна'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await apiClient.feedback.submit(token, {
        rating,
        text: text || undefined,
        customerName: customerName || undefined,
      });
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Не удалось отправить отзыв');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="p-8 text-center text-sm text-[#6b7280]">Загрузка...</p>;
  if (!summary) return <p className="p-8 text-center text-sm text-[#dc2626]">{error || 'Ссылка недоступна'}</p>;
  if (summary.feedbackSubmitted || submitted) return <p className="p-8 text-center text-sm text-[#047857]">Спасибо. Отзыв уже отправлен.</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="section-title">Отзыв по заявке {summary.number}</h1>
      <div className="mb-6 rounded-lg border border-[#e5e7eb] bg-white p-4 text-sm">
        <p><span className="text-[#6b7280]">Организация:</span> {summary.organization || '—'}</p>
        <p><span className="text-[#6b7280]">Тема:</span> {summary.topic}</p>
        <p><span className="text-[#6b7280]">Статус:</span> {getStatusLabel(summary.status).label}</p>
        <p><span className="text-[#6b7280]">Тип услуги:</span> {summary.serviceType}</p>
      </div>
      {error && <p className="mb-4 text-sm text-[#dc2626]">{error}</p>}
      <form onSubmit={handleSubmit} className="rounded-lg border border-[#e5e7eb] bg-white p-6">
        <label className="mb-1.5 block text-sm font-medium text-[#374151]" htmlFor="rating">Оценка *</label>
        <select id="rating" className="form-input mb-4" value={rating} onChange={(event) => setRating(Number(event.target.value))}>
          {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value}</option>)}
        </select>
        <Input label="Ваше имя" maxLength={120} value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
        <Textarea label="Текст отзыва" rows={5} maxLength={3000} value={text} onChange={(event) => setText(event.target.value)} />
        <label className="flex items-start gap-3 mb-4 text-sm text-[#6b7280]">
          <input type="checkbox" required className="mt-0.5 shrink-0" />
          <span>Даю <Link href="/consent" className="text-[#1a56db] underline">согласие на обработку персональных данных</Link> в соответствии с <Link href="/privacy" className="text-[#1a56db] underline">Политикой конфиденциальности</Link> <span className="text-[#dc2626]">*</span></span>
        </label>
        <Button type="submit" loading={submitting}>Отправить отзыв</Button>
      </form>
    </div>
  );
}
