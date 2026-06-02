import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const ACCESS_TOKEN_COOKIE = 'access_token';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Server-side token management. Server Actions cannot read or write browser localStorage.
const getToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
};

const setToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
};

const removeToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
};

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export { api, getToken, setToken, removeToken };

export const authApi = {
  register: (data: { email: string; password: string; username: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  me: () => api.get('/auth/me'),
};

export const projectsApi = {
  list: () => api.get('/projects'),
  get: (id: number) => api.get(`/projects/${id}`),
  create: (data: { name: string; description?: string }) =>
    api.post('/projects', data),
  update: (id: number, data: { name?: string; description?: string }) =>
    api.patch(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
  getMembers: (id: number) => api.get(`/projects/${id}/members`),
  addMember: (id: number, data: { email: string; role?: string }) =>
    api.post(`/projects/${id}/members`, data),
  removeMember: (id: number, userId: number) =>
    api.delete(`/projects/${id}/members/${userId}`),
};

export const issuesApi = {
  list: (projectId: number, params?: { status?: string; priority?: string; type?: string }) =>
    api.get(`/projects/${projectId}/issues`, { params }),

  get: (id: number) => api.get(`/issues/${id}`),

  create: (projectId: number, data: {
    title: string;
    description?: string;
    type?: string;
    priority?: string;
    assigneeId?: number;
  }) => api.post(`/projects/${projectId}/issues`, data),

  update: (id: number, data: Partial<{
    title: string;
    description: string;
    status: string;
    priority: string;
    type: string;
    assigneeId: number;
    sprintId: number;
    storyPoints: number;
    dueDate: Date;
  }>) => api.patch(`/issues/${id}`, data),

  delete: (id: number) => api.delete(`/issues/${id}`),

  getHistory: (id: number) => api.get(`/issues/${id}/history`),
};

export const sprintsApi = {
  list: (projectId: number) => api.get(`/projects/${projectId}/sprints`),

  get: (id: number) => api.get(`/sprints/${id}`),

  create: (projectId: number, data: { name: string; description?: string; startDate?: Date; endDate?: Date }) =>
    api.post(`/projects/${projectId}/sprints`, data),

  update: (id: number, data: Partial<{ name: string; description: string; status: string; startDate: Date; endDate: Date }>) =>
    api.patch(`/sprints/${id}`, data),

  delete: (id: number) => api.delete(`/sprints/${id}`),
};

export const commentsApi = {
  list: (issueId: number) => api.get(`/issues/${issueId}/comments`),

  create: (issueId: number, data: { content: string }) =>
    api.post(`/issues/${issueId}/comments`, data),

  update: (id: number, data: { content: string }) =>
    api.patch(`/comments/${id}`, data),

  delete: (id: number) => api.delete(`/comments/${id}`),
};
