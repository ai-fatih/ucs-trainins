import React from 'react';
import PrintButton from './PrintButton';

interface Props {
  steps: { title: string }[];
}

export default function DocPageToolbar({ steps }: Props) {
  return (
    <div className="no-print mb-8">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9ca3af]">
          На этой странице
        </div>
        <PrintButton />
      </div>
      <nav className="glass-card p-4" aria-label="Содержание страницы">
        <ul className="space-y-0.5">
          <li>
            <a
              href="#steps"
              className="block text-sm font-semibold text-[#374151] hover:text-[#1a56db] no-underline py-1"
            >
              Пошаговая инструкция
            </a>
          </li>
          {steps.map((s, i) => (
            <li key={i}>
              <a
                href={`#step-${i}`}
                className="block text-sm text-[#6b7280] hover:text-[#1a56db] no-underline pl-5 py-1"
              >
                {i + 1}. {s.title}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#errors"
              className="block text-sm font-semibold text-[#374151] hover:text-[#1a56db] no-underline py-1"
            >
              Типовые ошибки
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}