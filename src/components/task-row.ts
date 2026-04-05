import { t } from '../i18n';
import type { PlannerLanguage, Task } from '../types';

interface TaskRowInput {
  language: PlannerLanguage;
  task: Task;
  completed: boolean;
  progressText?: string;
  onToggle: () => void;
}

export function renderTaskRow(container: HTMLElement, input: TaskRowInput): void {
  const row = container.createDiv({ cls: 'wp-task-row' });

  const checkbox = row.createEl('input', { cls: 'wp-task-checkbox', type: 'checkbox' });
  checkbox.checked = input.completed;
  checkbox.setAttr('aria-label', t(input.language, 'toggleTask', { title: input.task.title }));
  checkbox.addEventListener('change', input.onToggle);

  const textWrap = row.createDiv();
  const title = textWrap.createDiv({ cls: 'wp-task-title', text: input.task.title });
  if (input.completed) {
    title.addClass('is-done');
  }

  if (input.progressText) {
    textWrap.createDiv({ cls: 'wp-task-meta', text: input.progressText });
  }
}
