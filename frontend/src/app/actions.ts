'use server';

import { revalidatePath } from 'next/cache';
import { projectsApi } from '@/lib/api';

// Server Action: 获取项目列表
export async function getProjectsAction() {
  try {
    const response = await projectsApi.list();
    return response.data;
  } catch (error) {
    return [];
  }
}

// Server Action: 创建项目
export async function createProjectAction(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!name) {
    return { error: '项目名称不能为空' };
  }

  try {
    const response = await projectsApi.create({ name, description });

    // 重新验证缓存
    revalidatePath('/');

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      error: error.response?.data?.message || '创建项目失败',
    };
  }
}

// Server Action: 删除项目
export async function deleteProjectAction(projectId: number) {
  try {
    await projectsApi.delete(projectId);

    // 重新验证缓存
    revalidatePath('/');

    return { success: true };
  } catch (error: any) {
    return {
      error: error.response?.data?.message || '删除项目失败',
    };
  }
}