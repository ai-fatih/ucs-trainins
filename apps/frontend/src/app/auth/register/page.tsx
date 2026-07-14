'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) { setStep(2); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('✓ Регистрация завершена! Письмо отправлено на email.');
    setLoading(false);
    router.push('/auth/login');
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
                <Input label="Имя" defaultValue="Иван" />
                <Input label="Фамилия" defaultValue="Петров" />
              </div>
              <Input label="Email *" type="email" defaultValue="ivan@example.ru" hint="На этот email придёт письмо с подтверждением" />
              <Input label="Телефон *" type="tel" defaultValue="+7 (999) 123-45-67" hint="Для идентификации в чате (149-ФЗ)" />
              <Input label="Пароль *" type="password" hint="Минимум 8 символов: буквы + цифры" />
              <Input label="Подтверждение пароля" type="password" />
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
                  <input type="checkbox" className="mt-0.5" />
                  <span>Согласен получать информацию о новых тренингах и акциях</span>
                </label>
              </div>
              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                {loading ? 'Отправка...' : 'Зарегистрироваться'}
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
