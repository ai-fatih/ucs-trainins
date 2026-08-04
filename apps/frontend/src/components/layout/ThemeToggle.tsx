'use client';
import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';

const STORAGE_KEY = 'ucs_theme';

type Theme = 'light' | 'dark';

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore quota */
  }
}

export function ThemeToggle({ onHero = false }: { onHero?: boolean }) {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',
  );

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  const isDark = theme === 'dark';

  return (
    <Tooltip content={isDark ? 'Светлая тема' : 'Тёмная тема'} side="bottom">
      <button
        onClick={toggle}
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0 ${
          onHero
            ? 'text-[#94a3b8] hover:text-white hover:bg-white/10'
            : 'text-[#6b7280] hover:text-[#1a56db] hover:bg-[#1a56db]/10'
        }`}
        aria-label={isDark ? 'Включить светлую тему' : 'Включить тёмную тему'}
        title={isDark ? 'Светлая тема' : 'Тёмная тема'}
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    </Tooltip>
  );
}