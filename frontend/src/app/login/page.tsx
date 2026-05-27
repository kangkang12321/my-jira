'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from './actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? '登录中...' : '登录'}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Jira Clone
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            项目管理系统
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">邮箱地址</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            <div>
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <SubmitButton />

          <div className="text-center text-sm">
            <span className="text-gray-600">还没有账号？</span>
            <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500 ml-1">
              立即注册
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
