import { renderTaskRow } from './task-row';
import { formatDayTitle, toISODate } from '../date-utils';
import { t } from '../i18n';
import type { PlannerLanguage, Task } from '../types';

interface DayTask {
  task: Task;
  completed: boolean;
  progressText?: string;
}

interface DaySectionInput {
  language: PlannerLanguage;
  date: Date;
  isToday: boolean;
  dayTasks: DayTask[];
  collapsed: boolean;
  onToggleCollapse: (date: Date) => void;
  onToggleTask: (taskId: string, date: Date) => void;
}

export function renderDaySection(container: HTMLElement, input: DaySectionInput): void {
  const day = container.createDiv({ cls: 'wp-day' });
  if (input.isToday) {
    day.addClass('is-today');
  }
  const headerButton = day.createEl('button', { cls: 'wp-day-header-btn' });
  headerButton.setAttr('aria-expanded', String(!input.collapsed));
  headerButton.addEventListener('click', () => {
    input.onToggleCollapse(new Date(input.date.getFullYear(), input.date.getMonth(), input.date.getDate()));
  });

  headerButton.createDiv({ cls: 'wp-day-title', text: formatDayTitle(input.date, input.language) });
  headerButton.createDiv({ cls: 'wp-day-toggle-label', text: input.collapsed ? '∨' : '∧' });

  if (input.collapsed) {
    day.setAttr('data-date', toISODate(input.date));
    return;
  }

  const list = day.createDiv({ cls: 'wp-task-list' });

  if (input.dayTasks.length === 0) {
    list.createDiv({ cls: 'wp-empty', text: t(input.language, 'noTasksForDay') });
    return;
  }

  input.dayTasks.forEach((item) => {
    renderTaskRow(list, {
      language: input.language,
      task: item.task,
      completed: item.completed,
      progressText: item.progressText,
      onToggle: () => {
        input.onToggleTask(item.task.id, new Date(input.date.getFullYear(), input.date.getMonth(), input.date.getDate()));
      }
    });
  });

  day.setAttr('data-date', toISODate(input.date));
}
