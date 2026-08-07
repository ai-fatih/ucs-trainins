'use client';
import React, { useState } from 'react';
import { Check, X, ArrowRight, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import type { Lesson, QuizQuestion, MatchPair, Scenario, DecisionTree, DecisionChoice } from '@/types';
import configData from '@/data/school/config.json';
import matchGroupsData from '@/data/school/match-groups.json';
import { shuffle } from '@/lib/utils';

const config = configData as unknown as { questions: QuizQuestion[]; scenarios: Scenario[]; decisionTrees: DecisionTree[] };
const matchGroups = matchGroupsData as unknown as Record<string, MatchPair[]>;

type Phase = 'playing' | 'result';

interface Props {
  lesson: Lesson;
  onComplete: () => void;
}

export default function LessonView({ lesson, onComplete }: Props) {
  const activity = lesson.activity;

  if (lesson.stub) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="text-3xl mb-2">🔜</div>
        <p className="text-sm text-[#6b7280] leading-relaxed">
          Скоро вы сможете потренироваться здесь.
        </p>
      </div>
    );
  }

  if (activity.type === 'quiz') {
    const question = config.questions.find(q => q.id === activity.questionId);
    if (!question) return <div className="glass-card p-6 text-center text-[#6b7280]">Вопрос не найден</div>;
    return <QuizLesson question={question} onComplete={onComplete} />;
  }

  if (activity.type === 'sprint') {
    const stmts: { text: string; correct: boolean }[] = [];
    const ids = activity.sprintQuestionIds || [];
    ids.forEach(qid => {
      const q = config.questions.find(x => x.id === qid);
      if (q) {
        q.options.forEach((opt, i) => {
          stmts.push({ text: `«${q.question.slice(0, 60)}...» → ${opt}`, correct: i === q.correct });
        });
      }
    });
    if (stmts.length === 0) return <div className="glass-card p-6 text-center text-[#6b7280]">Нет вопросов для спринта</div>;
    return <SprintLesson statements={shuffle(stmts)} onComplete={onComplete} />;
  }

  if (activity.type === 'match') {
    const pairs = (activity.matchPairIds || []).flatMap(gid => matchGroups[gid] || []);
    if (pairs.length === 0) return <div className="glass-card p-6 text-center text-[#6b7280]">Нет пар для сопоставления</div>;
    return <MatchLesson pairs={pairs} onComplete={onComplete} />;
  }

  if (activity.type === 'chain') {
    const sc = config.scenarios.find(s => s.id === activity.scenarioId);
    if (!sc) return <div className="glass-card p-6 text-center text-[#6b7280]">Сценарий не найден</div>;
    return <ChainLesson scenario={sc} onComplete={onComplete} />;
  }

  if (activity.type === 'case') {
    const tree = config.decisionTrees.find(d => d.id === activity.decisionTreeId);
    if (!tree) return <div className="glass-card p-6 text-center text-[#6b7280]">Кейс не найден</div>;
    return <CaseLesson tree={tree} onComplete={onComplete} />;
  }

  return <div className="glass-card p-6 text-center text-[#6b7280]">Неизвестный тип урока</div>;
}

/* ===== Quiz ===== */
function QuizLesson({ question, onComplete }: { question: QuizQuestion; onComplete: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const handleClick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onComplete(), 1500);
  };
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded-full bg-[#f0f4ff] text-[#1a56db] text-[10px] font-semibold">Викторина</span>
      </div>
      <h3 className="text-lg font-semibold mb-6">{question.question}</h3>
      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          let cls = 'w-full text-left px-4 py-3 rounded-lg border transition-all cursor-pointer text-sm ';
          if (selected === null) cls += 'border-[#e5e7eb] hover:border-[#1a56db] hover:bg-[#e8effa]';
          else if (idx === question.correct) cls += 'border-[#059669] bg-[#ecfdf5] text-[#059669] font-medium';
          else if (idx === selected) cls += 'border-[#dc2626] bg-[#fef2f2] text-[#dc2626]';
          else cls += 'border-[#e5e7eb] opacity-50';
          return (
            <button key={idx} disabled={selected !== null} onClick={() => handleClick(idx)} className={cls}>
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="mt-4 p-3 rounded-lg bg-[#f0f4ff] border border-[#bfdbfe] text-sm text-[#1e40af]">
          {question.commentary}
        </div>
      )}
    </div>
  );
}

