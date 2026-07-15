'use client';
import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const { user, isAuthenticated } = useAuthStore();

  const isStaff = user?.role === 'admin' || user?.role === 'company_admin' || user?.role === 'specialist';
  const dashboardHref = !isAuthenticated ? '/' : isStaff ? '/admin/dashboard' : '/dashboard';

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
                +7 (495) 777-01-20
              </li>
              <li className="flex items-center gap-2 text-sm text-[#6b7280]">
                <Mail className="w-4 h-4 text-[#1a56db]" />
                school@ucs-service.ru
              </li>
              <li className="flex items-start gap-2 text-sm text-[#6b7280]">
                <MapPin className="w-4 h-4 text-[#1a56db] mt-0.5" />
                <span>Москва, Большой Полуярославский пер., д. 10 стр. 1</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#6b7280]">
                <MapPin className="w-4 h-4 text-[#1a56db] mt-0.5" />
                <span>Воронеж, Московский проспект, 4, Бизнес Парк Московский, 10 этаж</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3 text-[#111827]">Правовая информация</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-[#6b7280] hover:text-[#1a56db] no-underline transition-colors">Политика конфиденциальности</Link></li>
              <li><Link href="/consent" className="text-sm text-[#6b7280] hover:text-[#1a56db] no-underline transition-colors">Согласие на обработку ПДн</Link></li>
              <li><Link href="/terms" className="text-sm text-[#6b7280] hover:text-[#1a56db] no-underline transition-colors">Пользовательское соглашение</Link></li>
              <li><Link href="/offer" className="text-sm text-[#6b7280] hover:text-[#1a56db] no-underline transition-colors">Публичная оферта</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#e5e7eb] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#9ca3af]">
          <span>ООО ЦТО «ЮСИЭС сервис» &copy; {new Date().getFullYear()}. Все права защищены.</span>
          <span>ОГРН 1037723040871 / ИНН 7723347991</span>
        </div>
      </div>
    </footer>
  );
}
