'use client';

import { useHydrated } from '@/lib/hooks/useHydrated';

export function ContactPhone() {
  const hydrated = useHydrated();
  return <>{hydrated ? '+7 (495) 777-01-20' : '+7 (•••) •••-••-••'}</>;
}
