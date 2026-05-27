'use client';

import { useState, useTransition, startTransition } from 'react';
import { createProjectAction } from '@/app/actions';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { X } from 'lucide-react';

interface CreateProjectFormProps {
  onProjectCreated?: () => void;
}

export function CreateProjectForm({ onProjectCreated }: CreateProjectFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('description', formData.description);

    startTransition(async () => {
      const result = await createProjectAction(formDataObj);

      if (!result.error) {
        // 重置表单
        setFormData({ name: '', description: '' });
        setIsOpen(false);

        // 通知父组件
        onProjectCreated?.();
      } else {
        alert(result.error);
      }
    });
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full">
        + 创建项目
      </Button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">创建新项目</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          disabled={isPending}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">项目名称 *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="我的项目"
            disabled={isPending}
          />
        </div>

        <div>
          <Label htmlFor="description">项目描述</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="项目简介"
            disabled={isPending}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending || !formData.name}>
            {isPending ? '创建中...' : '创建'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isPending}
          >
            取消
          </Button>
        </div>
      </form>
    </div>
  );
}