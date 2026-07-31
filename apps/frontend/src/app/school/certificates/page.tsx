'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Certificate } from '@/types';
import { getEarnedCertificates } from '@/lib/school/storage';
import CertificateCard from '@/components/school/CertificateCard';

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    setCerts(getEarnedCertificates());
  }, []);

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <Link href="/school" className="inline-flex items-center gap-1 text-sm text-[#6b7280] hover:text-[#1a56db] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> В школу
      </Link>

      <h1 className="text-2xl font-bold mb-6">Мои сертификаты</h1>
      <CertificateCard certificates={certs} />
    </div>
  );
}