import { useEffect, useCallback, useRef } from 'react';
import { checkTaskStatus } from '../api/newsletter';
import type { Task } from '../types';

interface UseTaskPollingProps {
  currentTask: Task | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onFinish: () => void;
  retryTimeout?: number;
}

export function useTaskPolling({
  currentTask,
  isLoading,
  setIsLoading,
  setError,
  onFinish,
  retryTimeout = 8000
}: UseTaskPollingProps) {
  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollTaskStatus = useCallback(async () => {
    if (!currentTask?.task_id) return;

    try {
      const updatedTask = await checkTaskStatus(currentTask.task_id);
      const status = updatedTask.status.toUpperCase();

      if (status === 'PENDING') return;

      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      setIsLoading(false);

      const actions: Record<string, () => void> = {
        SUCCESS: () => {
          setError(null);
          onFinish();
        },
        DEFAULT: () => {
          setError('Failed to generate newsletter. Please try again.');
        },
      };

      const actionToExecute = actions[status] || actions.DEFAULT;
      actionToExecute();
    } catch (err) {
      console.error('Error checking task status:', err);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      setError('Failed to check task status');
      setIsLoading(false);
    }
  }, [currentTask, setIsLoading, setError, onFinish]);

  useEffect(() => {
    if (currentTask && isLoading) {
      intervalIdRef.current = setInterval(pollTaskStatus, retryTimeout);
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [currentTask, isLoading, pollTaskStatus, retryTimeout]);
}
