'use client';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useHydrated } from '@/lib/hooks/useHydrated';
import { AuthModal } from '@/components/auth/AuthModal';
import { Bell, Palette, Shield, User, ArrowRight } from 'lucide-react';

const sections = [
  { icon: User, title: 'Личные данные', desc: 'Имя, email, телефон и контактные данные' },
  { icon: Bell, title: 'Уведомления', desc: 'Каналы и события для оповещений' },
  { icon: Palette, title: 'Внешний вид', desc: 'Тема и оформление интерфейса' },
  { icon: Shield, title: 'Безопасность', desc: 'Пароль и управление доступом' },
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const hydrated = useHydrated();
  const effectiveUser = hydrated ? user : null;
  const [authOpen, setAuthOpen] = useState(false);

  if (!effectiveUser) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-16 text-center">
        <div className="glass-card max-w-md mx-auto p-8">
          <h2 className="text-xl font-bold mb-4">Войдите в аккаунт</h2>
          <p className="text-sm text-[#6b7280] mb-6">Для доступа к настройкам необходимо авторизоваться</p>
          <button onClick={() => setAuthOpen(true)} className="glass-btn">
            Войти <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-1">Настройки</h1>
      <p className="text-sm text-[#6b7280] mb-8">Управление аккаунтом, уведомлениями и внешним видом</p>

      <div className="space-y-3">
        {sections.map((s) => (
          <div key={s.title} className="glass-card p-5 flex items-center gap-4">
            <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1a56db] to-[#0d9488] text-white flex items-center justify-center shrink-0">
              <s.icon className="w-5 h-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#111827]">{s.title}</h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f3f4f6] text-[#6b7280] font-semibold">скоро</span>
              </div>
              <p className="text-xs text-[#6b7280] mt-0.5">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
