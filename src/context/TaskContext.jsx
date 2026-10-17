import { createContext, useContext, useState, useEffect } from 'react';

export const TaskContext = createContext(null);

const TASKS_STORAGE_KEY = 'task_manager_tasks_data';

export const INITIAL_TASKS = [
  {
    id: 'task_1',
    title: 'Complete React',
    description: 'Complete CRUD Operation',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-10-20',
    createdAt: '2026-10-10T10:00:00.000Z',
    updatedAt: '2026-10-10T10:00:00.000Z',
  },
  {
    id: 'task_2',
    title: 'Configure Dashboard Filters',
    description: 'Add status and priority filter controls for quick task lookup.',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '2026-10-25',
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
      window.localStorage.setItem(
        TASKS_STORAGE_KEY,
        JSON.stringify(INITIAL_TASKS)
      );
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
      id: taskInput?.id ? String(taskInput.id) : `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: String(taskInput?.title || '').trim(),
      description: String(taskInput?.description || '').trim(),
      status: taskInput?.status || 'In Progress',
      priority: taskInput?.priority || 'High',
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
              ? String(updatedFields.title).trim()
              : task.title,
          description:
            updatedFields?.description !== undefined
              ? String(updatedFields.description).trim()
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
  const [tasks, setTasks] = useState(readInitialTasks);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      }
    } catch {
      // Ignore storage quota issues
    }
  }, [tasks]);

  const addTask = (taskData) => {
    const now = new Date().toISOString();
    const newTask = {
      id: `task_${Date.now()}`,
      title: String(taskData.title || '').trim(),
      description: String(taskData.description || '').trim(),
      status: taskData.status || 'In Progress',
      priority: taskData.priority || 'High',
      dueDate: taskData.dueDate || new Date().toISOString().slice(0, 10),
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
    return newTask;
  };

  const getTaskById = (id) => {
    return tasks.find((task) => String(task.id) === String(id)) || null;
  };

  const updateTask = (id, updatedData) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        String(task.id) === String(id)
          ? {
              ...task,
              ...updatedData,
              id: task.id,
              title: String(updatedData.title ?? task.title).trim(),
              description: String(
                updatedData.description ?? task.description
              ).trim(),
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => String(task.id) !== String(id))
    );
  };

  const toggleTaskStatus = (id) => {
    const statusOrder = ['Pending', 'In Progress', 'Completed'];
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (String(task.id) !== String(id)) return task;
        const nextIndex =
          (statusOrder.indexOf(task.status) + 1) % statusOrder.length;
        return {
          ...task,
          status: statusOrder[nextIndex],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const resetTasks = () => {
    setTasks(INITIAL_TASKS);
  };

  const value = {
    tasks,
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
