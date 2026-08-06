import { redirect } from 'next/navigation';
import casesYear from '@/data/cases/yearly.json';
import type { YearlyCases } from '@/types';

const year = casesYear as YearlyCases;

export default async function CaseDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const current = year.months
    .filter((m) => !m.planned && (m.totalRequests ?? 0) > 0)
    .at(-1);
  redirect(`/faq/${current?.month ?? '2026-01'}/${id}`);
}
