import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { sanitizeText } from '../utils/sanitize.js';

export const TaskContext = createContext(null);

const TASKS_STORAGE_KEY = 'task_manager_tasks_data_v2';

export const INITIAL_TASKS = [
  {
    id: 'task_1',
    userId: 'usr_default',
    title: 'Complete React Architecture',
    description: 'Audit component hierarchy, props validation, and state isolation.',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: '2026-10-14',
    createdAt: '2026-10-10T10:00:00.000Z',
    updatedAt: '2026-10-10T10:00:00.000Z',
  },
  {
    id: 'task_2',
    userId: 'usr_default',
    title: 'Implement Security Headers',
    description: 'Configure CSP, HSTS, frame-ancestors, and permissions policy in production.',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '2026-10-28',
    createdAt: '2026-10-11T11:30:00.000Z',
    updatedAt: '2026-10-11T11:30:00.000Z',
  },
];

function readInitialTasks() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return INITIAL_TASKS;
    }
    const saved = window.localStorage.getItem(TASKS_STORAGE_KEY);
    if (!saved) {
      window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch {
    return INITIAL_TASKS;
  }
}

export function createTaskStore(seedTasks = INITIAL_TASKS) {
  let tasks = Array.isArray(seedTasks) ? [...seedTasks] : [];

  const getAllTasks = () => [...tasks];

  const getTaskById = (id) =>
    tasks.find((task) => String(task.id) === String(id)) || null;

  const addTask = (taskInput) => {
    const now = new Date().toISOString();
    const newTask = {
      id: taskInput?.id
        ? String(taskInput.id)
        : `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userId: taskInput?.userId || 'usr_default',
      title: sanitizeText(taskInput?.title || '', 120),
      description: sanitizeText(taskInput?.description || '', 2000),
      status: ['Pending', 'In Progress', 'Completed'].includes(taskInput?.status)
        ? taskInput.status
        : 'In Progress',
      priority: ['High', 'Medium', 'Low'].includes(taskInput?.priority)
        ? taskInput.priority
        : 'High',
      dueDate: taskInput?.dueDate || new Date().toISOString().slice(0, 10),
      createdAt: now,
      updatedAt: now,
    };
    tasks = [newTask, ...tasks];
    return newTask;
  };

  const updateTask = (id, updatedFields) => {
    let updatedItem = null;
    tasks = tasks.map((task) => {
      if (String(task.id) === String(id)) {
        updatedItem = {
          ...task,
          ...updatedFields,
          id: task.id,
          title:
            updatedFields?.title !== undefined
              ? sanitizeText(updatedFields.title, 120)
              : task.title,
          description:
            updatedFields?.description !== undefined
              ? sanitizeText(updatedFields.description, 2000)
              : task.description,
          updatedAt: new Date().toISOString(),
        };
        return updatedItem;
      }
      return task;
    });
    return updatedItem;
  };

  const deleteTask = (id) => {
    const beforeCount = tasks.length;
    tasks = tasks.filter((task) => String(task.id) !== String(id));
    return tasks.length < beforeCount;
  };

  return {
    getAllTasks,
    getTaskById,
    addTask,
    updateTask,
    deleteTask,
  };
}

export function TaskProvider({ children }) {
  const { user, isAdmin } = useAuth();
  const [allTasks, setAllTasks] = useState(readInitialTasks);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(allTasks));
      }
    } catch {
      // Storage fallback
    }
  }, [allTasks]);

  // Scoped task visibility: users only see their own tasks, or admin sees all
  const currentUserId = user?.id || 'usr_default';
  const visibleTasks = allTasks.filter((t) => {
    if (isAdmin) return true;
    if (!t.userId || t.userId === 'usr_default') return true;
    return t.userId === currentUserId;
  });

  const addTask = (taskData) => {
    const now = new Date().toISOString();
    const newTask = {
      id: `task_${Date.now()}`,
      userId: currentUserId,
      title: sanitizeText(taskData.title || '', 120),
      description: sanitizeText(taskData.description || '', 2000),
      status: ['Pending', 'In Progress', 'Completed'].includes(taskData.status)
        ? taskData.status
        : 'In Progress',
      priority: ['High', 'Medium', 'Low'].includes(taskData.priority)
        ? taskData.priority
        : 'High',
      dueDate: taskData.dueDate || new Date().toISOString().slice(0, 10),
      createdAt: now,
      updatedAt: now,
    };
    setAllTasks((prevTasks) => [newTask, ...prevTasks]);
    return newTask;
  };

  const getTaskById = (id) => {
    return (
      visibleTasks.find((task) => String(task.id) === String(id)) || null
    );
  };

  const updateTask = (id, updatedData) => {
    setAllTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (String(task.id) !== String(id)) return task;
        // Verify ownership unless admin
        if (!isAdmin && task.userId && task.userId !== currentUserId && task.userId !== 'usr_default') {
          return task;
        }
        return {
          ...task,
          ...updatedData,
          id: task.id,
          title:
            updatedData.title !== undefined
              ? sanitizeText(updatedData.title, 120)
              : task.title,
          description:
            updatedData.description !== undefined
              ? sanitizeText(updatedData.description, 2000)
              : task.description,
          status: ['Pending', 'In Progress', 'Completed'].includes(updatedData.status)
            ? updatedData.status
            : task.status,
          priority: ['High', 'Medium', 'Low'].includes(updatedData.priority)
            ? updatedData.priority
            : task.priority,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const deleteTask = (id) => {
    setAllTasks((prevTasks) =>
      prevTasks.filter((task) => {
        if (String(task.id) !== String(id)) return true;
        // Verify ownership unless admin
        if (!isAdmin && task.userId && task.userId !== currentUserId && task.userId !== 'usr_default') {
          return true; // Keep task, unauthorized
        }
        return false;
      })
    );
  };

  const toggleTaskStatus = (id) => {
    const statusOrder = ['Pending', 'In Progress', 'Completed'];
    setAllTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (String(task.id) !== String(id)) return task;
        const nextIndex = (statusOrder.indexOf(task.status) + 1) % statusOrder.length;
        return {
          ...task,
          status: statusOrder[nextIndex],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const resetTasks = () => {
    setAllTasks(INITIAL_TASKS);
  };

  const value = {
    tasks: visibleTasks,
    allTasksCount: allTasks.length,
    addTask,
    getTaskById,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    resetTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
