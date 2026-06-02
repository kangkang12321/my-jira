import { authApi, projectsApi } from '@/lib/api';
import { Project, User } from '@/types';

/**
 * Server-side data fetching function
 * 使用 SSR 在服务器端获取数据
 */
export async function getProjects(): Promise<Project[]> {
  try {
    const response = await projectsApi.list();
    return response.data;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await authApi.me();
    return response.data;
  } catch (error) {
    return null;
  }
}
