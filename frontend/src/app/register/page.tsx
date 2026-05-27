'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { registerAction } from './actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? '注册中...' : '注册'}
    </Button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerAction, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            创建账号
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            加入 Jira Clone 项目管理
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
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="johndoe"
                autoComplete="username"
              />
            </div>

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
                placeholder="至少 6 位"
                autoComplete="new-password"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">确认密码</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="再次输入密码"
                autoComplete="new-password"
              />
            </div>
          </div>

          <SubmitButton />

          <div className="text-center text-sm">
            <span className="text-gray-600">已有账号？</span>
            <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500 ml-1">
              立即登录
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
