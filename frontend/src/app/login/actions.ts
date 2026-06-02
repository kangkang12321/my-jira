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
  let showRedirect = false;

  try {
    const response = await authApi.login({ email, password });
    const { access_token } = response.data;

    // Server Actions run on the server, so persist auth with an HTTP-only cookie.
    await setToken(access_token);
    showRedirect = true;

  } catch (error: any) {
    return {
      error: error.response?.data?.message || '登录失败，请检查凭据',
    };
  }

  if (showRedirect) {
    // 使用重定向而不是返回数据（Server Action 特性）
    redirect('/');
  }
}
