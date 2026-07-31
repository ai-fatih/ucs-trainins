'use client';
import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import type { Booking } from '@/types';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Stars } from '@/components/ui/Stars';

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const bookingId = searchParams.get('bookingId') || '';
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: api.bookings.list,
  });

  const booking = bookings.find((b) => b.id === bookingId);
  const specialistName = booking?.specialistName || searchParams.get('specialistName') || 'специалистом';

  const labels = ['Ужасно', 'Плохо', 'Нормально', 'Хорошо', 'Отлично!'];

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (bookingId) {
        await api.bookings.submitReview(bookingId, { rating, text });
      }
      await api.reviews.create({ bookingId: bookingId || 'external', rating, text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Спасибо за оценку!');
      router.push('/bookings');
    },
  });

  const handleSubmit = () => {
    if (rating === 0) { toast.error('Поставьте оценку'); return; }
    submitMutation.mutate();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-lg font-bold">Консультация завершена!</h2>
          <p className="text-sm text-[#6b7280]">Как прошла консультация с {specialistName}?</p>
        </div>

        {booking && (
          <div className="text-center mb-6 p-4 border border-[#e5e7eb] rounded-lg">
            <p className="text-xs text-[#6b7280]">{booking.serviceName}</p>
            <p className="text-sm text-[#111827] font-medium mt-1">
              {new Date(booking.date).toLocaleDateString('ru-RU')} • {booking.time}
            </p>
          </div>
        )}

        <div className="text-center mb-6 p-4 border border-[#e5e7eb] rounded-lg">
          <p className="text-sm text-[#6b7280] mb-3">Оцените качество консультации</p>
          <Stars rating={rating} size="lg" interactive onChange={setRating} />
          {rating > 0 && <p className="text-sm font-medium mt-2 text-[#6b7280]">{labels[rating - 1]}</p>}
        </div>

        <Textarea
          label="Комментарий (необязательно)"
          rows={4}
          placeholder="Расскажите подробнее о вашем опыте..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          hint="Ваш отзыв поможет другим клиентам выбрать специалиста"
        />

        <label className="flex items-start gap-3 mb-4 text-sm text-[#6b7280]">
          <input type="checkbox" required className="mt-0.5 shrink-0" />
          <span>Даю <Link href="/consent" className="text-[#1a56db] underline">согласие на обработку персональных данных</Link> в соответствии с <Link href="/privacy" className="text-[#1a56db] underline">Политикой конфиденциальности</Link> <span className="text-[#dc2626]">*</span></span>
        </label>
        <div className="flex gap-4">
          <Button variant="secondary" className="flex-1" onClick={() => router.push('/bookings')}>Пропустить</Button>
          <Button variant="primary" size="lg" className="flex-[2]" onClick={handleSubmit} disabled={submitMutation.isPending}>
            {submitMutation.isPending ? 'Отправка...' : 'Отправить'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense>
      <ReviewPageContent />
    </Suspense>
  );
}
