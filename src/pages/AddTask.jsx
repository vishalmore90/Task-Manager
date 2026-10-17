import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext.jsx';

export default function AddTask() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { addTask, getTaskById, updateTask } = useTasks();

  const existingTask = isEditMode ? getTaskById(id) : null;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'In Progress',
      priority: 'High',
      dueDate: new Date().toISOString().slice(0, 10),
    },
  });

  useEffect(() => {
    if (isEditMode && existingTask) {
      setValue('title', existingTask.title);
      setValue('description', existingTask.description);
      setValue('status', existingTask.status);
      setValue('priority', existingTask.priority);
      setValue('dueDate', existingTask.dueDate || '');
    } else if (!isEditMode) {
      reset({
        title: '',
        description: '',
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date().toISOString().slice(0, 10),
      });
    }
  }, [id, isEditMode, existingTask, setValue, reset]);

  const onSubmit = (formData) => {
    if (isEditMode && existingTask) {
      updateTask(id, formData);
    } else {
      addTask(formData);
    }
    reset();
    navigate('/tasks');
  };

  if (isEditMode && !existingTask) {
    return (
      <section className="mx-auto max-w-xl px-4 py-12 text-center">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
          <h1 className="text-xl font-bold text-white">Task Not Found</h1>
          <p className="mt-2 text-sm text-slate-400">
            The task you are trying to edit does not exist or was deleted.
          </p>
          <Link to="/tasks" className="btn-primary mt-5 inline-flex">
            Back to All Tasks
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/85 p-6 shadow-2xl sm:p-9">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {isEditMode ? 'Edit Task' : 'Add New Task'}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {isEditMode
                ? 'Update task details below and save your changes.'
                : 'Fill in the details below to create a new task.'}
            </p>
          </div>
          <Link to="/tasks" className="btn-secondary">
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Task Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Complete React JS Project"
              className="input-field"
              {...register('title', {
                required: 'Task title is required',
                minLength: {
                  value: 3,
                  message: 'Task title must be at least 3 characters',
                },
              })}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-400">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
            >
              Task Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Describe the key deliverables and acceptance criteria..."
              className="input-field resize-y"
              {...register('description', {
                required: 'Task description is required',
              })}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="status"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Status
              </label>
              <select
                id="status"
                className="input-field"
                {...register('status', { required: true })}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Priority
              </label>
              <select
                id="priority"
                className="input-field"
                {...register('priority', { required: true })}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                className="input-field"
                {...register('dueDate')}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Link to="/tasks" className="btn-secondary">
              Back to All Tasks
            </Link>
            <button type="submit" className="btn-primary">
              {isEditMode ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
