'use client';

import { useState, useTransition, useOptimistic, startTransition } from 'react';
import { Project } from '@/types';
import { deleteProjectAction } from '@/app/actions';
import { Button } from './ui/button';
import { useAuthStore } from '@/store/auth';
import { formatDate } from '@/lib/utils';

interface ProjectListProps {
  initialProjects: Project[];
}

export function ProjectList({ initialProjects }: ProjectListProps) {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState(initialProjects);
  const [isPending, startTransition] = useTransition();

  // Optimistic updates - 立即更新 UI
  const [optimisticProjects, deleteOptimistic] = useOptimistic(
    projects,
    (state, projectId: number) => state.filter(p => p.id !== projectId)
  );

  const handleDelete = (projectId: number) => {
    // Optimistic update
    deleteOptimistic(projectId);

    // 实际删除
    startTransition(async () => {
      const result = await deleteProjectAction(projectId);

      if (!result.error) {
        // 如果成功，更新本地状态
        setProjects(prev => prev.filter(p => p.id !== projectId));
      } else {
        // 如果失败，回滚乐观更新（通过重新获取数据）
        const { getProjectsAction } = await import('@/app/actions');
        const freshProjects = await getProjectsAction();
        setProjects(freshProjects);
      }
    });
  };

  if (optimisticProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">暂无项目</p>
        <p className="text-gray-400 text-sm mt-2">点击上方按钮创建你的第一个项目</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {optimisticProjects.map((project) => (
        <div
          key={project.id}
          className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-primary-100 text-primary-700 px-2 py-1 rounded">
                  {project.key}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mt-2">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>

            {user && project.ownerId === user.id && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(project.id)}
                disabled={isPending}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {isPending ? '...' : '×'}
              </Button>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>创建于 {formatDate(project.createdAt)}</span>
              <Button
                variant="link"
                className="p-0 h-auto text-primary-600"
                onClick={() => {
                  startTransition(() => {
                    window.location.href = `/projects/${project.id}`;
                  });
                }}
              >
                查看详情 →
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}