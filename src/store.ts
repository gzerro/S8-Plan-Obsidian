import type WeeklyPlannerPlugin from './main';
import { getDatesInMonth, jsDayToWeekday, toISODate } from './date-utils';
import type { MonthProgress, PlannerData, PlannerLanguage, Task, TaskMonthlyProgress } from './types';

const DEFAULT_DATA: PlannerData = {
  tasks: [],
  completionsByDate: {},
  language: 'en'
};

export class PlannerStore {
  private plugin: WeeklyPlannerPlugin;
  private data: PlannerData = { ...DEFAULT_DATA };

  constructor(plugin: WeeklyPlannerPlugin) {
    this.plugin = plugin;
  }

  async load(): Promise<void> {
    const loaded = (await this.plugin.loadData()) as Partial<PlannerData> | null;
    this.data = {
      tasks: Array.isArray(loaded?.tasks) ? loaded?.tasks : [],
      completionsByDate:
        loaded?.completionsByDate && typeof loaded.completionsByDate === 'object'
          ? loaded.completionsByDate
          : {},
      language: loaded?.language === 'ru' || loaded?.language === 'en' ? loaded.language : DEFAULT_DATA.language
    };
    this.normalizeOrders();
    await this.save();
  }

  async save(): Promise<void> {
    await this.plugin.saveData(this.data);
  }

  getTasks(): Task[] {
    return [...this.data.tasks].sort((a, b) => a.order - b.order);
  }

  getLanguage(): PlannerLanguage {
    return this.data.language;
  }

  async setLanguage(language: PlannerLanguage): Promise<void> {
    this.data.language = language;
    await this.save();
  }

  getActiveTasks(): Task[] {
    return this.getTasks().filter((task) => !task.archived);
  }

  async addTask(title: string, weekdays: number[]): Promise<void> {
    const cleanTitle = title.trim();
    if (!cleanTitle || weekdays.length === 0) {
      return;
    }

    const tasks = this.getTasks();
    const task: Task = {
      id: this.generateTaskId(),
      title: cleanTitle,
      weekdays: [...new Set(weekdays)].sort((a, b) => a - b),
      order: tasks.length,
      createdAt: new Date().toISOString()
    };

    this.data.tasks.push(task);
    await this.save();
  }

  async updateTask(taskId: string, updates: Partial<Pick<Task, 'title' | 'weekdays'>>): Promise<void> {
    const task = this.data.tasks.find((t) => t.id === taskId);
    if (!task) {
      return;
    }

    if (typeof updates.title === 'string') {
      task.title = updates.title.trim();
    }

    if (Array.isArray(updates.weekdays)) {
      task.weekdays = [...new Set(updates.weekdays)].sort((a, b) => a - b);
    }

    await this.save();
  }

  async deleteTask(taskId: string): Promise<void> {
    this.data.tasks = this.data.tasks.filter((task) => task.id !== taskId);
    for (const date of Object.keys(this.data.completionsByDate)) {
      this.data.completionsByDate[date] = this.data.completionsByDate[date].filter((id) => id !== taskId);
      if (this.data.completionsByDate[date].length === 0) {
        delete this.data.completionsByDate[date];
      }
    }
    this.normalizeOrders();
    await this.save();
  }

  async moveTask(taskId: string, direction: 'up' | 'down'): Promise<void> {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === taskId);
    if (index < 0) {
      return;
    }

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tasks.length) {
      return;
    }

    const [item] = tasks.splice(index, 1);
    tasks.splice(targetIndex, 0, item);
    tasks.forEach((task, i) => {
      const original = this.data.tasks.find((t) => t.id === task.id);
      if (original) {
        original.order = i;
      }
    });
    await this.save();
  }

  getTasksForWeekday(weekday: number): Task[] {
    return this.getActiveTasks().filter((task) => task.weekdays.includes(weekday));
  }

  isTaskCompletedOnDate(taskId: string, isoDate: string): boolean {
    const completed = this.data.completionsByDate[isoDate] ?? [];
    return completed.includes(taskId);
  }

  async toggleTaskCompletion(taskId: string, date: Date): Promise<void> {
    const isoDate = toISODate(date);
    const completed = new Set(this.data.completionsByDate[isoDate] ?? []);

    if (completed.has(taskId)) {
      completed.delete(taskId);
    } else {
      completed.add(taskId);
    }

    if (completed.size === 0) {
      delete this.data.completionsByDate[isoDate];
    } else {
      this.data.completionsByDate[isoDate] = [...completed];
    }

    await this.save();
  }

  getTaskMonthlyProgress(task: Task, referenceDate: Date): TaskMonthlyProgress {
    const year = referenceDate.getFullYear();
    const monthIndex = referenceDate.getMonth();
    const dates = getDatesInMonth(year, monthIndex);

    let planned = 0;
    let completed = 0;

    dates.forEach((date) => {
      const weekday = jsDayToWeekday(date.getDay());
      if (!task.weekdays.includes(weekday)) {
        return;
      }
      planned += 1;
      if (this.isTaskCompletedOnDate(task.id, toISODate(date))) {
        completed += 1;
      }
    });

    const remaining = Math.max(planned - completed, 0);
    const percent = planned === 0 ? 0 : Math.round((completed / planned) * 100);

    return {
      taskId: task.id,
      planned,
      completed,
      remaining,
      percent
    };
  }

  getOverallMonthProgress(referenceDate: Date): MonthProgress {
    const tasks = this.getActiveTasks();

    const totals = tasks.reduce(
      (acc, task) => {
        const progress = this.getTaskMonthlyProgress(task, referenceDate);
        acc.planned += progress.planned;
        acc.completed += progress.completed;
        return acc;
      },
      { planned: 0, completed: 0 }
    );

    const percent = totals.planned === 0 ? 0 : Math.round((totals.completed / totals.planned) * 100);

    return {
      planned: totals.planned,
      completed: totals.completed,
      percent
    };
  }

  getOverallYearProgress(referenceDate: Date): MonthProgress {
    const year = referenceDate.getFullYear();
    let planned = 0;
    let completed = 0;

    for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
      const dates = getDatesInMonth(year, monthIndex);
      dates.forEach((date) => {
        const progress = this.getDateProgress(date);
        planned += progress.planned;
        completed += progress.completed;
      });
    }

    const percent = planned === 0 ? 0 : Math.round((completed / planned) * 100);
    return { planned, completed, percent };
  }

  getTodayProgress(today: Date): MonthProgress {
    return this.getDateProgress(today);
  }

  getDateProgress(date: Date): MonthProgress {
    const weekday = jsDayToWeekday(date.getDay());
    const tasks = this.getTasksForWeekday(weekday);
    const iso = toISODate(date);
    const planned = tasks.length;
    const completed = tasks.filter((task) => this.isTaskCompletedOnDate(task.id, iso)).length;
    const percent = planned === 0 ? 0 : Math.round((completed / planned) * 100);

    return { planned, completed, percent };
  }

  private generateTaskId(): string {
    return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private normalizeOrders(): void {
    const sorted = [...this.data.tasks].sort((a, b) => a.order - b.order);
    sorted.forEach((task, index) => {
      task.order = index;
    });
    this.data.tasks = sorted;
  }
}
