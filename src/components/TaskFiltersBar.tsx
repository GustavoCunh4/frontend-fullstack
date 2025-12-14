import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { TaskFilters, TaskPriority, TaskStatus } from '../api/tasks';

const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'completed', label: 'Concluída' }
];

const priorityOptions: Array<{ value: TaskPriority; label: string }> = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' }
];

type FiltersDraft = {
  status: TaskStatus | '';
  priority: TaskPriority | '';
  title: string;
  dueDate: string;
};

const emptyDraft: FiltersDraft = {
  status: '',
  priority: '',
  title: '',
  dueDate: ''
};

function toDraft(filters: TaskFilters): FiltersDraft {
  return {
    status: filters.status ?? '',
    priority: filters.priority ?? '',
    title: filters.title ?? '',
    dueDate: filters.dueDate ?? ''
  };
}

interface TaskFiltersProps {
  initialFilters: TaskFilters;
  onApply: (filters: TaskFilters) => void;
  onReset: () => void;
}

export function TaskFiltersBar({
  initialFilters,
  onApply,
  onReset
}: TaskFiltersProps) {
  const [filters, setFilters] = useState<FiltersDraft>(toDraft(initialFilters));

  useEffect(() => {
    setFilters(toDraft(initialFilters));
  }, [initialFilters]);

  const handleChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onApply({
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      title: filters.title || undefined,
      dueDate: filters.dueDate || undefined
    });
  };

  const handleReset = () => {
    setFilters(emptyDraft);
    onReset();
  };

  return (
    <form className="card form-grid filters" onSubmit={handleSubmit}>
      <label>
        <span>Status</span>
        <select
          name="status"
          value={filters.status ?? ''}
          onChange={handleChange}
        >
          <option value="">Todos</option>
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Prioridade</span>
        <select
          name="priority"
          value={filters.priority ?? ''}
          onChange={handleChange}
        >
          <option value="">Todas</option>
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Título contém</span>
        <input
          name="title"
          value={filters.title ?? ''}
          onChange={handleChange}
          placeholder="ex.: API"
        />
      </label>

      <label>
        <span>Data limite</span>
        <input
          type="date"
          name="dueDate"
          value={filters.dueDate ?? ''}
          onChange={handleChange}
        />
      </label>

      <div className="form-actions inline">
        <button type="submit" className="ghost">
          Aplicar
        </button>
        <button type="button" className="text" onClick={handleReset}>
          Limpar
        </button>
      </div>
    </form>
  );
}
