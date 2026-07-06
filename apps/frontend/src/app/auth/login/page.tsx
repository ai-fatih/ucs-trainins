'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [tab, setTab] = useState<'company' | 'individual'>('company');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    login({ id: 'user1', email: tab === 'company' ? 'admin@restoran.ru' : 'ivan@example.ru', name: tab === 'company' ? 'ООО «Ресторанъ»' : 'Иван Петров', phone: '+7 (999) 123-45-67', userType: tab, role: tab === 'company' ? 'company_admin' : 'user', companyId: tab === 'company' ? 'comp1' : undefined });
    toast.success('Вы успешно вошли!');
    setLoading(false);
    router.push('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-[#1a56db]">UCS service</h1>
          <p className="text-sm text-[#6b7280]">Консультации и обучение</p>
        </div>

        <div className="flex mb-6 border border-[#d1d5db] rounded-md overflow-hidden">
          <button onClick={() => setTab('company')} className={`flex-1 py-2.5 text-sm font-medium transition-all ${tab === 'company' ? 'bg-[#1a56db] text-white' : 'bg-white text-[#6b7280] hover:bg-[#f9fafb]'}`}>Компания</button>
          <button onClick={() => setTab('individual')} className={`flex-1 py-2.5 text-sm font-medium transition-all ${tab === 'individual' ? 'bg-[#1a56db] text-white' : 'bg-white text-[#6b7280] hover:bg-[#f9fafb]'}`}>Физлицо</button>
        </div>

        <form onSubmit={handleSubmit}>
          {tab === 'company' && (
            <>
              <div className="bg-[#e8effa] rounded-md p-3 mb-5 text-sm text-[#374151]">
                <strong className="text-[#1a56db]">✓ Активный договор?</strong> Консультации бесплатно в рамках поддержки.
              </div>
              <Input label="Номер договора" defaultValue="Д-2025-0891" />
              <Input label="Код доступа" type="password" defaultValue="••••••" />
            </>
          )}
          {tab === 'individual' && (
            <>
              <Input label="Email" type="email" defaultValue="ivan@example.ru" />
              <Input label="Пароль" type="password" />
              <div className="text-right -mt-3 mb-3"><Link href="#" className="text-xs text-[#1a56db]">Забыли пароль?</Link></div>
            </>
          )}
          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            {tab === 'company' ? 'Войти как компания' : 'Войти'}
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-[#6b7280]">
          {tab === 'company' ? <>Нет договора? <Link href="/auth/register">Зарегистрироваться как физлицо</Link></> : <>Нет аккаунта? <Link href="/auth/register">Зарегистрироваться</Link></>}
        </p>
      </div>
    </div>
  );
}
