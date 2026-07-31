'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal } from '@/components/ui/Modal';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import type { Booking, Slot } from '@/types';
import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react';

interface RescheduleModalProps {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
  onConfirm: (date: string, time: string) => void;
}

const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

export function RescheduleModal({ open, onClose, booking, onConfirm }: RescheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const { data: allSlots = [] } = useQuery<Slot[]>({
    queryKey: ['slots', 'all'],
    queryFn: api.slots.list,
  });

  const { data: slots = [], isLoading: slotsLoading } = useQuery<Slot[]>({
    queryKey: ['slots', selectedDate],
    queryFn: () => api.slots.getByDate(selectedDate),
    enabled: !!selectedDate,
  });

  useEffect(() => {
    if (open) {
      setSelectedDate('');
      setSelectedSlot(null);
    }
  }, [open]);

  const availableDates = useMemo(() => {
    const set = new Set<string>();
    allSlots.forEach((s) => { if (s.isAvailable) set.add(s.date); });
    return set;
  }, [allSlots]);

  const calendarCells = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    return cells;
  }, [viewMonth]);

  const filteredSlots = booking?.specialistId
    ? slots.filter((s) => s.specialistId === booking.specialistId)
    : slots;

  const handleClose = () => {
    setSelectedSlot(null);
    onClose();
  };

  const onConfirmAction = () => {
    if (!selectedSlot || !selectedDate) return;
    onConfirm(selectedDate, selectedSlot.time);
    setSelectedSlot(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={`Перенос записи${booking ? ` — ${booking.serviceName}` : ''}`}
      actions={
        <div className="flex gap-3 w-full">
          <button onClick={handleClose} className="glass-btn flex-1 text-sm">Отмена</button>
          <button
            onClick={onConfirmAction}
            disabled={!selectedSlot}
            className="glass-btn flex-1 text-sm disabled:opacity-50"
          >
            <CalendarDays className="w-4 h-4" /> Подтвердить перенос
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setViewMonth((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1))} aria-label="Предыдущий месяц" className="glass-card p-1.5 hover:bg-[#f3f4f6] transition-colors cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
          <span className="text-sm font-semibold">{monthNames[viewMonth.getMonth()]} {viewMonth.getFullYear()}</span>
          <button onClick={() => setViewMonth((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1))} aria-label="Следующий месяц" className="glass-card p-1.5 hover:bg-[#f3f4f6] transition-colors cursor-pointer"><ArrowRight className="w-4 h-4" /></button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
            <div key={d} className="text-center text-[10px] font-semibold text-[#6b7280] py-1 uppercase">{d}</div>
          ))}
          {calendarCells.map((date, i) => {
            if (!date) return <div key={`blank-${i}`} />;
            const day = Number(date.slice(-2));
            const hasSlots = availableDates.has(date);
            const isSelected = date === selectedDate;
            const isPast = date < new Date().toISOString().slice(0, 10);
            const disabled = !hasSlots || isPast;
            return (
              <button
                key={date}
                disabled={disabled}
                onClick={() => { setSelectedDate(date); setSelectedSlot(null); }}
                className={`relative text-center py-2 text-xs rounded-lg transition-all border-none cursor-pointer ${
                  isSelected ? 'bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white font-bold shadow-md' :
                  disabled ? 'text-[#d1d5db] cursor-not-allowed' :
                  'hover:bg-[#f3f4f6] font-medium'
                }`}
              >
                {day}
                {hasSlots && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0d9488]" />
                )}
              </button>
            );
          })}
        </div>

        <div>
          <div className="text-xs font-semibold text-[#374151] mb-2">
            {selectedDate ? `Время на ${selectedDate}` : 'Выберите новую дату'}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {selectedDate && slotsLoading
              ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={1} />)
              : filteredSlots.length === 0
                ? <p className="text-xs text-[#6b7280] col-span-4">{selectedDate ? 'Нет доступных слотов' : '—'}</p>
                : filteredSlots.map((slot) => (
                    <button
                      key={slot.id}
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 text-xs text-center rounded-lg transition-all border cursor-pointer ${
                        selectedSlot?.id === slot.id ? 'bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white border-transparent shadow-md' :
                        slot.isAvailable ? 'glass-card hover:border-[#1a56db]' : 'bg-[#f3f4f6] text-[#d1d5db] cursor-not-allowed border-[#f3f4f6]'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
