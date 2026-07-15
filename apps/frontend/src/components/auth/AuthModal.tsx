'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import type { UserRole } from '@/types';
import { X, Mail, Lock, Building2, User, Phone, Loader2 } from 'lucide-react';

type Tab = 'login' | 'register';
type UserType = 'company' | 'individual';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>('login');
  const [userType, setUserType] = useState<UserType>('individual');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contract, setContract] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const redirectAfterLogin = (role: UserRole) => {
    const isStaff = role === 'admin' || role === 'company_admin' || role === 'specialist';
    router.push(isStaff ? '/admin/dashboard' : '/dashboard');
  };

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const identifier = userType === 'company' ? contract : email;
      const code = userType === 'company' ? accessCode : password;
      if (!identifier) { setError('Введите email или номер договора'); setLoading(false); return; }
      const actualEmail = userType === 'company' ? `${contract}@company` : email;
      const { user } = await api.auth.login(actualEmail, code);
      login(user);
      onClose();
      redirectAfterLogin(user.role);
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !password) { setError('Заполните обязательные поля'); return; }
    setLoading(true);
    try {
      const { user } = await api.auth.register({ name, email, phone, password, userType });
      login(user);
      onClose();
      redirectAfterLogin(user.role);
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="glass-strong rounded-2xl max-w-md w-full p-8 relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-[#6b7280] hover:text-[#111827] transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#111827]">Добро пожаловать</h2>
          <p className="text-sm text-[#6b7280] mt-1">Войдите или создайте аккаунт</p>
        </div>

        <div className="flex glass rounded-lg p-1 mb-6">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${
              tab === 'login' ? 'bg-[#1a56db] text-white shadow-md' : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-all ${
              tab === 'register' ? 'bg-[#1a56db] text-white shadow-md' : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            Регистрация
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <div className="space-y-4">
            <div className="flex glass rounded-lg p-1">
              <button
                onClick={() => setUserType('individual')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  userType === 'individual' ? 'bg-white text-[#1a56db] shadow-sm' : 'text-[#6b7280]'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Физлицо
              </button>
              <button
                onClick={() => setUserType('company')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  userType === 'company' ? 'bg-white text-[#1a56db] shadow-sm' : 'text-[#6b7280]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Юрлицо
              </button>
            </div>

            {userType === 'individual' ? (
              <>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="text"
                    placeholder="Номер договора"
                    value={contract}
                    onChange={(e) => setContract(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
                  <input
                    type="password"
                    placeholder="Код доступа"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="form-input pl-10"
                  />
                </div>
              </>
            )}

            <button onClick={handleLogin} disabled={loading} className="glass-btn w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Вход...</> : 'Войти'}
            </button>

            <p className="text-xs text-center text-[#9ca3af]">
              Продолжая вход, вы принимаете условия <Link href="/terms" className="text-[#1a56db] underline">Пользовательского соглашения</Link> и <Link href="/privacy" className="text-[#1a56db] underline">Политики конфиденциальности</Link>
            </p>

            <p className="text-xs text-center text-[#9ca3af]">
              Демо: root@ucs.ru / admin или user@ucs.ru / admin
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Имя *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input
                type="tel"
                placeholder="Телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
              <input
                type="password"
                placeholder="Пароль *"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            <div className="flex glass rounded-lg p-1">
              <button
                onClick={() => setUserType('individual')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                  userType === 'individual' ? 'bg-white text-[#1a56db] shadow-sm' : 'text-[#6b7280]'
                }`}
              >
                Физлицо
              </button>
              <button
                onClick={() => setUserType('company')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
                  userType === 'company' ? 'bg-white text-[#1a56db] shadow-sm' : 'text-[#6b7280]'
                }`}
              >
                Юрлицо
              </button>
            </div>

            <label className="flex items-start gap-3 text-sm text-[#6b7280]">
              <input type="checkbox" required className="mt-0.5 shrink-0" />
              <span>Даю <Link href="/consent" className="text-[#1a56db] underline">согласие на обработку персональных данных</Link> в соответствии с <Link href="/privacy" className="text-[#1a56db] underline">Политикой конфиденциальности</Link> <span className="text-[#dc2626]">*</span></span>
            </label>
            <button onClick={handleRegister} disabled={loading} className="glass-btn w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Регистрация...</> : 'Зарегистрироваться'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
