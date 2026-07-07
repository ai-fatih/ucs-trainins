'use client';
import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import type { Service, Slot } from '@/types';
import { useBookingStore } from '@/stores/booking';
import { useNotificationStore } from '@/stores/notifications';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { TableRowSkeleton } from '@/components/ui/Skeleton';

function StepIndicator({ step }: { step: number }) {
  const steps = ['Услуга', 'Дата и время', 'Подтверждение'];
  return (
    <div className="flex justify-center items-center gap-2 mb-8 text-sm">
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex items-center gap-2">
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${i < step ? 'bg-[#059669] text-white' : i === step ? 'bg-[#1a56db] text-white' : 'bg-[#f3f4f6] text-[#9ca3af]'}`}>
              {i < step ? '✓' : i + 1}
            </span>
            <span className={`hidden sm:inline text-xs ${i === step ? 'text-[#1a56db] font-semibold' : i < step ? 'text-[#059669]' : 'text-[#9ca3af]'}`}>{label}</span>
          </div>
          {i < 2 && <div className="w-6 h-px bg-[#e5e7eb]" />}
        </React.Fragment>
      ))}
    </div>
  );
}

function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const store = useBookingStore();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState('2026-07-03');

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: api.services.list,
  });

  const { data: slots = [], isLoading: slotsLoading } = useQuery<Slot[]>({
    queryKey: ['slots', selectedDate],
    queryFn: () => api.slots.getByDate(selectedDate),
  });

  // Auto-select service from URL param
  const preselectedServiceId = searchParams.get('serviceId');
  if (preselectedServiceId && services.length && !store.selectedService) {
    const s = services.find((sv) => sv.id === preselectedServiceId);
    if (s) store.selectService(s);
  }

  const createBooking = useMutation({
    mutationFn: api.bookings.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });

  const handleConfirm = async () => {
    await createBooking.mutateAsync({
      serviceName: store.selectedService?.name || '',
      date: selectedDate,
      time: store.selectedSlot?.time || '',
      durationMinutes: store.selectedService?.durationMinutes || 30,
      isFree: store.selectedService?.isFree ?? true,
      topic: store.topic,
    });
    addNotification({
      id: `n${Date.now()}`,
      title: '✓ Запись создана',
      body: `${store.selectedService?.name} на ${selectedDate} в ${store.selectedSlot?.time}`,
      type: 'booking',
      read: false,
      createdAt: new Date().toISOString(),
    });
    toast.success('✓ Запись создана! Уведомление отправлено на email и в Telegram.', { duration: 5000 });
    store.reset();
    router.push('/bookings');
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <h1 className="section-title">Запись на консультацию</h1>
      <StepIndicator step={store.step} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {/* Step 0: Service */}
          {store.step === 0 && (
            <div className="space-y-3">
              {servicesLoading
                ? Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={2} />)
                : services.map((s) => (
                    <Card key={s.id} hoverable onClick={() => { store.selectService(s); toast.success(`Выбрано: ${s.name}`); }}>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md flex items-center justify-center text-xl" style={{ background: s.iconBg }}>{s.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{s.name}</div>
                          <div className="text-xs text-[#6b7280]">{(s.durationMinutes ?? 0) > 0 ? `${s.durationMinutes} мин` : 'Видео'} {s.isFree ? '• Бесплатно' : `• ${s.priceRub} ₽`}</div>
                        </div>
                      </div>
                    </Card>
                  ))
              }
            </div>
          )}

          {/* Step 1: Date & Time */}
          {store.step === 1 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm">←</Button>
                <span className="font-semibold text-sm">Июль 2026</span>
                <Button variant="ghost" size="sm">→</Button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
                  <div key={d} className="text-center text-xs font-semibold text-[#6b7280] py-2 uppercase">{d}</div>
                ))}
                {[29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((d, i) => {
                  const date = `2026-07-${String(d).padStart(2, '0')}`;
                  const isSelected = date === selectedDate;
                  const isToday = d === 3;
                  const disabled = i < 2 || d === 5 || d === 12;
                  return (
                    <button
                      key={d}
                      disabled={disabled}
                      onClick={() => setSelectedDate(date)}
                      className={`text-center py-2.5 text-sm rounded-sm transition-all border-none cursor-pointer ${
                        isSelected ? 'bg-[#1a56db] text-white font-bold' : isToday ? 'font-bold text-[#1a56db]' : disabled ? 'text-[#d1d5db] cursor-not-allowed' : 'hover:bg-[#f3f4f6]'
                      } ${d >= 1 && d <= 4 ? 'bg-[#d1fae5] text-[#059669] font-medium' : ''} ${isSelected && d >= 1 && d <= 4 ? '!bg-[#1a56db] !text-white' : ''}`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>

              <Card>
                <h3 className="text-sm font-semibold mb-3">Доступное время — {selectedDate}</h3>
                <div className="grid grid-cols-4 gap-2">
                  {slotsLoading
                    ? Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={1} />)
                    : slots.length === 0
                      ? <p className="text-sm text-[#6b7280] col-span-4">Нет доступных слотов</p>
                      : slots.map((slot) => (
                          <button
                            key={slot.id}
                            disabled={!slot.isAvailable}
                            onClick={() => store.selectSlot(slot)}
                            className={`py-2 text-sm text-center rounded-md transition-all border cursor-pointer ${
                              store.selectedSlot?.id === slot.id ? 'bg-[#1a56db] text-white border-[#1a56db]' :
                              slot.isAvailable ? 'border-[#e5e7eb] hover:border-[#1a56db] hover:bg-[#e8effa]' : 'bg-[#f3f4f6] text-[#d1d5db] cursor-not-allowed border-[#f3f4f6]'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))
                  }
                </div>
              </Card>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {store.step === 2 && (
            <Card>
              <h3 className="font-semibold mb-4">Детали записи</h3>

              <div className="bg-[#e8effa] p-3 rounded-md mb-4">
                <label className="block text-xs font-medium text-[#374151] mb-1.5">Сотрудник компании (для записи)</label>
                <select className="form-input text-sm" value={store.selectedEmployee} onChange={(e) => store.setSelectedEmployee(e.target.value)}>
                  <option value="">— Выберите сотрудника —</option>
                  <option value="e1">Анна Смирнова — Управляющая</option>
                  <option value="e2">Павел Иванов — Шеф-повар</option>
                  <option value="e3">Елена Козлова — Бухгалтер</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                <div><span className="text-[#6b7280]">Услуга</span><div className="font-semibold">{store.selectedService?.name}</div></div>
                <div><span className="text-[#6b7280]">Длительность</span><div className="font-semibold">{(store.selectedService?.durationMinutes ?? 0) > 0 ? `${store.selectedService?.durationMinutes} мин` : 'Видео'}</div></div>
                <div><span className="text-[#6b7280]">Дата</span><div className="font-semibold">{selectedDate}</div></div>
                <div><span className="text-[#6b7280]">Время</span><div className="font-semibold">{store.selectedSlot?.time}</div></div>
                <div className="col-span-2"><span className="text-[#6b7280]">Стоимость</span><div className="font-semibold text-[#059669]">{store.selectedService?.isFree ? 'Бесплатно (договор активен)' : `${store.selectedService?.priceRub} ₽`}</div></div>
              </div>

              <Textarea
                label="Описание вопроса (необязательно)"
                rows={3}
                placeholder="Опишите, что хотите обсудить — специалист подготовится"
                value={store.topic}
                onChange={(e) => store.setTopic(e.target.value)}
              />
            </Card>
          )}
        </div>

        {/* Right sidebar */}
        <div>
          <Card className="sticky top-24">
            <h3 className="font-semibold mb-3">Выбранное</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-[#6b7280]">Услуга:</span><span className="font-medium">{store.selectedService?.name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-[#6b7280]">Дата:</span><span className="font-medium">{store.selectedSlot ? `${selectedDate} ${store.selectedSlot.time}` : '—'}</span></div>
              <div className="flex justify-between"><span className="text-[#6b7280]">Стоимость:</span><span className="font-medium text-[#059669]">{store.selectedService?.isFree ? 'Бесплатно' : `${store.selectedService?.priceRub} ₽`}</span></div>
            </div>

            <hr className="my-4 border-[#e5e7eb]" />

            <div className="flex gap-3">
              {store.step > 0 && <Button variant="secondary" onClick={() => store.setStep(store.step - 1)}>Назад</Button>}
              {store.step < 2 ? (
                <Button
                  variant="primary"
                  className="flex-1"
                  disabled={
                    (store.step === 0 && !store.selectedService) ||
                    (store.step === 1 && !store.selectedSlot)
                  }
                  onClick={() => store.setStep(store.step + 1)}
                >
                  Далее
                </Button>
              ) : (
                <Button variant="success" className="flex-1" onClick={handleConfirm} disabled={createBooking.isPending}>
                  {createBooking.isPending ? 'Сохранение...' : 'Подтвердить запись'}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense>
      <BookingPageContent />
    </Suspense>
  );
}
