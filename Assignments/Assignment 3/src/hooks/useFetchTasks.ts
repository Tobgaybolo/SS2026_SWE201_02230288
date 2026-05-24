import { useEffect, useCallback, useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { fetchTasks } from '../api/tasksApi';
import { fetchCategories } from '../api/categoriesApi';

const useFetchTasks = () => {
  const { dispatch } = useAppContext();
  const [retryCount, setRetryCount] = useState(0);

  const loadData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Fetch tasks and categories in parallel
      const [tasks, categories] = await Promise.all([
        fetchTasks(),
        fetchCategories(),
      ]);
      dispatch({ type: 'SET_TASKS', payload: tasks });
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load data.';
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, retryCount]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Expose retry — increments retryCount which triggers useEffect again
  const retry = () => setRetryCount((c) => c + 1);

  return { retry };
};

export default useFetchTasks;