'use client';
import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, Check, Clock } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getPageHelp } from '@/data/help';

export function PageHelp() {
  const pathname = usePathname();
  const entry = getPageHelp(pathname);
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !btnRef.current || !cardRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const c = cardRef.current.getBoundingClientRect();
    let top = r.bottom + 8;
    let left = r.right - c.width;
    left = Math.max(8, Math.min(left, window.innerWidth - c.width - 8));
    if (top + c.height > window.innerHeight - 8) top = Math.max(8, r.top - c.height - 8);
    setPos({ top, left });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      const card = cardRef.current;
      const btn = btnRef.current;
      if (
        card &&
        !card.contains(e.target as Node) &&
        btn &&
        !btn.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  if (!entry) return null;

  return (
    <span className="relative inline-flex align-middle">
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        aria-label="Что здесь и что сделано"
        aria-expanded={open}
        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all border ${
          open
            ? 'bg-[#1a56db]/10 text-[#1a56db] border-[#1a56db]/30'
            : 'bg-white/60 text-[#6b7280] border-white/40 hover:text-[#1a56db] hover:bg-[#1a56db]/10'
        }`}
      >
        {open ? <X className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
      </button>

      {open && (
        <div
          ref={cardRef}
          className="fixed z-[70] w-[340px] max-w-[calc(100vw-16px)]"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="glass-card rounded-2xl border border-white/40 shadow-2xl p-5 text-left">
            <h2 className="text-base font-bold text-[#111827] mb-2">{entry.title}</h2>
            <p className="text-sm text-[#6b7280] leading-relaxed mb-3">{entry.description}</p>

            <div className="mb-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1.5">
                Что сделано
              </div>
              <ul className="space-y-1.5">
                {entry.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#374151]">
                    <Check className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {entry.planned && entry.planned.length > 0 && (
              <div className="mb-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] mb-1.5">
                  В разработке
                </div>
                <ul className="space-y-1.5">
                  {entry.planned.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-[#6b7280]">
                      <Clock className="w-3.5 h-3.5 text-[#f59e0b] shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-white/40">
              {entry.status === 'done' ? (
                <span className="text-[11px] font-medium text-[#059669]">Готово и работает</span>
              ) : entry.status === 'partial' ? (
                <span className="text-[11px] font-medium text-[#f59e0b]">Частично готово</span>
              ) : (
                <span className="text-[11px] font-medium text-[#9ca3af]">В планах</span>
              )}
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
