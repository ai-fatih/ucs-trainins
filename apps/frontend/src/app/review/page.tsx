'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Stars } from '@/components/ui/Stars';

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const router = useRouter();

  const labels = ['Ужасно', 'Плохо', 'Нормально', 'Хорошо', 'Отлично!'];

  const handleSubmit = () => {
    if (rating === 0) { toast.error('Поставьте оценку'); return; }
    toast.success('Спасибо за оценку!');
    router.push('/bookings');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-lg font-bold">Консультация завершена!</h2>
          <p className="text-sm text-[#6b7280]">Как прошла консультация с Иваном Петровым?</p>
        </div>

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

        <div className="flex gap-4">
          <Button variant="secondary" className="flex-1" onClick={() => router.push('/bookings')}>Пропустить</Button>
          <Button variant="primary" size="lg" className="flex-[2]" onClick={handleSubmit}>Отправить</Button>
        </div>
      </div>
    </div>
  );
}
