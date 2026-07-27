'use client';
import React, { useState } from 'react';
import { Wrench, Check, X, ArrowRight } from 'lucide-react';
import type { GameConfig, DecisionTree, Scenario, DecisionChoice } from '@/types';
import configData from '@/data/games-config.json';
import { shuffle } from '@/lib/games/storage';
import TrainResult from '@/components/games/TrainResult';

const config = configData as unknown as GameConfig;

type Phase = 'menu' | 'playing' | 'debrief' | 'done';

interface CaseState {
  tree: DecisionTree;
  stepIndex: number;
  steps: { id: string; question: string; choice: DecisionChoice }[];
  score: number;
  completed: boolean;
}

interface ChainState {
  scenario: Scenario;
  ordered: string[];
  remaining: string[];
  completed: boolean;
  errors: number;
}

type RoundState = { type: 'case'; data: CaseState; title: string } | { type: 'chain'; data: ChainState; title: string };

export default function TrainPage() {
  const [phase, setPhase] = useState<Phase>('menu');
  const [rounds, setRounds] = useState<RoundState[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [casesSolved, setCasesSolved] = useState(0);
  const [totalCases, setTotalCases] = useState(5);

  const buildCaseState = (tree: DecisionTree): CaseState => {
    const steps: { id: string; question: string; choice: DecisionChoice }[] = [];
    let currentId = tree.startStep;
    while (currentId) {
      const step = tree.steps.find(s => s.id === currentId);
      if (!step) break;
      const correctChoice = step.choices.find(c => c.correct) || step.choices[0];
      steps.push({ id: step.id, question: step.question, choice: correctChoice });
      const nextStep = tree.steps.find(s => s.id === correctChoice.next);
      currentId = nextStep && nextStep.choices.length > 0 ? correctChoice.next : '';
    }
    return { tree, stepIndex: 0, steps, score: 0, completed: false };
  };

  const initSession = () => {
    const pool: ('case' | 'chain')[] = ['case', 'chain', 'case', 'chain', 'case'];
    const newRounds: RoundState[] = [];
    const usedCases: string[] = [];
    const usedScenarios: string[] = [];

    pool.forEach(type => {
      if (type === 'case') {
        const available = config.decisionTrees.filter(d => !usedCases.includes(d.id));
        const tree = shuffle(available.length > 0 ? available : config.decisionTrees)[0];
        usedCases.push(tree.id);
        newRounds.push({ type: 'case', data: buildCaseState(tree), title: tree.title });
      } else {
        const available = config.scenarios.filter(s => !usedScenarios.includes(s.id));
        const sc = shuffle(available.length > 0 ? available : config.scenarios)[0];
        usedScenarios.push(sc.id);
        newRounds.push({ type: 'chain', data: { scenario: sc, ordered: [], remaining: shuffle(sc.steps), completed: false, errors: 0 }, title: sc.title });
      }
    });

    setRounds(newRounds);
    setRoundIdx(0);
    setCasesSolved(0);
    setTotalCases(newRounds.length);
    setPhase('playing');
  };

  const handleCaseChoice = (choice: DecisionChoice) => {
    const round = rounds[roundIdx];
    if (!round || round.type !== 'case') return;
    const state = round.data;
    const isCorrect = choice.correct;
    const newScore = state.score + (isCorrect ? 1 : 0);
    const nextIdx = state.stepIndex + 1;
    const completed = nextIdx >= state.steps.length;

    const newRounds = [...rounds] as RoundState[];
    newRounds[roundIdx] = { type: 'case', title: round.title, data: { ...state, stepIndex: nextIdx, score: newScore, completed } };
    if (completed && isCorrect) setCasesSolved(prev => prev + 1);
    setRounds(newRounds);
    if (completed) setPhase('debrief');
  };

  const handleChainPick = (step: string) => {
    const round = rounds[roundIdx];
    if (!round || round.type !== 'chain') return;
    const state = round.data;
    const expected = state.scenario.steps[state.ordered.length];
    if (step === expected) {
      const newOrdered = [...state.ordered, step];
      const newRounds = [...rounds] as RoundState[];
      if (newOrdered.length === state.scenario.steps.length) {
        newRounds[roundIdx] = { type: 'chain', title: round.title, data: { ...state, ordered: newOrdered, completed: true } };
        setRounds(newRounds);
        setCasesSolved(prev => prev + 1);
        setTimeout(() => setPhase('debrief'), 500);
      } else {
        newRounds[roundIdx] = { type: 'chain', title: round.title, data: { ...state, ordered: newOrdered, remaining: state.remaining.filter(s => s !== step) } };
        setRounds(newRounds);
      }
    } else {
      const newRounds = [...rounds] as RoundState[];
      newRounds[roundIdx] = { type: 'chain', title: round.title, data: { ...state, errors: state.errors + 1 } };
      setRounds(newRounds);
    }
  };

  const goNext = () => {
    if (roundIdx < rounds.length - 1) {
      setRoundIdx(prev => prev + 1);
      setPhase('playing');
    } else {
      setPhase('done');
    }
  };

  if (phase === 'menu') {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
        <div className="glass-card p-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0d9488] to-[#059669] inline-flex items-center justify-center text-white mb-6">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Тренажёр</h1>
          <p className="text-sm text-[#6b7280] mb-4">Смена техподдержки: реши 5 кейсов шаг за шагом.</p>
          <div className="text-left mb-6">
            <p className="text-xs font-semibold text-[#6b7280] mb-3">Кейсы в смене:</p>
            <div className="space-y-2">
              {['case', 'chain', 'case', 'chain', 'case'].map((type, i) => {
                const name = type === 'case'
                  ? config.decisionTrees[i < 3 ? i : 0]?.title ?? 'Кейс'
                  : config.scenarios[i < 2 ? i - 1 : 0]?.title ?? 'Процедура';
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#f9fafb] text-sm">
                    <span className="w-6 h-6 rounded-full bg-[#0d9488] text-white text-xs flex items-center justify-center font-medium">{i + 1}</span>
                    <span>{name}</span>
                    <span className="ml-auto text-[10px] text-[#9ca3af]">{type === 'case' ? 'Кейс' : 'Процедура'}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <button onClick={initSession} className="glass-btn text-base px-8 py-3">
            <Wrench className="w-5 h-5" /> Начать смену
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    return <TrainResult casesSolved={casesSolved} totalCases={totalCases} onRestart={() => setPhase('menu')} />;
  }

  const round = rounds[roundIdx];
  if (!round) return null;

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="section-title">Тренажёр</h1>
            <span className="text-sm text-[#6b7280]">{roundIdx + 1} / {totalCases}</span>
          </div>

          {phase === 'debrief' && round.type === 'case' && (
            <CaseDebrief state={round.data} title={round.title} onNext={goNext} />
          )}
          {phase === 'debrief' && round.type === 'chain' && (
            <ChainDebrief state={round.data} title={round.title} onNext={goNext} />
          )}
          {phase === 'playing' && round.type === 'case' && (
            <CaseRoundContent state={round.data} onChoice={handleCaseChoice} />
          )}
          {phase === 'playing' && round.type === 'chain' && (
            <TrainChainContent state={round.data} onPick={handleChainPick} />
          )}
        </div>

        <div className="lg:col-span-1 mt-4 lg:mt-0">
          <details className="lg:hidden" open>
            <summary className="text-sm font-semibold text-[#6b7280] cursor-pointer select-none mb-2">
              Панель тренажёра ▼
            </summary>
            <TrainSidebar rounds={rounds} roundIdx={roundIdx} totalCases={totalCases} casesSolved={casesSolved} roundType={round.type} />
          </details>
          <div className="hidden lg:block sticky top-4">
            <TrainSidebar rounds={rounds} roundIdx={roundIdx} totalCases={totalCases} casesSolved={casesSolved} roundType={round.type} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Trainer Sidebar ---- */
function TrainSidebar({ rounds, roundIdx, totalCases, casesSolved, roundType }: { rounds: RoundState[]; roundIdx: number; totalCases: number; casesSolved: number; roundType: 'case' | 'chain' }) {
  return (
    <div className="glass-card p-4 space-y-4">
      <div className="text-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d9488] to-[#059669] inline-flex items-center justify-center text-white mb-2">
          <Wrench className="w-5 h-5" />
        </div>
        <div className="text-lg font-bold">Уровень 1</div>
        <div className="w-full h-1.5 rounded-full bg-[#e5e7eb] mt-2">
          <div className="h-1.5 rounded-full bg-gradient-to-r from-[#0d9488] to-[#059669]" style={{ width: '20%' }} />
        </div>
        <div className="text-[10px] text-[#9ca3af] mt-1">до следующего уровня</div>
      </div>

      <div className="border-t border-[#e5e7eb]/50 pt-3">
        <div className="text-xs font-semibold text-[#6b7280] mb-2">Сессия</div>
        <div className="flex justify-center gap-1 mb-2">
          {Array.from({ length: totalCases }).map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full border ${
              i < roundIdx ? 'bg-[#059669] border-[#059669]' :
              i === roundIdx ? 'bg-[#1a56db] border-[#1a56db]' :
              'bg-white border-[#d1d5db]'
            }`} />
          ))}
        </div>
        <div className="space-y-1 mt-3">
          {rounds.map((r, i) => (
            <div key={i} className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${
              i < roundIdx ? 'bg-[#ecfdf5] text-[#059669]' :
              i === roundIdx ? 'bg-[#e8effa] text-[#1a56db] font-medium' :
              'text-[#9ca3af]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${i < roundIdx ? 'bg-[#059669]' : i === roundIdx ? 'bg-[#1a56db]' : 'bg-[#d1d5db]'}`} />
              {r.title}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#e5e7eb]/50 pt-3">
        <div className="text-xs font-semibold text-[#6b7280] mb-2">Статистика</div>
        <div className="flex justify-between text-xs">
          <span className="text-[#6b7280]">Решено кейсов</span>
          <span className="font-semibold">{casesSolved}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[#6b7280]">Текущий</span>
          <span className="font-semibold text-[#1a56db]">{roundType === 'case' ? 'Кейс' : 'Процедура'}</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Case Round Content ---- */
function CaseRoundContent({ state, onChoice }: { state: CaseState; onChoice: (choice: DecisionChoice) => void }) {
  const [picked, setPicked] = useState<DecisionChoice | null>(null);

  const handleNext = () => {
    if (!picked) return;
    const c = picked;
    setPicked(null);
    onChoice(c);
  };

  if (picked) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${picked.correct ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fef2f2] text-[#dc2626]'}`}>
            {picked.correct ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
          </div>
          <div>
            <p className={`font-semibold ${picked.correct ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
              {picked.correct ? 'Верно' : 'Неверно'}
            </p>
            <p className="text-xs text-[#6b7280]">{picked.correct ? 'Правильный выбор' : 'Ошибка'}</p>
          </div>
        </div>
        <p className="text-sm bg-[#f0f4ff] p-3 rounded-lg border border-[#bfdbfe] mb-4">{picked.hint || 'Без пояснения'}</p>
        <button onClick={handleNext} className="glass-btn">
          {state.completed ? 'Завершить кейс' : 'Следующий шаг'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const step = state.steps[state.stepIndex];
  if (!step) return null;

  const treeStep = state.tree.steps.find(s => s.id === step.id);
  if (!treeStep) return null;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-medium text-[#6b7280]">Шаг {state.stepIndex + 1} из {state.steps.length}</span>
        {state.stepIndex > 0 && (
          <span className="text-xs text-[#059669] font-medium">+{state.score}/{state.stepIndex}</span>
        )}
      </div>
      <div className="p-4 rounded-lg bg-[#fefce8] border border-[#fde68a] text-sm mb-4 leading-relaxed">{step.question}</div>
      <div className="space-y-2">
        {treeStep.choices.map((c, i) => (
          <button key={i} onClick={() => setPicked(c)}
            className="w-full text-left px-4 py-3 rounded-lg border border-[#e5e7eb] hover:border-[#1a56db] hover:bg-[#e8effa] text-sm transition-all">
            {c.text}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---- Case Debrief ---- */
function CaseDebrief({ state, title, onNext }: { state: CaseState; title: string; onNext: () => void }) {
  return (
    <div className="glass-card p-6">
      <div className="text-center mb-6">
        <div className={`w-14 h-14 rounded-2xl inline-flex items-center justify-center mb-3 ${state.score === state.steps.length ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fefce8] text-[#ca8a04]'}`}>
          {state.score === state.steps.length ? <Check className="w-7 h-7" /> : <X className="w-7 h-7" />}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-[#6b7280] mt-1">
          {state.score === state.steps.length ? 'Кейс решён полностью!' : 'Допущены ошибки'}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 text-sm">
          <span className="font-semibold text-[#1a56db]">{state.score}/{state.steps.length}</span>
          <span className="text-[#6b7280]">верных ответов</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {state.steps.map((step, i) => {
          const isCorrect = i < state.score;
          return (
            <div key={i} className={`p-3 rounded-lg border text-sm ${
              isCorrect ? 'border-[#a7f3d0] bg-[#ecfdf5]' : 'border-[#fecaca] bg-[#fef2f2]'
            }`}>
              <div className="flex items-start gap-2">
                <div className={`mt-0.5 ${isCorrect ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
                  {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">{step.question}</p>
                  <p className={isCorrect ? 'text-[#059669]' : 'text-[#dc2626]'}>{step.choice.text}</p>
                  {!isCorrect && <p className="text-[#6b7280] mt-1">{step.choice.hint}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onNext} className="glass-btn w-full justify-center">
        Далее <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ---- Chain Debrief ---- */
function ChainDebrief({ state, title, onNext }: { state: ChainState; title: string; onNext: () => void }) {
  return (
    <div className="glass-card p-6">
      <div className="text-center mb-6">
        <div className={`w-14 h-14 rounded-2xl inline-flex items-center justify-center mb-3 ${state.errors === 0 ? 'bg-[#ecfdf5] text-[#059669]' : 'bg-[#fefce8] text-[#ca8a04]'}`}>
          {state.errors === 0 ? <Check className="w-7 h-7" /> : <X className="w-7 h-7" />}
        </div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-[#6b7280] mt-1">{state.errors === 0 ? 'Процедура собрана верно!' : 'Были ошибки'}</p>
        <div className="mt-3 inline-flex items-center gap-2 text-sm">
          <span className="text-[#6b7280]">Ошибок: </span>
          <span className={`font-semibold ${state.errors === 0 ? 'text-[#059669]' : 'text-[#dc2626]'}`}>{state.errors}</span>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <p className="text-xs font-semibold text-[#6b7280] mb-2">Правильная последовательность:</p>
        {state.scenario.steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#f9fafb] text-sm">
            <span className="w-5 h-5 rounded-full bg-[#0d9488] text-white text-[10px] flex items-center justify-center font-medium">{i + 1}</span>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <button onClick={onNext} className="glass-btn w-full justify-center">
        Далее <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ---- Chain (trainer) ---- */
function TrainChainContent({ state, onPick }: { state: ChainState; onPick: (step: string) => void }) {
  if (state.completed) {
    return <div className="glass-card p-6 text-center"><Check className="w-12 h-12 mx-auto text-[#059669] mb-4" /><p className="text-base">Процедура собрана!</p></div>;
  }
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4">{state.scenario.title}</h3>
      {state.ordered.length > 0 && (
        <div className="space-y-1 mb-4">
          {state.ordered.map((s, i) => (
            <div key={i} className="p-2 rounded-lg bg-[#ecfdf5] border border-[#059669] text-sm">{i + 1}. {s}</div>
          ))}
        </div>
      )}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#6b7280]">Выберите следующий шаг:</p>
        {state.remaining.map((s, i) => (
          <button key={i} onClick={() => onPick(s)}
            className="w-full text-left px-3 py-2 rounded-lg border border-[#e5e7eb] hover:border-[#1a56db] text-sm transition-all">{s}</button>
        ))}
      </div>
    </div>
  );
}
