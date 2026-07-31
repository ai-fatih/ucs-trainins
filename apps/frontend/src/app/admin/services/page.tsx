'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import type { Service } from '@/types';
import { useStaffGuard } from '@/components/admin/useStaffGuard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ServiceForm {
  name: string;
  description: string;
  type: Service['type'];
  durationMinutes: string;
  priceRub: string;
  isFree: boolean;
  category: string;
  icon: string;
  iconBg: string;
}

const emptyForm: ServiceForm = {
  name: '',
  description: '',
  type: 'consultation',
  durationMinutes: '30',
  priceRub: '',
  isFree: false,
  category: 'consultations',
  icon: '💬',
  iconBg: '#e8effa',
};

function toForm(s?: Service): ServiceForm {
  if (!s) return emptyForm;
  return {
    name: s.name,
    description: s.description,
    type: s.type,
    durationMinutes: String(s.durationMinutes),
    priceRub: s.priceRub === null ? '' : String(s.priceRub),
    isFree: s.isFree,
    category: s.category,
    icon: s.icon,
    iconBg: s.iconBg,
  };
}

export default function AdminServicesPage() {
  useStaffGuard();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: api.services.list,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['services'] });

  const createMutation = useMutation({
    mutationFn: () => api.admin.services.create({
      name: form.name,
      description: form.description,
      type: form.type,
      durationMinutes: Number(form.durationMinutes) || 30,
      priceRub: form.isFree ? null : (Number(form.priceRub) || 0),
      isFree: form.isFree,
      category: form.category,
      icon: form.icon || '💬',
      iconBg: form.iconBg || '#e8effa',
    }),
    onSuccess: () => { invalidate(); setFormOpen(false); toast.success('Услуга добавлена'); },
  });

  const updateMutation = useMutation({
    mutationFn: (id: string) => api.admin.services.update(id, {
      name: form.name,
      description: form.description,
      type: form.type,
      durationMinutes: Number(form.durationMinutes) || 30,
      priceRub: form.isFree ? null : (Number(form.priceRub) || 0),
      isFree: form.isFree,
      category: form.category,
      icon: form.icon || '💬',
      iconBg: form.iconBg || '#e8effa',
    }),
    onSuccess: () => { invalidate(); setFormOpen(false); toast.success('Услуга обновлена'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.services.remove(id),
    onSuccess: () => { invalidate(); toast.success('Услуга удалена'); },
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormOpen(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm(toForm(s)); setFormOpen(true); };
  const handleDelete = (s: Service) => {
    if (confirm(`Удалить услугу «${s.name}»?`)) deleteMutation.mutate(s.id);
  };
  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Укажите название услуги'); return; }
    if (editing) updateMutation.mutate(editing.id);
    else createMutation.mutate();
  };

  const set = (patch: Partial<ServiceForm>) => setForm((prev) => ({ ...prev, ...patch }));

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-1">Услуги</h1>
          <p className="text-sm text-[#6b7280]">Управление каталогом услуг — {services.length} позиций</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/dashboard" className="glass-btn text-sm">KPI</Link>
          <Button onClick={openCreate}><Plus className="w-4 h-4" /> Добавить</Button>
        </div>
      </div>

      <div className="glass-card overflow-x-auto">
        {isLoading ? (
          <div className="p-4"><TableRowSkeleton cols={5} /></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb]">
                <th className="p-3">Название</th>
                <th className="p-3">Тип</th>
                <th className="p-3">Длительность</th>
                <th className="p-3">Цена</th>
                <th className="p-3">Категория</th>
                <th className="p-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-[#f3f4f6] last:border-0">
                  <td className="p-3">
                    <span className="flex items-center gap-2 font-medium text-[#111827]">
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: s.iconBg }}>
                        {s.icon}
                      </span>
                      {s.name}
                    </span>
                  </td>
                  <td className="p-3 text-[#6b7280]">{s.type}</td>
                  <td className="p-3 text-[#6b7280]">{s.durationMinutes} мин</td>
                  <td className="p-3 text-[#6b7280]">{s.isFree ? 'Бесплатно' : `${s.priceRub}₽`}</td>
                  <td className="p-3 text-[#6b7280]">{s.category}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(s)} className="text-[#1a56db] hover:bg-[#e8effa] px-2 py-1 rounded-md transition-colors" title="Редактировать">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(s)} className="text-[#dc2626] hover:bg-red-50 px-2 py-1 rounded-md transition-colors" title="Удалить">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Редактировать услугу' : 'Новая услуга'}
        actions={
          <div className="flex gap-3">
            <button onClick={() => setFormOpen(false)} className="glass-btn text-sm">Отмена</button>
            <Button onClick={handleSave} loading={createMutation.isPending || updateMutation.isPending}>Сохранить</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#6b7280] mb-1 block">Название *</label>
            <input className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm" value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Например, Консультация по rkeeper" />
          </div>
          <div>
            <label className="text-xs text-[#6b7280] mb-1 block">Описание</label>
            <textarea className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm resize-none" rows={2} value={form.description} onChange={(e) => set({ description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#6b7280] mb-1 block">Тип</label>
              <select className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm bg-white" value={form.type} onChange={(e) => set({ type: e.target.value as Service['type'] })}>
                <option value="consultation">Консультация</option>
                <option value="training">Обучение</option>
                <option value="setup">Настройка</option>
                <option value="video">Видео</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#6b7280] mb-1 block">Категория</label>
              <select className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm bg-white" value={form.category} onChange={(e) => set({ category: e.target.value })}>
                <option value="consultations">Консультации</option>
                <option value="trainings">Обучение</option>
                <option value="directories">Справочники</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[#6b7280] mb-1 block">Длительность, мин</label>
              <input type="number" min={5} className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm" value={form.durationMinutes} onChange={(e) => set({ durationMinutes: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[#6b7280] mb-1 block">Цена, ₽</label>
              <input type="number" min={0} disabled={form.isFree} className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm disabled:opacity-50" value={form.priceRub} onChange={(e) => set({ priceRub: e.target.value })} />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-[#6b7280]">
                <input type="checkbox" checked={form.isFree} onChange={(e) => set({ isFree: e.target.checked })} className="accent-[#0d9488]" />
                Бесплатно
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#6b7280] mb-1 block">Иконка (эмодзи)</label>
              <input className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm" value={form.icon} onChange={(e) => set({ icon: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[#6b7280] mb-1 block">Цвет фона (hex)</label>
              <input className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm" value={form.iconBg} onChange={(e) => set({ iconBg: e.target.value })} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
