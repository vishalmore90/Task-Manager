import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext.jsx';
import { ArrowLeft } from 'lucide-react';

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
      <section className="mx-auto max-w-xl px-6 py-20 text-center">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-8">
          <h1 className="text-xl font-bold text-white">Task Not Found</h1>
          <p className="mt-2 text-sm text-zinc-400">
            The requested task does not exist or was deleted.
          </p>
          <div className="mt-6">
            <Link to="/tasks" className="btn-primary">
              Return to Backlog
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-6">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to All Tasks</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-8 sm:p-10">
        <div className="border-b border-zinc-800 pb-6">
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {isEditMode ? 'Edit Task' : 'Add New Task'}
          </h1>
          <p className="mt-1 text-sm text-zinc-300">
            {isEditMode
              ? 'Update the parameters for this milestone.'
              : 'Register a new milestone in your execution registry.'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-300"
            >
              Task Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Implement Web Crypto Password Hashing"
              {...register('title', {
                required: 'Task title is required',
                minLength: { value: 3, message: 'Minimum 3 characters required' },
                maxLength: { value: 120, message: 'Maximum 120 characters allowed' },
              })}
              className="input-field"
            />
            {errors.title && (
              <p className="mt-1.5 text-xs text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-300"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Specify requirements, constraints, and success criteria..."
              {...register('description', {
                maxLength: { value: 2000, message: 'Maximum 2000 characters allowed' },
              })}
              className="input-field"
            />
            {errors.description && (
              <p className="mt-1.5 text-xs text-red-400">{errors.description.message}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-300"
              >
                Status
              </label>
              <select
                id="status"
                {...register('status', { required: 'Status is required' })}
                className="input-field"
              >
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-300"
              >
                Priority
              </label>
              <select
                id="priority"
                {...register('priority', { required: 'Priority is required' })}
                className="input-field"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dueDate"
                className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-300"
              >
                Due Date
              </label>
              <input
                id="dueDate"
                type="date"
                {...register('dueDate', { required: 'Due date is required' })}
                className="input-field"
              >
              </input>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-6">
            <button type="submit" className="btn-primary w-full sm:w-auto">
              {isEditMode ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
