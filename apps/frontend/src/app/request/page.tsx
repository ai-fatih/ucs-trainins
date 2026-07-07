'use client';

import { FormEvent, useState } from 'react';
import { apiClient, type ServiceType } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

const initialForm = {
  name: '',
  contact: '',
  organization: '',
  serviceType: 'consultation' as ServiceType,
  topic: '',
  description: '',
};

export default function RequestPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestNumber, setRequestNumber] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const created = await apiClient.requests.create({
        ...form,
        organization: form.organization || undefined,
      });
      setRequestNumber(created.number);
      setForm(initialForm);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Не удалось создать заявку');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="section-title">Оставить заявку</h1>
      <p className="section-subtitle">Опишите задачу, и администратор свяжется с вами по указанному контакту.</p>

      {requestNumber && (
        <div className="mb-6 rounded-md bg-[#d1fae5] p-4 text-sm text-[#047857]">
          Заявка создана. Номер: <strong>{requestNumber}</strong>
        </div>
      )}
      {error && <p className="mb-4 text-sm text-[#dc2626]">{error}</p>}

      <form onSubmit={handleSubmit} className="rounded-lg border border-[#e5e7eb] bg-white p-6">
        <Input label="Имя *" required maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <Input label="Телефон или email *" required maxLength={254} value={form.contact} onChange={(event) => setForm({ ...form, contact: event.target.value })} />
        <Input label="Организация" maxLength={200} value={form.organization} onChange={(event) => setForm({ ...form, organization: event.target.value })} />
        <label className="mb-1.5 block text-sm font-medium text-[#374151]" htmlFor="serviceType">Тип услуги *</label>
        <select id="serviceType" className="form-input mb-4" required value={form.serviceType} onChange={(event) => setForm({ ...form, serviceType: event.target.value as ServiceType })}>
          <option value="training">Обучение</option>
          <option value="consultation">Консультация</option>
          <option value="other">Другое</option>
        </select>
        <Input label="Тема *" required maxLength={200} value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} />
        <Textarea label="Описание *" required rows={6} maxLength={5000} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        <Button type="submit" loading={loading}>Отправить заявку</Button>
      </form>
    </div>
  );
}