/* ===== Sprint ===== */
function SprintLesson({ statements, onComplete }: { statements: { text: string; correct: boolean }[]; onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const handle = (answer: boolean) => {
    if (done) return;
    const newScore = score + (statements[idx].correct === answer ? 15 : 0);
    setScore(newScore);
    if (idx < statements.length - 1) setIdx(prev => prev + 1);
    else { setDone(true); setTimeout(() => onComplete(), 500); }
  };
  if (done) return (
    <div className="glass-card p-6 text-center">
      <Check className="w-12 h-12 mx-auto text-[#059669] mb-4" />
      <p className="text-lg font-semibold">{score} / {statements.length * 15} очков</p>
    </div>
  );
  const s = statements[idx];
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded-full bg-[#fefce8] text-[#ca8a04] text-[10px] font-semibold">Спринт</span>
        <span className="text-xs text-[#6b7280]">{idx + 1} / {statements.length}</span>
      </div>
      <p className="text-base font-semibold mb-6">{s.text}</p>
      <div className="flex gap-3">
        <button onClick={() => handle(false)} className="glass-btn flex-1 justify-center py-4 border-[#dc2626] text-[#dc2626] hover:bg-[#fef2f2]"><X className="w-6 h-6" /> Неверно</button>
        <button onClick={() => handle(true)} className="glass-btn flex-1 justify-center py-4 border-[#059669] text-[#059669] hover:bg-[#ecfdf5]"><Check className="w-6 h-6" /> Верно</button>
      </div>
    </div>
  );
}

/* ===== Match ===== */
function MatchLesson({ pairs, onComplete }: { pairs: MatchPair[]; onComplete: () => void }) {
  const [matched, setMatched] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const [errorDef, setErrorDef] = useState<string | null>(null);
  const terms = shuffle(pairs.map(p => p.term));
  const defs = shuffle(pairs.map(p => p.definition));

  const handleDef = (def: string) => {
    if (!selectedTerm || matched.includes(def)) return;
    const pair = pairs.find(p => p.term === selectedTerm);
    if (pair && pair.definition === def) {
      const newMatched = [...matched, selectedTerm, def];
      setMatched(newMatched);
      setSelectedTerm(null);
      if (newMatched.length === pairs.length * 2) setTimeout(() => onComplete(), 500);
    } else {
      setErrors(prev => prev + 1);
      setErrorDef(def);
      setTimeout(() => setErrorDef(null), 600);
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded-full bg-[#f5f3ff] text-[#7c3aed] text-[10px] font-semibold">Сопоставление</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#6b7280] mb-2">Термины</p>
          {terms.map(t => (
            <button key={t} onClick={() => !matched.includes(t) && setSelectedTerm(t)} disabled={matched.includes(t)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${matched.includes(t) ? 'border-[#059669] bg-[#ecfdf5] text-[#059669]' : selectedTerm === t ? 'border-[#1a56db] bg-[#e8effa] font-medium' : 'border-[#e5e7eb] hover:border-[#1a56db]'}`}>{t}</button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#6b7280] mb-2">Определения</p>
          {defs.map(d => (
            <button key={d} onClick={() => handleDef(d)} disabled={matched.includes(d)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${matched.includes(d) ? 'border-[#059669] bg-[#ecfdf5] text-[#059669]' : errorDef === d ? 'border-[#dc2626] bg-[#fef2f2]' : 'border-[#e5e7eb] hover:border-[#1a56db]'}`}>{d}</button>
          ))}
        </div>
      </div>
      {selectedTerm && <p className="text-xs text-[#6b7280] mt-4">Выберите определение для выделенного термина</p>}
    </div>
  );
}

/* ===== Chain ===== */
function ChainLesson({ scenario, onComplete }: { scenario: Scenario; onComplete: () => void }) {
  const [ordered, setOrdered] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<string[]>(shuffle(scenario.steps));
  const [errors, setErrors] = useState(0);

  const handle = (step: string) => {
    const expected = scenario.steps[ordered.length];
    if (step === expected) {
      const newOrdered = [...ordered, step];
      setOrdered(newOrdered);
      setRemaining(prev => prev.filter(s => s !== step));
      if (newOrdered.length === scenario.steps.length) setTimeout(() => onComplete(), 500);
    } else setErrors(prev => prev + 1);
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] text-[10px] font-semibold">Процедура</span>
      </div>
      <h3 className="font-semibold mb-4">{scenario.title}</h3>
      {ordered.length > 0 && (
        <div className="space-y-1 mb-4">
          {ordered.map((s, i) => <div key={i} className="p-2 rounded-lg bg-[#ecfdf5] border border-[#059669] text-sm">{i + 1}. {s}</div>)}
        </div>
      )}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#6b7280]">Выберите следующий шаг:</p>
        {remaining.map((s, i) => (
          <button key={i} onClick={() => handle(s)} className="w-full text-left px-3 py-2 rounded-lg border border-[#e5e7eb] hover:border-[#1a56db] text-sm transition-all">{s}</button>
        ))}
      </div>
    </div>
  );
}

/* ===== Case (Decision Tree) ===== */
function CaseLesson({ tree, onComplete }: { tree: DecisionTree; onComplete: () => void }) {
  const [currentId, setCurrentId] = useState(tree.startStep);
  const [phase, setPhase] = useState<'playing' | 'feedback' | 'done'>('playing');
  const [feedback, setFeedback] = useState<{ choice: DecisionChoice; isCorrect: boolean } | null>(null);

  const currentStep = tree.steps.find(s => s.id === currentId);
  if (!currentStep) return <div className="glass-card p-6 text-center text-[#6b7280]">Кейс завершён</div>;

  const handleChoice = (choice: DecisionChoice) => {
    const isCorrect = choice.correct;
    setFeedback({ choice, isCorrect });
    setPhase('feedback');
  };

  const handleNext = () => {
    if (!feedback) return;
    const nextId = feedback.choice.next;
    const nextStep = nextId ? tree.steps.find(s => s.id === nextId) : undefined;
    if (!nextStep || nextStep.choices.length === 0) {
      onComplete();
      setPhase('done');
      return;
    }
    setCurrentId(nextId);
    setFeedback(null);
    setPhase('playing');
  };

  if (phase === 'done') {
    return (
      <div className="glass-card p-6 text-center">
        <Check className="w-12 h-12 mx-auto text-[#059669] mb-4" />
        <p className="text-lg font-semibold mb-2">Кейс завершён!</p>
        <p className="text-sm text-[#6b7280]">Вы прошли кейс-тренажёр до конца</p>
      </div>
    );
  }

  if (feedback) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${feedback.isCorrect ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fef2f2] text-[#dc2626]'}`}>
            {feedback.isCorrect ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
          </div>
          <div>
            <p className={`font-semibold ${feedback.isCorrect ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
              {feedback.isCorrect ? 'Верно!' : 'Неверно'}
            </p>
          </div>
        </div>
        {feedback.choice.hint && (
          <p className="text-sm bg-[#f0f4ff] p-3 rounded-lg border border-[#bfdbfe] mb-4">{feedback.choice.hint}</p>
        )}
        <button onClick={handleNext} className="glass-btn w-full justify-center">
          Далее <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-2 py-0.5 rounded-full bg-[#f5f3ff] text-[#7c3aed] text-[10px] font-semibold">Кейс-тренажёр</span>
        <span className="text-xs text-[#6b7280]">{tree.title}</span>
      </div>
      <div className="p-4 rounded-lg bg-[#fefce8] border border-[#fde68a] text-sm mb-4 leading-relaxed">{currentStep.question}</div>
      <div className="space-y-2">
        {currentStep.choices.filter(c => c.text).map((c, i) => (
          <button key={i} onClick={() => handleChoice(c)}
            className="w-full text-left px-4 py-3 rounded-lg border border-[#e5e7eb] hover:border-[#1a56db] hover:bg-[#e8effa] text-sm transition-all">{c.text}</button>
        ))}
      </div>
    </div>
  );
}