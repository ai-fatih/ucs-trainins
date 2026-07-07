'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiClient.auth.login(email, password);
      router.replace('/admin/requests');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Не удалось войти');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-xl font-bold">Вход администратора</h1>
        {error && <p className="mb-4 text-sm text-[#dc2626]">{error}</p>}
        <Input label="Email" type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} />
        <Input label="Пароль" type="password" required minLength={8} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <Button type="submit" loading={loading} className="w-full">Войти</Button>
      </form>
    </div>
  );
}
