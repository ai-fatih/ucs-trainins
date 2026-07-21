'use client';
import React, { useState } from 'react';
import { Gamepad2, RefreshCw } from 'lucide-react';
import type { QuizQuestion, QuizResult } from '@/types';
import quizData from '@/data/quiz.json';

const QUESTIONS_PER_ROUND = 5;

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<QuizResult[]>([]);

  const questions = (quizData as QuizQuestion[]).slice(0, QUESTIONS_PER_ROUND);

  if (!started) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
        <div className="glass-card p-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] inline-flex items-center justify-center text-white mb-6">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Викторина (Игра)</h1>
          <p className="text-sm text-[#6b7280] mb-6">Проверьте свои знания по работе в rkeeper</p>
          <p className="text-xs text-[#9ca3af] mb-6">{QUESTIONS_PER_ROUND} вопросов • Пользовательский уровень</p>
          <button onClick={() => setStarted(true)} className="glass-btn text-base px-8 py-3">
            Начать викторину
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percent = Math.round((score / QUESTIONS_PER_ROUND) * 100);
    const grade = percent >= 80 ? 'Отлично!' : percent >= 60 ? 'Хорошо' : percent >= 40 ? 'Неплохо' : 'Стоит подучить';
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
        <div className="glass-card p-8">
          <div className={`w-16 h-16 rounded-2xl inline-flex items-center justify-center text-white mb-4 ${percent >= 60 ? 'bg-gradient-to-br from-[#0d9488] to-[#059669]' : 'bg-gradient-to-br from-[#f59e06] to-[#dc2626]'}`}>
            <span className="text-2xl font-bold">{score}</span>
          </div>
          <h2 className="text-xl font-bold mb-1">{grade}</h2>
          <p className="text-sm text-[#6b7280] mb-6">Правильных ответов: {score} из {QUESTIONS_PER_ROUND}</p>
          <div className="space-y-2 mb-6 text-left">
            {answers.map((a, i) => (
              <div key={i} className={`p-3 rounded-lg text-sm ${a.correct ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fef2f2] text-[#dc2626]'}`}>
                <span className="mr-2">{a.correct ? '✓' : '✗'}</span>
                {questions[i].question}
              </div>
            ))}
          </div>
          <button
            onClick={() => { setStarted(false); setCurrent(0); setScore(0); setSelected(null); setShowResult(false); setAnswers([]); }}
            className="glass-btn"
          >
            <RefreshCw className="w-4 h-4" /> Пройти заново
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.correct;
    if (correct) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, { questionId: q.id, selected: idx, correct }]);
  };

  const next = () => {
    if (current < QUESTIONS_PER_ROUND - 1) {
      setCurrent(prev => prev + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="max-w-[600px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Викторина (Игра)</h1>
        <div className="flex items-center gap-2 text-sm text-[#6b7280]">
          <span className="font-semibold text-[#1a56db]">{score}</span> / {current + (selected !== null ? 1 : 0)}
          <span className="text-[#9ca3af]">•</span>
          Вопрос {current + 1} из {QUESTIONS_PER_ROUND}
        </div>
      </div>

      <div className="glass-card p-6">
        <div className="text-sm text-[#6b7280] mb-2">Вопрос {current + 1}</div>
        <h3 className="text-lg font-semibold mb-6">{q.question}</h3>
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let cls = 'w-full text-left px-4 py-3 rounded-lg border transition-all cursor-pointer text-sm ';
            if (selected === null) {
              cls += 'border-[#e5e7eb] hover:border-[#1a56db] hover:bg-[#e8effa]';
            } else if (idx === q.correct) {
              cls += 'border-[#059669] bg-[#ecfdf5] text-[#059669] font-medium';
            } else if (idx === selected && idx !== q.correct) {
              cls += 'border-[#dc2626] bg-[#fef2f2] text-[#dc2626]';
            } else {
              cls += 'border-[#e5e7eb] opacity-50';
            }
            return (
              <button key={idx} disabled={selected !== null} onClick={() => handleAnswer(idx)} className={cls}>
                {idx + 1}. {opt}
              </button>
            );
          })}
        </div>
        {selected !== null && (
          <button onClick={next} className="glass-btn mt-6 w-full justify-center">
            {current < QUESTIONS_PER_ROUND - 1 ? 'Следующий вопрос →' : 'Узнать результат'}
          </button>
        )}
      </div>
    </div>
  );
}
