'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, Lightbulb, RefreshCw, Eye, Award } from 'lucide-react';
import type {
  Lesson,
  LessonActivity,
  TrainerResult,
  CaseOption,
} from '@/types';
import { useHydrated } from '@/lib/hooks/useHydrated';
import { useSchoolProgress } from '@/stores/schoolProgress';
import { shuffle } from '@/lib/utils';

interface Props {
  lesson: Lesson;
  onComplete: () => void;
}

type Phase = 'intro' | 'playing' | 'result';

/* =========================================================================
 * Модель шага тренажёра
 * ========================================================================= */

interface StepOption {
  label: string;
  correct: boolean;
  hint?: string;
}

interface StepModel {
  prompt: string;
  context: string;
  options: StepOption[];
  feedback: string;
}

function buildSteps(activity: LessonActivity): StepModel[] {
  switch (activity.type) {
    case 'quiz':
      return (activity.quiz?.questions ?? []).map((q) => ({
        prompt: q.question,
        context: '',
        options: q.options.map((label, idx) => ({
          label,
          correct: idx === q.correct,
          hint: undefined,
        })),
        feedback: q.commentary,
      }));

    case 'sprint':
      return (activity.sprint?.statements ?? []).map((s) => ({
        prompt: s.text,
        context: 'Верно или неверно?',
        options: [
          { label: 'Верно', correct: s.isCorrect },
          { label: 'Неверно', correct: !s.isCorrect },
        ],
        feedback: s.explanation,
      }));

    case 'match':
      return (activity.match?.pairs ?? []).map((p, _i, arr) => {
        const distractors = shuffle(arr.filter((x) => x.id !== p.id)).slice(0, 3);
        const defs = shuffle([p.definition, ...distractors.map((d) => d.definition)]);
        return {
          prompt: `Найдите определение: «${p.term}»`,
          context: '',
          options: defs.map((d) => ({
            label: d,
            correct: d === p.definition,
            hint: undefined,
          })),
          feedback: `«${p.term}» — это ${p.definition}.`,
        };
      });

    case 'chain': {
      const texts = (activity.chain?.steps ?? []).map((s) => s.text);
      return texts.map((text, i) => {
        const remaining = texts.slice(i);
        return {
          prompt: `Какой следующий шаг процедуры?`,
          context: `Восстановите правильный порядок. Выберите шаг ${i + 1}.`,
          options: shuffle(remaining).map((t) => ({
            label: t,
            correct: t === text,
            hint: undefined,
          })),
          feedback: text,
        };
      });
    }

    case 'case':
      return (activity.caseStudy?.steps ?? []).map((s) => ({
        prompt: s.question,
        context: s.situation,
        options: s.options.map((o: CaseOption) => ({
          label: o.text,
          correct: o.correct,
          hint: o.hint,
        })),
        feedback: s.commentary,
      }));

    default:
      return [];
  }
}

function typeLabel(t: string): string {
  const map: Record<string, string> = {
    quiz: 'Квиз',
    sprint: 'Спринт',
    match: 'Сопоставление',
    chain: 'Порядок шагов',
    case: 'Кейс',
  };
  return map[t] ?? t;
}

function stepCount(lesson: Lesson): number {
  const a = lesson.activity;
  switch (a.type) {
    case 'quiz': return a.quiz?.questions.length ?? 0;
    case 'sprint': return a.sprint?.statements.length ?? 0;
    case 'match': return a.match?.pairs.length ?? 0;
    case 'chain': return a.chain?.steps.length ?? 0;
    case 'case': return a.caseStudy?.steps.length ?? 0;
    default: return 0;
  }
}

function restart(lessonId: string, setStartStep: (n: number) => void, setResult: (r: TrainerResult | null) => void, setPhase: (p: Phase) => void) {
  useSchoolProgress.getState().clearPosition(lessonId);
  setStartStep(0);
  setResult(null);
  setPhase('playing');
}

/* =====================================================================
 * LessonView — точка входа: интро → игра → результат
 * ===================================================================== */

