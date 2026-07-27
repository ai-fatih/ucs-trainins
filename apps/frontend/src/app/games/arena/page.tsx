'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Swords, Check, X, TrendingUp, Zap, Trophy } from 'lucide-react';
import type {
  GameConfig, ArenaRoundType, QuizQuestion, MatchPair,
  Scenario, RoundResult, ArenaProgress,
} from '@/types';
import configData from '@/data/games-config.json';
import { getArenaProgress, getRemainingSessions, shuffle, pickRandom, calcRank } from '@/lib/games/storage';
import RoundPicker from '@/components/games/RoundPicker';
import ArenaResult from '@/components/games/ArenaResult';

const config = configData as unknown as GameConfig;

type Phase = 'menu' | 'playing' | 'picking' | 'done';

interface PlayingState {
  type: ArenaRoundType;
  data: any;
  question?: QuizQuestion;
  matchTerms?: string[];
  matchDefs?: string[];
  chainSteps?: string[];
  chainOrdered?: string[];
  sprintStatements?: { text: string; correct: boolean }[];
  sprintIdx?: number;
}

export default function ArenaPage() {
  const [phase, setPhase] = useState<Phase>('menu');
  const [currentRound, setCurrentRound] = useState(0);
  const [lastType, setLastType] = useState<ArenaRoundType | null>(null);
  const [pickOptions, setPickOptions] = useState<ArenaRoundType[]>([]);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [playing, setPlaying] = useState<PlayingState | null>(null);
  const [matchErrors, setMatchErrors] = useState(0);
  const [chainErrors, setChainErrors] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [usedMatch, setUsedMatch] = useState<string[]>([]);
  const [usedScenarios, setUsedScenarios] = useState<string[]>([]);

  const progress: ArenaProgress = getArenaProgress();
  const arena = config.arena;
  const rank = calcRank(progress.xp, arena.rankThresholds);
  const sessionScore = results.reduce((s, r) => s + r.score, 0);
  const { remaining } = getRemainingSessions(arena.sessionsPerDay);

  const getRandomQuestion = useCallback(() => {
    const pool = config.questions.filter(q => !usedQuestions.includes(q.id));
    if (pool.length === 0) return shuffle(config.questions)[0];
    return shuffle(pool)[0];
  }, [usedQuestions]);

  const getRandomPairs = useCallback((count: number) => {
    const pool = config.matchPairs.filter(p => !usedMatch.includes(p.term));
    const selected = shuffle(pool.length >= count ? pool : config.matchPairs).slice(0, count);
    return { pairs: selected, terms: shuffle(selected.map(p => p.term)), defs: shuffle(selected.map(p => p.definition)) };
  }, [usedMatch]);

  const getRandomScenario = useCallback(() => {
    const pool = config.scenarios.filter(s => !usedScenarios.includes(s.id));
    if (pool.length === 0) return shuffle(config.scenarios)[0];
    return shuffle(pool)[0];
  }, [usedScenarios]);

  const startRound = (type: ArenaRoundType) => {
    setTimeLeft(0);
    const state: PlayingState = { type, data: {} };
    if (type === 'quiz') {
      const q = getRandomQuestion();
      setUsedQuestions(prev => [...prev, q.id]);
      state.question = q;
    } else if (type === 'sprint') {
      const stmts: { text: string; correct: boolean }[] = [];
      config.questions.forEach(q => {
        q.options.forEach((opt, i) => {
          stmts.push({ text: `«${q.question.slice(0, 40)}...» → ${opt}`, correct: i === q.correct });
        });
      });
      state.sprintStatements = shuffle(stmts).slice(0, 10);
      state.sprintIdx = 0;
      setTimeLeft(20);
    } else if (type === 'match') {
      const { pairs, terms, defs } = getRandomPairs(4);
      pairs.forEach(p => setUsedMatch(prev => [...prev, p.term]));
      state.matchTerms = terms;
      state.matchDefs = defs;
      state.data = { pairs };
      setTimeLeft(30);
    } else if (type === 'chain') {
      const sc = getRandomScenario();
      setUsedScenarios(prev => [...prev, sc.id]);
      state.chainSteps = shuffle(sc.steps);
      state.chainOrdered = [];
      setTimeLeft(45);
    }
    setPlaying(state);
    setPhase('playing');
  };

  const finishRound = (score: number, maxScore: number) => {
    const label = arena.roundTypes[playing!.type].title;
    setResults(prev => [...prev, { type: playing!.type, score, maxScore, label }]);
    if (currentRound >= arena.roundsPerSession - 1) {
      setPhase('done');
    } else {
      setPhase('picking');
    }
  };

  const handlePick = (type: ArenaRoundType) => {
    setLastType(type);
    setCurrentRound(prev => prev + 1);
    startRound(type);
  };

  const initFirstRound = () => {
    const first = pickRandom(arena.roundPool, 1)[0];
    setLastType(first);
    setCurrentRound(0);
    setResults([]);
    setUsedQuestions([]);
    setUsedMatch([]);
    setUsedScenarios([]);
    startRound(first);
  };

  const handlePickingPhase = () => {
    const options = pickRandom(arena.roundPool, arena.pickCount, lastType ?? undefined);
    setPickOptions(options);
  };

  useEffect(() => { if (phase === 'picking') handlePickingPhase(); }, [phase]);

  useEffect(() => {
    if (phase !== 'playing' || !playing || timeLeft <= 0) return;
    const t = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    if (timeLeft <= 0) { finishRound(0, playing.type === 'sprint' ? 150 : playing.type === 'match' ? 120 : 130); }
    return () => clearTimeout(t);
  }, [phase, playing, timeLeft]);

  if (phase === 'menu') {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
        <div className="glass-card p-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f59e06] to-[#dc2626] inline-flex items-center justify-center text-white mb-6">
            <Swords className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Лига</h1>
          <p className="text-sm text-[#6b7280] mb-4">5 туров. Выбирай режим после каждого. Зарабатывай XP.</p>
          <div className="mb-6">
            <div className="text-2xl font-bold">{rank.icon} {rank.title}</div>
            <div className="text-sm text-[#6b7280] mt-1">{progress.xp} XP • Лучший счёт: {progress.bestScore}</div>
            <div className="text-xs text-[#9ca3af] mt-1">Осталось попыток: {remaining} • Стрейн: {progress.streak} дн.</div>
          </div>
          <button onClick={initFirstRound} className="glass-btn text-base px-8 py-3" disabled={remaining === 0}>
            <Swords className="w-5 h-5" /> {remaining === 0 ? 'Попытки кончились' : 'Начать матч'}
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'picking') {
    const options = pickOptions.map(t => ({ type: t, config: arena.roundTypes[t] }));
    return (
      <div className="max-w-[800px] mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="section-title">Лига</h1>
          <span className="text-sm text-[#6b7280]">Тур {currentRound + 1} / {arena.roundsPerSession}</span>
        </div>
        <RoundPicker options={options} onPick={handlePick} />
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <ArenaResult
        results={results}
        xpGained={sessionScore}
        onRestart={() => setPhase('menu')}
        thresholds={config.arena.rankThresholds}
        sessionsPerDay={arena.sessionsPerDay}
      />
    );
  }

  if (!playing) return null;

  const typeIcon: Record<string, React.ReactNode> = {
    quiz: <TrendingUp className="w-5 h-5" />,
    sprint: <Zap className="w-5 h-5" />,
    match: <Trophy className="w-5 h-5" />,
    chain: <Trophy className="w-5 h-5" />,
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-8">
      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="section-title">Лига</h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="hidden sm:inline text-[#6b7280]">Тур {currentRound + 1}/{arena.roundsPerSession}</span>
              {timeLeft > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${timeLeft > 10 ? 'bg-[#059669]' : 'bg-[#dc2626]'}`}>
                  {timeLeft}с
                </span>
              )}
            </div>
          </div>

          {playing.type === 'quiz' && playing.question && (
            <QuizRound question={playing.question} onComplete={(score) => finishRound(score, 100)} />
          )}
          {playing.type === 'sprint' && playing.sprintStatements && (
            <SprintRound statements={playing.sprintStatements} onComplete={(score) => finishRound(score, 150)} />
          )}
          {playing.type === 'match' && playing.matchTerms && playing.matchDefs && (
            <MatchRound
              terms={playing.matchTerms}
              defs={playing.matchDefs}
              pairs={playing.data.pairs}
              onComplete={(score, err) => { setMatchErrors(err); finishRound(score, 120); }}
            />
          )}
          {playing.type === 'chain' && playing.chainSteps && (
            <ChainRound
              steps={playing.chainSteps}
              onComplete={(score, err) => { setChainErrors(err); finishRound(score, 130); }}
            />
          )}
        </div>

        {/* Sidebar — desktop lg+, mobile collapses via details */}
        <div className="lg:col-span-1 mt-4 lg:mt-0">
          <details className="lg:hidden" open>
            <summary className="text-sm font-semibold text-[#6b7280] cursor-pointer select-none mb-2">
              Панель игрока ▼
            </summary>
            <PlayerSidebar progress={progress} rank={rank} results={results} currentRound={currentRound} totalRounds={arena.roundsPerSession} playing={playing} timeLeft={timeLeft} remaining={remaining} />
          </details>
          <div className="hidden lg:block sticky top-4">
            <PlayerSidebar progress={progress} rank={rank} results={results} currentRound={currentRound} totalRounds={arena.roundsPerSession} playing={playing} timeLeft={timeLeft} remaining={remaining} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Player Sidebar ---- */
function PlayerSidebar({ progress, rank, results, currentRound, totalRounds, playing, timeLeft, remaining }: {
  progress: ArenaProgress; rank: { title: string; icon: string }; results: RoundResult[];
  currentRound: number; totalRounds: number; playing: PlayingState | null; timeLeft: number;
  remaining: number;
}) {
  const sessionScore = results.reduce((s, r) => s + r.score, 0);
  return (
    <div className="glass-card p-4 space-y-4">
      <div className="text-center">
        <div className="text-3xl mb-1">{rank.icon}</div>
        <div className="text-lg font-bold">{rank.title}</div>
        <div className="text-xs text-[#6b7280]">{progress.xp} XP</div>
        <div className="w-full h-1.5 rounded-full bg-[#e5e7eb] mt-2">
          <div className="h-1.5 rounded-full bg-gradient-to-r from-[#f59e06] to-[#dc2626]" style={{ width: '45%' }} />
        </div>
        <div className="text-[10px] text-[#9ca3af] mt-1">до следующего дивизиона</div>
      </div>

      <div className="border-t border-[#e5e7eb]/50 pt-3">
        <div className="text-xs font-semibold text-[#6b7280] mb-2">Сессия</div>
        <div className="flex justify-center gap-1 mb-2">
          {Array.from({ length: totalRounds }).map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full border ${
              i < results.length ? 'bg-[#059669] border-[#059669]' :
              i === currentRound ? 'bg-[#1a56db] border-[#1a56db]' :
              'bg-white border-[#d1d5db]'
            }`} />
          ))}
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#6b7280]">Очки</span>
          <span className="font-semibold text-[#1a56db]">{sessionScore}</span>
        </div>
        {timeLeft > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-[#6b7280]">Таймер</span>
            <span className={`font-semibold ${timeLeft > 10 ? 'text-[#059669]' : 'text-[#dc2626]'}`}>{timeLeft}с</span>
          </div>
        )}
      </div>

      <div className="border-t border-[#e5e7eb]/50 pt-3">
        <div className="text-xs font-semibold text-[#6b7280] mb-2">За всё время</div>
        <div className="flex justify-between text-xs">
          <span className="text-[#6b7280]">Сессий</span>
          <span>{progress.sessionsPlayed}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[#6b7280]">Лучший счёт</span>
          <span className="font-semibold">{progress.bestScore}</span>
        </div>
      </div>

      <div className="border-t border-[#e5e7eb]/50 pt-3">
        <div className="text-xs font-semibold text-[#6b7280] mb-2">Сегодня</div>
        <div className="flex justify-between text-xs">
          <span className="text-[#6b7280]">Попыток осталось</span>
          <span className={`font-semibold ${remaining === 0 ? 'text-[#dc2626]' : 'text-[#059669]'}`}>{remaining}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[#6b7280]">Стрейн</span>
          <span className="font-semibold text-[#f59e06]">{progress.streak} дн.</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Quiz ---- */
function QuizRound({ question, onComplete }: { question: QuizQuestion; onComplete: (score: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const handleClick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => onComplete(idx === question.correct ? 100 : 0), 1500);
  };
  return (
    <div className="glass-card p-6">
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
              {idx + 1}. {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="mt-4 p-3 rounded-lg bg-[#f0f4ff] border border-[#bfdbfe] text-sm text-[#1e40af]">
          <span className="font-semibold">Пояснение: </span>{question.commentary}
        </div>
      )}
    </div>
  );
}

/* ---- Sprint ---- */
function SprintRound({ statements, onComplete }: { statements: { text: string; correct: boolean }[]; onComplete: (score: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const handle = (answer: boolean) => {
    if (done) return;
    const newScore = score + (statements[idx].correct === answer ? 15 : 0);
    setScore(newScore);
    if (idx < statements.length - 1) setIdx(prev => prev + 1);
    else { setDone(true); setTimeout(() => onComplete(newScore), 500); }
  };
  if (done) return <div className="glass-card p-6 text-center"><Check className="w-12 h-12 mx-auto text-[#059669] mb-4" /><p className="text-lg font-semibold">{score} очков</p></div>;
  const s = statements[idx];
  return (
    <div className="glass-card p-6">
      <p className="text-xs text-[#6b7280] mb-2">{idx + 1} / {statements.length}</p>
      <p className="text-base font-semibold mb-6">{s.text}</p>
      <div className="flex gap-3">
        <button onClick={() => handle(false)} className="glass-btn flex-1 justify-center py-4 border-[#dc2626] text-[#dc2626] hover:bg-[#fef2f2]"><X className="w-6 h-6" /> Неверно</button>
        <button onClick={() => handle(true)} className="glass-btn flex-1 justify-center py-4 border-[#059669] text-[#059669] hover:bg-[#ecfdf5]"><Check className="w-6 h-6" /> Верно</button>
      </div>
    </div>
  );
}

/* ---- Match ---- */
function MatchRound({ terms, defs, pairs, onComplete }: {
  terms: string[]; defs: string[]; pairs: { term: string; definition: string }[];
  onComplete: (score: number, errors: number) => void;
}) {
  const [matched, setMatched] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [errors, setErrors] = useState(0);
  const [errorDef, setErrorDef] = useState<string | null>(null);
  const handleDef = (def: string) => {
    if (!selectedTerm || matched.includes(def)) return;
    const pair = pairs.find(p => p.term === selectedTerm);
    if (pair && pair.definition === def) {
      const newMatched = [...matched, selectedTerm, def];
      setMatched(newMatched); setSelectedTerm(null);
      if (newMatched.length === pairs.length * 2) setTimeout(() => onComplete(Math.max(0, 120 - errors * 20), errors), 500);
    } else {
      setErrors(prev => prev + 1); setErrorDef(def);
      setTimeout(() => setErrorDef(null), 600);
    }
  };
  if (!pairs.some(p => !matched.includes(p.term))) return null;
  return (
    <div className="glass-card p-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#6b7280] mb-2">Термины</p>
          {terms.map(t => (
            <button key={t} onClick={() => !matched.includes(t) && setSelectedTerm(t)} disabled={matched.includes(t)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                matched.includes(t) ? 'border-[#059669] bg-[#ecfdf5] text-[#059669]' :
                selectedTerm === t ? 'border-[#1a56db] bg-[#e8effa] font-medium' : 'border-[#e5e7eb] hover:border-[#1a56db]'
              }`}>{t}</button>
          ))}
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#6b7280] mb-2">Определения</p>
          {defs.map(d => (
            <button key={d} onClick={() => handleDef(d)} disabled={matched.includes(d)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition-all ${
                matched.includes(d) ? 'border-[#059669] bg-[#ecfdf5] text-[#059669]' :
                errorDef === d ? 'border-[#dc2626] bg-[#fef2f2]' : 'border-[#e5e7eb] hover:border-[#1a56db]'
              }`}>{d}</button>
          ))}
        </div>
      </div>
      {selectedTerm && <p className="text-xs text-[#6b7280] mt-4">Выберите определение для выделенного термина</p>}
    </div>
  );
}

/* ---- Chain ---- */
function ChainRound({ steps, onComplete }: { steps: string[]; onComplete: (score: number, errors: number) => void }) {
  const [ordered, setOrdered] = useState<string[]>([]);
  const [remaining, setRemaining] = useState<string[]>(steps);
  const [errors, setErrors] = useState(0);
  const handle = (step: string) => {
    const expected = steps[ordered.length];
    if (step === expected) {
      const newOrdered = [...ordered, step];
      setOrdered(newOrdered);
      setRemaining(prev => prev.filter(s => s !== step));
      if (newOrdered.length === steps.length) setTimeout(() => onComplete(Math.max(0, 130 - errors * 20), errors), 500);
    } else setErrors(prev => prev + 1);
  };
  return (
    <div className="glass-card p-6">
      <p className="text-sm font-semibold mb-4">Расставьте шаги в правильном порядке:</p>
      {ordered.length > 0 && (
        <div className="space-y-1 mb-4">
          {ordered.map((s, i) => <div key={i} className="p-2 rounded-lg bg-[#ecfdf5] border border-[#059669] text-sm">{i + 1}. {s}</div>)}
        </div>
      )}
      <div className="space-y-2">
        {remaining.map((s, i) => (
          <button key={i} onClick={() => handle(s)} className="w-full text-left px-3 py-2 rounded-lg border border-[#e5e7eb] hover:border-[#1a56db] text-sm transition-all">{s}</button>
        ))}
      </div>
    </div>
  );
}
