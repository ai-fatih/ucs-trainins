'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import type { Specialist } from '@/types';
import { useStaffGuard } from '@/components/admin/useStaffGuard';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface SpecialistForm {
  name: string;
  role: string;
  avatar: string;
  avatarBg: string;
  avatarColor: string;
  skillTags: string;
}

const emptyForm: SpecialistForm = {
  name: '',
  role: 'Менеджер',
  avatar: '',
  avatarBg: '#e8effa',
  avatarColor: '#1a56db',
  skillTags: '',
};

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() || '').join('') || 'СП';
}

function toForm(s?: Specialist): SpecialistForm {
  if (!s) return emptyForm;
  return {
    name: s.name,
    role: s.role,
    avatar: s.avatar,
    avatarBg: s.avatarBg,
    avatarColor: s.avatarColor,
    skillTags: s.skillTags.join(', '),
  };
}

export default function AdminSpecialistsPage() {
  useStaffGuard();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Specialist | null>(null);
  const [form, setForm] = useState<SpecialistForm>(emptyForm);

  const { data: specialists = [], isLoading } = useQuery<Specialist[]>({
    queryKey: ['specialists'],
    queryFn: api.specialists.list,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['specialists'] });

  const payload = (): Omit<Specialist, 'id'> => ({
    name: form.name,
    role: form.role,
    rating: editing?.rating ?? 5.0,
    reviewCount: editing?.reviewCount ?? 0,
    programTags: editing?.programTags ?? [],
    skillTags: form.skillTags.split(',').map((t) => t.trim()).filter(Boolean),
    avatar: form.avatar || initials(form.name),
    avatarBg: form.avatarBg,
    avatarColor: form.avatarColor,
    startDate: editing?.startDate ?? new Date().toISOString().slice(0, 10),
  });

  const createMutation = useMutation({
    mutationFn: () => api.admin.specialists.create(payload()),
    onSuccess: () => { invalidate(); setFormOpen(false); toast.success('Специалист добавлен'); },
  });

  const updateMutation = useMutation({
    mutationFn: (id: string) => api.admin.specialists.update(id, payload()),
    onSuccess: () => { invalidate(); setFormOpen(false); toast.success('Специалист обновлён'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.admin.specialists.remove(id),
    onSuccess: () => { invalidate(); toast.success('Специалист удалён'); },
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setFormOpen(true); };
  const openEdit = (s: Specialist) => { setEditing(s); setForm(toForm(s)); setFormOpen(true); };
  const handleDelete = (s: Specialist) => {
    if (confirm(`Удалить специалиста «${s.name}»?`)) deleteMutation.mutate(s.id);
  };
  const handleSave = () => {
    if (!form.name.trim()) { toast.error('Укажите имя специалиста'); return; }
    if (editing) updateMutation.mutate(editing.id);
    else createMutation.mutate();
  };

  const set = (patch: Partial<SpecialistForm>) => setForm((prev) => ({ ...prev, ...patch }));

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-1">Специалисты</h1>
          <p className="text-sm text-[#6b7280]">Команда консультантов и тренеров — {specialists.length} человек</p>
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
                <th className="p-3">Специалист</th>
                <th className="p-3">Роль</th>
                <th className="p-3">Рейтинг</th>
                <th className="p-3">Навыки</th>
                <th className="p-3 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {specialists.map((s) => (
                <tr key={s.id} className="border-b border-[#f3f4f6] last:border-0">
                  <td className="p-3">
                    <span className="flex items-center gap-2 font-medium text-[#111827]">
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: s.avatarColor }}>
                        {s.avatar}
                      </span>
                      {s.name}
                    </span>
                  </td>
                  <td className="p-3 text-[#6b7280]">{s.role}</td>
                  <td className="p-3 text-[#6b7280]">{s.rating.toFixed(1)} ★ ({s.reviewCount})</td>
                  <td className="p-3 text-[#6b7280] max-w-[220px] truncate">{s.skillTags.join(', ')}</td>
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
        title={editing ? 'Редактировать специалиста' : 'Новый специалист'}
        actions={
          <div className="flex gap-3">
            <button onClick={() => setFormOpen(false)} className="glass-btn text-sm">Отмена</button>
            <Button onClick={handleSave} loading={createMutation.isPending || updateMutation.isPending}>Сохранить</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#6b7280] mb-1 block">Имя *</label>
            <input className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm" value={form.name} onChange={(e) => set({ name: e.target.value })} placeholder="Например, Иван Петров" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#6b7280] mb-1 block">Роль</label>
              <input className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm" value={form.role} onChange={(e) => set({ role: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[#6b7280] mb-1 block">Аватар (инициалы)</label>
              <input className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm" value={form.avatar} onChange={(e) => set({ avatar: e.target.value })} placeholder="Авто из имени" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#6b7280] mb-1 block">Цвет фона аватара (hex)</label>
              <input className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm" value={form.avatarBg} onChange={(e) => set({ avatarBg: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-[#6b7280] mb-1 block">Цвет текста аватара (hex)</label>
              <input className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm" value={form.avatarColor} onChange={(e) => set({ avatarColor: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-xs text-[#6b7280] mb-1 block">Навыки (через запятую)</label>
            <input className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 text-sm" value={form.skillTags} onChange={(e) => set({ skillTags: e.target.value })} placeholder="НДС, ЕГАИС, Отчёты" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
