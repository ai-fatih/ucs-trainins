import { redirect } from 'next/navigation';
import casesYear from '@/data/cases/yearly.json';
import type { YearlyCases } from '@/types';

const year = casesYear as YearlyCases;

export default function CasesRedirect() {
  const current = year.months
    .filter((m) => !m.planned && (m.totalRequests ?? 0) > 0)
    .at(-1);
  redirect(`/faq/${current?.month ?? '2026-01'}`);
}
