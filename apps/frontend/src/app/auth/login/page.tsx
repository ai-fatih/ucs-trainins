'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [tab, setTab] = useState<'company' | 'individual'>('company');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contract, setContract] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const identifier = tab === 'company' ? contract : email;
      const secret = tab === 'company' ? accessCode : password;
      if (!identifier) { toast.error('Заполните обязательные поля'); setLoading(false); return; }
      const actualEmail = tab === 'company' ? `${contract}@company` : email || 'root@ucs.ru';
      const { user } = await api.auth.login(actualEmail, secret);
      login(user);
      toast.success('Вы успешно вошли!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
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
              <Input label="Номер договора" value={contract} onChange={(e) => setContract(e.target.value)} />
              <Input label="Код доступа" type="password" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} />
            </>
          )}
          {tab === 'individual' && (
            <>
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <div className="text-right -mt-3 mb-3"><Link href="#" className="text-xs text-[#1a56db]">Забыли пароль?</Link></div>
            </>
          )}
          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            {tab === 'company' ? 'Войти как компания' : 'Войти'}
          </Button>
          <p className="text-xs text-center text-[#9ca3af] mt-4">
            Продолжая вход, вы принимаете условия <Link href="/terms" className="text-[#1a56db] underline">Пользовательского соглашения</Link> и <Link href="/privacy" className="text-[#1a56db] underline">Политики конфиденциальности</Link>
          </p>
        </form>

        <p className="text-center mt-6 text-sm text-[#6b7280]">
          {tab === 'company' ? <>Нет договора? <Link href="/auth/register">Зарегистрироваться как физлицо</Link></> : <>Нет аккаунта? <Link href="/auth/register">Зарегистрироваться</Link></>}
        </p>
      </div>
    </div>
  );
}
