import { redirect } from 'next/navigation';

export default async function CaseDetailRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/faq/2026-07/${id}`);
}