'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Stars } from '@/components/ui/Stars';
import toast from 'react-hot-toast';

interface QualitySurveyModalProps {
  open: boolean;
  onClose: () => void;
  specialistName?: string;
  onComplete: () => void;
}

const QUESTIONS = [
  { id: 'punctuality', label: 'Пунктуальность' },
  { id: 'usefulness', label: 'Полезность консультации' },
  { id: 'overall', label: 'Общая оценка' },
];

export function QualitySurveyModal({ open, onClose, specialistName, onComplete }: QualitySurveyModalProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = QUESTIONS.every((q) => answers[q.id] && answers[q.id] > 0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!allAnswered) { toast.error('Ответьте на все вопросы'); return; }
    setSubmitted(true);
    toast.success('Спасибо за обратную связь!');
    onComplete();
    setTimeout(() => { setSubmitted(false); setAnswers({}); setComment(''); onClose(); }, 1000);
  };

  const handleClose = () => {
    setAnswers({});
    setComment('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={submitted ? 'Спасибо!' : `Опрос качества${specialistName ? ` — ${specialistName}` : ''}`}
      actions={
        !submitted ? (
          <>
            <button onClick={handleClose} className="glass-btn text-sm">Закрыть</button>
            <button onClick={handleSubmit} disabled={!allAnswered} className="glass-btn text-sm disabled:opacity-50">
              Отправить
            </button>
          </>
        ) : undefined
      }
    >
      {submitted ? (
        <div className="text-center py-4">
          <div className="text-5xl mb-3">🎉</div>
          <p className="text-sm text-[#6b7280]">Ваше мнение помогает нам становиться лучше!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {QUESTIONS.map((q) => (
            <div key={q.id}>
              <p className="text-sm font-medium mb-2">{q.label}</p>
              <Stars
                rating={answers[q.id] || 0}
                size="lg"
                interactive
                onChange={(val) => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
              />
            </div>
          ))}
          <div>
            <p className="text-sm font-medium mb-2">Комментарий (необязательно)</p>
            <textarea
              className="w-full border border-[#e5e7eb] rounded-lg p-3 text-sm resize-none"
              rows={3}
              placeholder="Что понравилось, что можно улучшить..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
