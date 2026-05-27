'use server';

import { authApi } from '@/lib/api';
import { setToken } from '@/lib/api';
import { redirect } from 'next/navigation';

// Server Action: 用户注册
export async function registerAction(_prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const username = formData.get('username') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!email || !password || !username) {
    return { error: '请填写所有字段' };
  }

  if (password !== confirmPassword) {
    return { error: '两次密码输入不一致' };
  }

  if (password.length < 6) {
    return { error: '密码长度至少为 6 位' };
  }

  try {
    const response = await authApi.register({ email, password, username });
    const { access_token, user } = response.data;

    // 设置 token
    setToken(access_token);

    redirect('/');
  } catch (error: any) {
    return {
      error: error.response?.data?.message || '注册失败，邮箱可能已被使用',
    };
  }
}
