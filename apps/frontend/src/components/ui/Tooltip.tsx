'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';

type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'bottom';
};

export function Tooltip({ content, children, className = '', side = 'bottom' }: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const position = useCallback(() => {
    const el = triggerRef.current;
    const tip = tipRef.current;
    if (!el || !tip) return;
    const r = el.getBoundingClientRect();
    const tr = tip.getBoundingClientRect();
    const gap = 10;
    let top = side === 'bottom' ? r.bottom + gap : r.top - tr.height - gap;
    let left = r.left + r.width / 2 - tr.width / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tr.width - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - tr.height - 8));
    setPos({ top, left });
  }, [side]);

  useEffect(() => {
    if (visible) position();
  }, [visible, position]);

  useEffect(() => {
    if (!visible) return;
    const onResize = () => position();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVisible(false);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('keydown', onKey);
    };
  }, [visible, position]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const show = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVisible(true), 200);
  }, []);

  const hide = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    setVisible(false);
  }, []);

  return (
    <span
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onClick={hide}
    >
      {children}
      {visible && (
        <div
          ref={tipRef}
          role="tooltip"
          className="fixed z-[70] w-[300px] pointer-events-none"
          style={{ top: pos.top, left: pos.left }}
        >
          <div className="rounded-2xl bg-white/95 backdrop-blur-xl border border-[#e5e7eb] shadow-2xl p-4 text-left text-[#111827]">
            {content}
          </div>
        </div>
      )}
    </span>
  );
}
