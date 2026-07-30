import Link from 'next/link';

export default function AuthPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-xl font-bold text-[#1a56db]">UCS service</h1>
        <p className="text-sm text-[#6b7280] mb-8">Консультации и обучение</p>

        <div className="flex flex-col gap-4">
          <Link
            href="/auth/login"
            className="block w-full py-3 px-6 rounded-lg text-sm font-semibold text-white bg-[#1a56db] hover:bg-[#1a4fbf] transition-colors text-center no-underline"
          >
            Войти
          </Link>
          <Link
            href="/auth/register"
            className="block w-full py-3 px-6 rounded-lg text-sm font-semibold text-[#1a56db] bg-[#e8effa] hover:bg-[#d6e3f7] transition-colors text-center no-underline"
          >
            Зарегистрироваться
          </Link>
        </div>

        <p className="text-xs text-center text-[#9ca3af] mt-8">
          Продолжая вход, вы принимаете условия{' '}
          <Link href="/terms" className="text-[#1a56db] underline">Пользовательского соглашения</Link>{' '}
          и{' '}<Link href="/privacy" className="text-[#1a56db] underline">Политики конфиденциальности</Link>
        </p>
      </div>
    </div>
  );
}
