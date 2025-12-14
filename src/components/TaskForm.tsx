import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type {
  Task,
  TaskPayload,
  TaskPriority,
  TaskStatus
} from '../api/tasks';
import { toInputDate } from '../utils/date';

const statusOptions: TaskStatus[] = ['pending', 'in_progress', 'completed'];
const priorityOptions: TaskPriority[] = ['low', 'medium', 'high'];

interface TaskFormProps {
  editingTask?: Task | null;
  submitting: boolean;
  onSubmit: (payload: TaskPayload) => Promise<void> | void;
  onCancelEdit: () => void;
}

interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

const defaultValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: ''
};

export function TaskForm({
  editingTask,
  submitting,
  onSubmit,
  onCancelEdit
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(defaultValues);

  useEffect(() => {
    if (editingTask) {
      setValues({
        title: editingTask.title,
        description: editingTask.description ?? '',
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: toInputDate(editingTask.dueDate)
      });
    } else {
      setValues(defaultValues);
    }
  }, [editingTask]);

  const handleChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const payload: TaskPayload = {
      title: values.title.trim(),
      description: values.description.trim()
        ? values.description.trim()
        : undefined,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate || null
    };
    await onSubmit(payload);
  };

  const isEditing = Boolean(editingTask);

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          <span>Título</span>
          <input
            name="title"
            value={values.title}
            onChange={handleChange}
            required
            maxLength={200}
          />
        </label>

        <label>
          <span>Prioridade</span>
          <select
            name="priority"
            value={values.priority}
            onChange={handleChange}
          >
            {priorityOptions.map(option => (
              <option key={option} value={option}>
                {option === 'low'
                  ? 'Baixa'
                  : option === 'medium'
                    ? 'Média'
                    : 'Alta'}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Status</span>
          <select name="status" value={values.status} onChange={handleChange}>
            {statusOptions.map(option => (
              <option key={option} value={option}>
                {option === 'pending'
                  ? 'Pendente'
                  : option === 'in_progress'
                    ? 'Em andamento'
                    : 'Concluída'}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          <span>Descrição</span>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={2}
            maxLength={2000}
          />
        </label>
        <label>
          <span>Data limite</span>
          <input
            type="date"
            name="dueDate"
            value={values.dueDate}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="form-actions">
        <button className="primary" type="submit" disabled={submitting}>
          {submitting
            ? 'Salvando...'
            : isEditing
              ? 'Atualizar tarefa'
              : 'Criar tarefa'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="ghost"
            onClick={onCancelEdit}
            disabled={submitting}
          >
            Cancelar edição
          </button>
        )}
      </div>
    </form>
  );
}
