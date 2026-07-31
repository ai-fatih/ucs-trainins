'use client';
import { Phone } from 'lucide-react';
import { useHydrated } from '@/lib/hooks/useHydrated';

const realContent = (
  <>
    <span className="w-9 h-9 rounded-xl bg-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0">
      <Phone className="w-4 h-4 text-[#0d9488]" />
    </span>
    <span className="text-[13px] font-semibold">
      +7 (495) 921-47-70{' '}
      <span className="text-[11px] opacity-50 font-normal">
        доб.{' '}
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[rgba(13,148,136,0.2)] text-[#0d9488] text-[10px] font-bold">2</span>
      </span>
    </span>
  </>
);

const maskedContent = (
  <>
    <span className="w-9 h-9 rounded-xl bg-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0">
      <Phone className="w-4 h-4 text-[#0d9488]" />
    </span>
    <span className="text-[13px] font-semibold">
      +7 (•••) •••-••-••{' '}
      <span className="text-[11px] opacity-50 font-normal">
        доб.{' '}
        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[rgba(13,148,136,0.2)] text-[#0d9488] text-[10px] font-bold">2</span>
      </span>
    </span>
  </>
);

export function PhoneLink() {
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <span className="flex items-center gap-2.5 opacity-0 pointer-events-none select-none" aria-hidden="true">
        {maskedContent}
      </span>
    );
  }

  return (
    <a href="tel:+74959214770" className="flex items-center gap-2.5 no-underline text-white hover:translate-x-1 transition-all">
      {realContent}
    </a>
  );
}
