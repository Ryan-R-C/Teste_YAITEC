import { useEffect } from 'react';
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
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
  
    const pollTaskStatus = async () => {
      if (!currentTask?.task_id) return;
  
      try {
        const updatedTask = await checkTaskStatus(currentTask.task_id);
        const status = updatedTask.status.toUpperCase();
  
        if (status === 'PENDING') return;
  
        clearInterval(intervalId);
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
        clearInterval(intervalId);
        setError('Failed to check task status');
        setIsLoading(false);
      }
    };
  
    if (currentTask && isLoading) {
      intervalId = setInterval(pollTaskStatus, retryTimeout);
    }
  
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [currentTask, isLoading]);
}
