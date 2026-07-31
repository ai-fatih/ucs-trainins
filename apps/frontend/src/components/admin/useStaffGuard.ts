'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

export function useStaffGuard() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const isStaff = user?.role === 'admin' || user?.role === 'company_admin' || user?.role === 'specialist';
    if (!user || !isStaff) router.replace('/auth/login');
  }, [user, router]);
}
