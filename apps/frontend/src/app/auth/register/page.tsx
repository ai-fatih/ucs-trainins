'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!name || !email || !phone || !password) { toast.error('Заполните обязательные поля'); return; }
      if (password !== passwordConfirm) { toast.error('Пароли не совпадают'); return; }
      if (password.length < 6) { toast.error('Пароль должен быть минимум 6 символов'); return; }
      setStep(2);
      return;
    }
    setLoading(true);
    try {
      const { user } = await api.auth.register({ name: `${name} ${surname}`.trim(), email, phone, password, userType: 'individual' });
      login(user);
      toast.success('Регистрация завершена! Добро пожаловать.');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">Регистрация</h1>
          <p className="text-sm text-[#6b7280]">Создайте аккаунт для записи на консультации и тренинги</p>
        </div>

        <div className="flex justify-center items-center gap-2 mb-8 text-sm">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${step >= 1 ? 'bg-[#059669] text-white' : 'bg-[#f3f4f6] text-[#9ca3af]'}`}>1</span>
          <span className="w-8 h-px bg-[#e5e7eb]" />
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${step >= 2 ? 'bg-[#059669] text-white' : 'bg-[#f3f4f6] text-[#9ca3af]'}`}>2</span>
          <span className="w-8 h-px bg-[#e5e7eb]" />
          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${step >= 3 ? 'bg-[#059669] text-white' : 'bg-[#f3f4f6] text-[#9ca3af]'}`}>3</span>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Имя *" value={name} onChange={(e) => setName(e.target.value)} />
                <Input label="Фамилия" value={surname} onChange={(e) => setSurname(e.target.value)} />
              </div>
              <Input label="Email *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} hint="На этот email придёт письмо с подтверждением" />
              <Input label="Телефон *" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} hint="Для связи по записям" />
              <Input label="Пароль *" type="password" value={password} onChange={(e) => setPassword(e.target.value)} hint="Минимум 6 символов" />
              <Input label="Подтверждение пароля *" type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
              <Button type="submit" variant="primary" size="lg" className="w-full">Далее</Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="bg-[#f9fafb] rounded-md p-4 mb-4">
                <label className="flex items-start gap-3 text-sm text-[#6b7280] mb-4">
                  <input type="checkbox" required className="mt-0.5" />
                  <span>Даю <Link href="/consent" className="text-[#1a56db] underline">согласие на обработку персональных данных</Link> в соответствии с <Link href="/privacy" className="text-[#1a56db] underline">Политикой конфиденциальности</Link> и принимаю условия <Link href="/terms" className="text-[#1a56db] underline">Пользовательского соглашения</Link> <span className="text-[#dc2626]">*</span></span>
                </label>
                <label className="flex items-start gap-3 text-sm text-[#9ca3af]">
                  <input type="checkbox" checked={agreeMarketing} onChange={(e) => setAgreeMarketing(e.target.checked)} className="mt-0.5" />
                  <span>Согласен получать информацию о новых тренингах и акциях</span>
                </label>
              </div>
              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </>
          )}
        </form>

        <p className="text-center mt-6 text-sm text-[#6b7280]">
          Уже есть аккаунт? <Link href="/auth/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