export default function LessonView({ lesson, onComplete }: Props) {
  const activity = lesson.activity;
  const hydrated = useHydrated();

  const [phase, setPhase] = useState<Phase>('intro');
  const [startStep, setStartStep] = useState(0);
  const [result, setResult] = useState<TrainerResult | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    const store = useSchoolProgress.getState();
    if (store.completed[lesson.id]) return;
    const pos = store.positions[lesson.id];
    if (pos && pos > 0 && activity.type !== 'match') {
      setStartStep(pos);
      setPhase('playing');
    }
  }, [hydrated, lesson.id, activity.type]);

  if (lesson.stub) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="text-3xl mb-2">🔜</div>
        <p className="text-sm text-[#6b7280] leading-relaxed">Скоро вы сможете потренироваться здесь.</p>
      </div>
    );
  }

  if (phase === 'intro') {
    const n = stepCount(lesson);
    return (
      <div className="glass-card p-6">
        <div className="mb-4">
          <span className="px-2 py-0.5 rounded-full bg-[#f0f4ff] text-[#1a56db] text-[10px] font-semibold">
            Тренажёр · {typeLabel(activity.type)}
          </span>
        </div>
        <h2 className="text-lg font-semibold text-[#111827] mb-2">Потренируйтесь на реальном обращении</h2>
        {activity.intro && <p className="text-sm text-[#6b7280] leading-relaxed mb-4">{activity.intro}</p>}
        <div className="flex flex-wrap gap-2 text-[11px] text-[#6b7280] mb-6">
          <span className="px-2 py-1 rounded-lg bg-[#f3f4f6] font-semibold">{n > 0 ? n : '—'} шагов</span>
          <span className="px-2 py-1 rounded-lg bg-[#f3f4f6] font-semibold">до {lesson.xpReward} XP</span>
          <span className="px-2 py-1 rounded-lg bg-[#f3f4f6] font-semibold">{lesson.durationMinutes} мин</span>
        </div>
        {startStep > 0 && (
          <div className="mb-4 p-3 rounded-lg bg-[#ecfdf5] border border-[#a7f3d0] text-sm text-[#065f46]">
            Продолжаем с шага {startStep + 1}.
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setPhase('playing')} className="glass-btn">
            {startStep > 0 ? 'Продолжить' : 'Начать'} <ArrowRight className="w-4 h-4" />
          </button>
          {startStep > 0 && (
            <button
              onClick={() => {
                useSchoolProgress.getState().clearPosition(lesson.id);
                setStartStep(0);
                setPhase('playing');
              }}
              className="glass-btn"
            >
              <RefreshCw className="w-4 h-4" /> Начать заново
            </button>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'result' && result) {
    const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
    const passed = pct >= 70;
    return (
      <div className="glass-card p-6 text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-[#1a56db] to-[#0d9488]">
          <Award className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#111827] mb-1">{passed ? 'Отлично' : 'Хорошая попытка'}</h2>
        <p className="text-sm text-[#6b7280] mb-4">
          Верных ответов: {result.score} из {result.total}
          {result.misses > 0 ? ` · ошибок: ${result.misses}` : ''}
        </p>
        <div className="w-full max-w-xs mx-auto bg-[#f3f4f6] rounded-full h-2.5 mb-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${passed ? 'bg-[#059669]' : 'bg-[#d97706]'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className={`text-xs mb-6 ${passed ? 'text-[#059669]' : 'text-[#d97706]'}`}>
          {passed ? 'Прохождение засчитано' : 'Попробуйте ещё раз, чтобы закрепить'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {!passed && (
            <button onClick={() => restart(lesson.id, setStartStep, setResult, setPhase)} className="glass-btn">
              <RefreshCw className="w-4 h-4" /> Пройти ещё раз
            </button>
          )}
          <button onClick={onComplete} className="glass-btn">
            Завершить урок <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Trainer
      lesson={lesson}
      startStep={startStep}
      onProgress={(s) => useSchoolProgress.getState().setPosition(lesson.id, s)}
      onFinish={(r) => {
        useSchoolProgress.getState().clearPosition(lesson.id);
        setResult(r);
        setPhase('result');
      }}
    />
  );
}

/* =====================================================================
 * Trainer — стейт-машина шагов (общий для всех пяти типов)
 * ===================================================================== */

function Trainer({
  lesson,
  startStep,
  onProgress,
  onFinish,
}: {
  lesson: Lesson;
  startStep: number;
  onProgress: (step: number) => void;
  onFinish: (r: TrainerResult) => void;
}) {
  const steps = useMemo(() => buildSteps(lesson.activity), [lesson.activity]);
  const [stepNo, setStepNo] = useState(startStep);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => onProgress(stepNo), [stepNo, onProgress]);

  if (!steps.length || steps.length === 0) {
    return <div className="glass-card p-6 text-center text-[#6b7280]">Нет данных для тренажёра</div>;
  }

  const total = steps.length;
  const done = stepNo >= total;
  const step = steps[Math.min(stepNo, total - 1)];

  const answered = picked !== null || gaveUp;
  const isCorrect = !gaveUp && picked !== null && !!steps[stepNo]?.options[picked]?.correct;

  const handlePick = (idx: number) => {
    if (answered) return;
    setPicked(idx);
    if (steps[stepNo].options[idx].correct) setScore((s) => s + 1);
    else setMisses((m) => m + 1);
  };

  const next = () => {
    const n = stepNo + 1;
    if (n >= total) {
      onFinish({ score, total, misses });
      return;
    }
    setStepNo(n);
    setPicked(null);
    setHintUsed(false);
    setGaveUp(false);
  };

  return (
    <div className="glass-card p-6">
      {/* header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded-full bg-[#f0f4ff] text-[#1a56db] text-[10px] font-semibold">
          Шаг {Math.min(stepNo + 1, total)} из {total}
        </span>
        <div className="flex-1" />
        {!answered && !hintUsed && (
          <button
            onClick={() => setHintUsed(true)}
            className="text-[11px] px-2 py-1 rounded-lg bg-[#fefce8] text-[#ca8a04] font-semibold hover:bg-[#fef3c7] transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5 inline -mt-0.5" /> Подсказка
          </button>
        )}
      </div>

      {/* progress */}
      <div className="w-full bg-[#f3f4f6] rounded-full h-1.5 mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#1a56db] to-[#0d9488] transition-all duration-300"
          style={{ width: `${(Math.min(stepNo, total) / total) * 100}%` }}
        />
      </div>

      {!done ? (
        <>
          {step.context && (
            <div className="p-4 rounded-lg bg-[#fefce8] border border-[#fde68a] text-sm mb-4 leading-relaxed text-[#854d0e]">
              {step.context}
            </div>
          )}
          <h3 className="text-lg font-semibold text-[#111827] mb-5">{step.prompt}</h3>

          <div className="space-y-3">
            {step.options.map((o, idx) => {
              let cls = 'w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ';
              if (answered) {
                if (o.correct) cls += 'border-[#059669] bg-[#ecfdf5] text-[#059669] font-medium';
                else if (idx === picked) cls += 'border-[#dc2626] bg-[#fef2f2] text-[#dc2626]';
                else if (gaveUp) cls += 'border-[#e5e7eb] opacity-50';
                else cls += 'border-[#e5e7eb] opacity-50';
              } else {
                cls += 'border-[#e5e7eb] hover:border-[#1a56db] hover:bg-[#e8effa] cursor-pointer';
              }
              return (
                <button key={idx} disabled={answered} onClick={() => handlePick(idx)} className={cls}>
                  {o.label}
                </button>
              );
            })}
          </div>

          {hintUsed && !answered && (
            <div className="mt-4 p-3 rounded-lg bg-[#f0f4ff] border border-[#bfdbfe] text-sm text-[#1e40af]">
              <Lightbulb className="w-4 h-4 inline -mt-0.5 mr-1" />
              {step.options.find((o) => o.correct)?.hint ?? 'Посмотрите пошаговую инструкцию — ответ там.'}
            </div>
          )}

          {answered && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm leading-relaxed ${isCorrect ? 'border border-[#a7f3d0] bg-[#ecfdf5] text-[#065f46]' : 'border border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]'}`}
            >
              <p className="font-semibold mb-1">{isCorrect ? 'Верно' : 'Неверно'}</p>
              <p>{step.feedback}</p>
            </div>
          )}

          {answered && (
            <div className="flex flex-wrap gap-2 mt-4">
              {isCorrect ? (
                <button onClick={next} className="glass-btn">
                  {stepNo + 1 >= total ? 'К результату' : 'Далее'} <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setPicked(null);
                      setHintUsed(false);
                    }}
                    className="glass-btn"
                  >
                    Попробовать снова
                  </button>
                  {!gaveUp && stepNo + 1 < total && (
                    <button onClick={() => setGaveUp(true)} className="glass-btn">
                      <Eye className="w-4 h-4" /> Показать решение
                    </button>
                  )}
                  {!gaveUp && stepNo + 1 >= total && (
                    <button onClick={() => setGaveUp(true)} className="glass-btn">
                      <Eye className="w-4 h-4" /> Показать решение
                    </button>
                  )}
                  {gaveUp && (
                    <button onClick={next} className="glass-btn">
                      {stepNo + 1 >= total ? 'К результату' : 'Далее'} <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-[#6b7280]">
          <Award className="w-10 h-10 mx-auto mb-3 text-[#059669]" />
          <p className="font-semibold text-[#111827]">Все шаги пройдены</p>
        </div>
      )}
    </div>
  );
}