'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab: controlledTab, onChange, className }: TabsProps) {
  const [internalTab, setInternalTab] = useState(tabs[0]?.id || '');
  const active = controlledTab ?? internalTab;

  const handleClick = (id: string) => {
    if (!controlledTab) setInternalTab(id);
    onChange?.(id);
  };

  return (
    <div className={cn('flex border-b border-[#e5e7eb] mb-6 overflow-x-auto scrollbar-hide', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleClick(tab.id)}
          className={cn(
            'px-5 py-3 text-sm font-medium transition-all duration-150 bg-none border-none cursor-pointer',
            active === tab.id
              ? 'text-[#1a56db] border-b-2 border-[#1a56db]'
              : 'text-[#9ca3af] hover:text-[#4b5563] border-b-2 border-transparent'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
