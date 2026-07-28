'use client';
import React from 'react';
import type { Certificate } from '@/types';
import { ScrollText, Download } from 'lucide-react';

interface Props {
  certificates: Certificate[];
}

export default function CertificateCard({ certificates }: Props) {
  if (certificates.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <ScrollText className="w-12 h-12 mx-auto text-[#9ca3af] mb-4" />
        <p className="text-[#6b7280]">Нет полученных сертификатов</p>
        <p className="text-xs text-[#9ca3af] mt-1">Завершите курс, чтобы получить сертификат</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {certificates.map((cert) => (
        <div key={cert.id} className="glass-card p-5 hover:shadow-lg transition-all">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] flex items-center justify-center text-white shrink-0">
              <ScrollText className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm mb-1">{cert.title}</h3>
              <p className="text-xs text-[#6b7280] mb-2">Курс: {cert.courseName}</p>
              {cert.issuedAt && (
                <p className="text-[10px] text-[#9ca3af]">
                  Выдан: {new Date(cert.issuedAt).toLocaleDateString('ru-RU')}
                </p>
              )}
              {cert.expiresAt && (
                <p className="text-[10px] text-[#dc2626]">
                  Действителен до: {new Date(cert.expiresAt).toLocaleDateString('ru-RU')}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}