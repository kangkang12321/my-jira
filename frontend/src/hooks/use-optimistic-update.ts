'use client';

import { useState, useTransition, useCallback } from 'react';

/**
 * 使用 useTransition 和 optimistic updates 的自定义 Hook
 * 适用于需要立即更新 UI 的场景，同时保留数据一致性
 */
export function useOptimisticUpdate<T, Args extends unknown[]>(
  mutationFn: (...args: Args) => Promise<T>
) {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    (...args: Args) => {
      setError(null);

      // 使用 startTransition 包裹更新操作
      startTransition(async () => {
        try {
          const result = await mutationFn(...args);
          setData(result);
        } catch (e) {
          setError(e as Error);
        }
      });
    },
    [mutationFn]
  );

  return { data, error, isPending, mutate };
}

/**
 * 使用 useTransition 处理表单提交
 */
export function useFormSubmit<T extends Record<string, any>>(
  action: (data: T) => Promise<void>
) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = useCallback(
    (data: T) => {
      setErrors({});
      startTransition(async () => {
        try {
          await action(data);
        } catch (e: any) {
          if (e.response?.data?.message) {
            setErrors({ general: e.response.data.message });
          } else {
            setErrors({ general: '操作失败，请重试' });
          }
        }
      });
    },
    [action]
  );

  return { submit, isPending, errors };
}

/**
 * 使用 startTransition 优化导航
 */
export function useOptimisticNavigation() {
  const [isNavigating, startTransition] = useTransition();

  const navigate = useCallback(
    (navigateFn: () => void) => {
      startTransition(() => {
        navigateFn();
      });
    },
    []
  );

  return { isNavigating, navigate };
}
