import { getProjects } from './data';
import { ProjectList } from '@/components/project-list';
import { CreateProjectForm } from '@/components/create-project-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Server Component - 默认就是 Server Component
export default async function HomePage() {
  // SSR: 服务器端获取数据
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                Jira Clone
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">项目管理</span>
            </div>

            <nav className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">登录</Button>
              </Link>
              <Link href="/register">
                <Button>注册</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">我的项目</h1>
          <p className="mt-2 text-gray-600">管理和跟踪你的所有项目</p>
        </div>

        <CreateProjectForm />

        {/* Project List - 使用 'use client' 标记的组件 */}
        <ProjectList initialProjects={projects} />
      </main>
    </div>
  );
}