'use client';
import React from 'react';
import type { Certificate } from '@/types';
import { ScrollText, Download, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  certificates: Certificate[];
}

function downloadCertificate(cert: Certificate) {
  const win = window.open('', '_blank', 'width=820,height=620');
  if (!win) return;
  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>${cert.title}</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #f8fafc; }
    .cert { width: 700px; padding: 56px 48px; text-align: center; background: #fff; border: 3px solid #1a56db; border-radius: 16px; box-shadow: 0 20px 60px rgba(26,86,219,0.15); }
    .cert .brand { color: #1a56db; letter-spacing: 3px; text-transform: uppercase; font-size: 13px; font-weight: 700; }
    .cert h1 { font-size: 30px; margin: 18px 0 6px; color: #111827; }
    .cert .course { color: #6b7280; font-size: 16px; margin-bottom: 22px; }
    .cert .name { font-size: 24px; color: #0d9488; font-weight: 700; margin-bottom: 4px; }
    .cert .date { color: #9ca3af; font-size: 13px; margin-top: 26px; }
    .cert .seal { width: 64px; height: 64px; border: 2px solid #1a56db; border-radius: 50%; margin: 18px auto 0; position: relative; }
    .cert .seal::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #1a56db; font-size: 26px; }
  </style>
</head>
<body>
  <div class="cert">
    <div class="brand">Школа UCS Service</div>
    <h1>Сертификат</h1>
    <div class="course">${cert.courseName}</div>
    <div class="name">${cert.title}</div>
    <div class="date">Выдан: ${new Date(cert.issuedAt).toLocaleDateString('ru-RU')}</div>
    <div class="seal"></div>
  </div>
</body>
</html>`;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
}

async function shareCertificate(cert: Certificate) {
  const text = `Я получил сертификат «${cert.title}» (${cert.courseName}) в Школе UCS!`;
  if (navigator.share) {
    try { await navigator.share({ title: cert.title, text }); } catch {}
  } else {
    try { await navigator.clipboard.writeText(text); toast.success('Текст скопирован в буфер'); } catch {}
  }
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
        <div key={cert.id} className="glass-card p-5 hover:shadow-lg transition-all flex flex-col">
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
          <div className="flex gap-2 mt-4 pt-4 border-t border-[#e5e7eb]/50">
            <button onClick={() => downloadCertificate(cert)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a56db] hover:underline cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Скачать / Печать
            </button>
            <button onClick={() => shareCertificate(cert)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0d9488] hover:underline cursor-pointer">
              <Share2 className="w-3.5 h-3.5" /> Поделиться
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
