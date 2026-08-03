'use client';
import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white no-underline transition-all bg-[#1a56db] hover:bg-[#1648c0]"
    >
      <Printer className="w-4 h-4" />
      Печать / PDF
    </button>
  );
}