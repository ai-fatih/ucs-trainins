'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import type { Slot, Specialist } from '@/types';
import { useStaffGuard } from '@/components/admin/useStaffGuard';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { CalendarClock } from 'lucide-react';

export default function AdminSchedulePage() {
  useStaffGuard();
  const queryClient = useQueryClient();

  const { data: slots = [], isLoading } = useQuery<Slot[]>({
    queryKey: ['admin-schedule'],
    queryFn: api.admin.schedule.list,
  });

  const { data: specialists = [] } = useQuery<Specialist[]>({
    queryKey: ['specialists'],
    queryFn: api.specialists.list,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) => api.admin.schedule.setSlot(id, isAvailable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-schedule'] });
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      toast.success('Слот обновлён');
    },
  });

  const byDate = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const s of slots) {
      const list = map.get(s.date) || [];
      list.push(s);
      map.set(s.date, list);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [slots]);

  const nameOf = (id: string) => specialists.find((s) => s.id === id)?.name || 'Специалист';

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-1 flex items-center gap-2">
            <CalendarClock className="w-7 h-7 text-[#1a56db]" /> Расписание
          </h1>
          <p className="text-sm text-[#6b7280]">Доступность слотов для записи — клик переключает слот</p>
        </div>
        <Link href="/admin/dashboard" className="glass-btn text-sm">KPI</Link>
      </div>

      {isLoading ? (
        <TableRowSkeleton cols={4} />
      ) : (
        <div className="space-y-6">
          {byDate.map(([date, dateSlots]) => (
            <div key={date} className="glass-card p-5">
              <h2 className="text-base font-semibold text-[#111827] mb-4">
                {new Date(date + 'T00:00:00').toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })}
                <span className="ml-2 text-xs font-normal text-[#9ca3af]">{dateSlots.length} слотов • {dateSlots.filter((s) => s.isAvailable).length} доступно</span>
              </h2>
              <div className="grid gap-2">
                {dateSlots
                  .slice()
                  .sort((a, b) => a.specialistId.localeCompare(b.specialistId) || a.time.localeCompare(b.time))
                  .map((s) => (
                    <button
                      key={s.id}
                      onClick={() => toggleMutation.mutate({ id: s.id, isAvailable: !s.isAvailable })}
                      className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm transition-all ${
                        s.isAvailable
                          ? 'border-[#d1fae5] bg-[#ecfdf5] text-[#059669] hover:bg-[#d1fae5]'
                          : 'border-[#fee2e2] bg-[#fef2f2] text-[#dc2626] hover:bg-[#fee2e2]'
                      }`}
                    >
                      <span className="font-medium">{nameOf(s.specialistId)}</span>
                      <span className="flex items-center gap-3">
                        <span>{s.time}</span>
                        <span className={`w-2.5 h-2.5 rounded-full ${s.isAvailable ? 'bg-[#22c55e]' : 'bg-[#dc2626]'}`} />
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
