import { projectsApi } from '@/lib/api';
import { Project } from '@/types';

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