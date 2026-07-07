'use client';
import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const { user, isAuthenticated } = useAuthStore();

  const dashboardHref = !isAuthenticated
    ? '/'
    : user?.role === 'admin' || user?.role === 'company_admin'
      ? '/admin/requests'
      : user?.role === 'specialist'
        ? '/admin/requests'
        : '/bookings';

  return (
    <footer className="glass-strong border-t border-white/20">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 no-underline mb-4">
              <span className="text-xl font-bold text-[#1a56db]">UCS <span className="font-normal text-[#374151]">service</span></span>
            </Link>
            <p className="text-sm text-[#6b7280]">
              Отдел пользовательской поддержки rkeeper
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-[#111827]">Услуги</h4>
            <ul className="space-y-2">
              <li><Link href="/services" className="text-sm text-[#6b7280] hover:text-[#1a56db] no-underline transition-colors">Консультации</Link></li>
              <li><Link href="/services" className="text-sm text-[#6b7280] hover:text-[#1a56db] no-underline transition-colors">Обучение</Link></li>
              <li><Link href="/services" className="text-sm text-[#6b7280] hover:text-[#1a56db] no-underline transition-colors">Настройка</Link></li>
              <li><Link href="/services" className="text-sm text-[#6b7280] hover:text-[#1a56db] no-underline transition-colors">Видеоконсультации</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-[#111827]">Навигация</h4>
            <ul className="space-y-2">
              <li><Link href="/specialists" className="text-sm text-[#6b7280] hover:text-[#1a56db] no-underline transition-colors">Специалисты</Link></li>
              <li><Link href={dashboardHref} className="text-sm text-[#6b7280] hover:text-[#1a56db] no-underline transition-colors">Личный кабинет</Link></li>
              <li><Link href="/bookings" className="text-sm text-[#6b7280] hover:text-[#1a56db] no-underline transition-colors">Мои записи</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-[#111827]">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[#6b7280]">
                <Phone className="w-4 h-4 text-[#1a56db]" />
                +7 (495) 123-45-67
              </li>
              <li className="flex items-center gap-2 text-sm text-[#6b7280]">
                <Mail className="w-4 h-4 text-[#1a56db]" />
                support@ucs.ru
              </li>
              <li className="flex items-start gap-2 text-sm text-[#6b7280]">
                <MapPin className="w-4 h-4 text-[#1a56db] mt-0.5" />
                <span>Москва, ул. Пример, д. 1</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#e5e7eb] mt-8 pt-6 text-center text-xs text-[#9ca3af]">
          UCS service &copy; {new Date().getFullYear()}. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
