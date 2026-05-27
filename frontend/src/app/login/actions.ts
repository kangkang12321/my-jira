'use server';

import { authApi } from '@/lib/api';
import { setToken } from '@/lib/api';
import { redirect } from 'next/navigation';

// Server Action: 用户登录
export async function loginAction(_prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: '请填写所有字段' };
  }

  try {
    const response = await authApi.login({ email, password });
    const { access_token, user } = response.data;

    // 设置 token
    setToken(access_token);

    // 使用重定向而不是返回数据（Server Action 特性）
    redirect('/');
  } catch (error: any) {
    return {
      error: error.response?.data?.message || '登录失败，请检查凭据',
    };
  }
}
