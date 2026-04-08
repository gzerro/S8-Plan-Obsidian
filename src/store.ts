import { TFile } from 'obsidian';
import type WeeklyPlannerPlugin from './main';
import { getDatesInMonth, jsDayToWeekday, toISODate } from './date-utils';
import { DATA_FILE_PATH } from './constants';
import type { MonthProgress, PlannerData, PlannerLanguage, Task, TaskMonthlyProgress } from './types';

const DEFAULT_DATA: PlannerData = {
  tasks: [],
  completionsByDate: {},
  language: 'en'
};

const DATA_FILE_TITLE = '# S8 Plan Data';
const DATA_FILE_NAME_PATTERN = /^S8 Plan Data(?: \(\d+\))?\.md$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseLanguage(value: unknown): PlannerLanguage {
  return value === 'ru' || value === 'en' ? value : DEFAULT_DATA.language;
}

function parseWeekdays(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const valid = value.filter((day): day is number => typeof day === 'number' && Number.isInteger(day) && day >= 1 && day <= 7);
  return [...new Set(valid)].sort((a, b) => a - b);
}

function parseCompletionsByDate(value: unknown): Record<string, string[]> {
  if (!isRecord(value)) {
    return {};
  }

  const result: Record<string, string[]> = {};
  Object.entries(value).forEach(([date, taskIds]) => {
    if (!Array.isArray(taskIds)) {
      return;
    }

    const validIds = taskIds.filter((id): id is string => typeof id === 'string');
    if (validIds.length > 0) {
      result[date] = [...new Set(validIds)];
    }
  });

  return result;
}

function parseTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const tasks: Task[] = [];
  value.forEach((entry, index) => {
    if (!isRecord(entry)) {
      return;
    }

    const id = typeof entry.id === 'string' ? entry.id : '';
    const title = typeof entry.title === 'string' ? entry.title : '';
    if (!id || !title.trim()) {
      return;
    }

    const task: Task = {
      id,
      title: title.trim(),
      weekdays: parseWeekdays(entry.weekdays),
      order: typeof entry.order === 'number' && Number.isFinite(entry.order) ? entry.order : index
    };

    if (typeof entry.createdAt === 'string') {
      task.createdAt = entry.createdAt;
    }

    if (typeof entry.archived === 'boolean') {
      task.archived = entry.archived;
    }

    tasks.push(task);
  });

  return tasks;
}

function hasMeaningfulData(data: PlannerData): boolean {
  return data.tasks.length > 0 || Object.keys(data.completionsByDate).length > 0 || data.language !== DEFAULT_DATA.language;
}

export class PlannerStore {
  private plugin: WeeklyPlannerPlugin;
  private data: PlannerData = { ...DEFAULT_DATA };

  constructor(plugin: WeeklyPlannerPlugin) {
    this.plugin = plugin;
  }

  isPlannerDataPath(path: string): boolean {
    if (!path) {
      return false;
    }

    const slash = path.lastIndexOf('/');
    const fileName = slash >= 0 ? path.slice(slash + 1) : path;
    return DATA_FILE_NAME_PATTERN.test(fileName);
  }

  async load(): Promise<void> {
    const vaultData = await this.readVaultDataFile();
    if (vaultData) {
      this.data = vaultData;
      this.normalizeOrders();
      return;
    }

    const legacyLoaded = await this.plugin.loadData();
    const legacyData = this.coerceData(legacyLoaded);
    this.data = legacyData;
    this.normalizeOrders();

    if (hasMeaningfulData(this.data)) {
      await this.writeVaultDataFile();
    }
  }

  async save(): Promise<void> {
    await this.writeVaultDataFile();
  }

  async reloadFromDataFile(): Promise<boolean> {
    const vaultData = await this.readVaultDataFile();
    if (!vaultData) {
      return false;
    }

    this.data = vaultData;
    this.normalizeOrders();
    return true;
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

  private coerceData(source: unknown): PlannerData {
    if (!isRecord(source)) {
      return { ...DEFAULT_DATA };
    }

    return {
      tasks: parseTasks(source.tasks),
      completionsByDate: parseCompletionsByDate(source.completionsByDate),
      language: parseLanguage(source.language)
    };
  }

  private parseMarkdownData(markdown: string): PlannerData | null {
    const jsonBlock = markdown.match(/```json\s*([\s\S]*?)\s*```/i);
    const rawJson = jsonBlock ? jsonBlock[1] : markdown.trim();
    if (!rawJson) {
      return null;
    }

    try {
      const parsed = JSON.parse(rawJson) as unknown;
      return this.coerceData(parsed);
    } catch (error) {
      console.error('Failed to parse S8 Plan Data.md', error);
      return null;
    }
  }

  private serializeMarkdownData(data: PlannerData): string {
    return `${DATA_FILE_TITLE}\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n`;
  }

  private getAllPlannerDataFiles(): TFile[] {
    return this.plugin.app.vault.getMarkdownFiles().filter((file) => this.isPlannerDataPath(file.path));
  }

  private getDuplicatePlannerDataFiles(): TFile[] {
    return this.getAllPlannerDataFiles().filter((file) => file.path !== DATA_FILE_PATH);
  }

  private async removeDuplicateDataFiles(): Promise<void> {
    const duplicates = this.getDuplicatePlannerDataFiles();
    for (const duplicate of duplicates) {
      try {
        await this.plugin.app.vault.delete(duplicate, true);
      } catch (error) {
        console.error('Failed to delete duplicate planner data file', duplicate.path, error);
      }
    }
  }

  private async readVaultDataFile(): Promise<PlannerData | null> {
    const files = this.getAllPlannerDataFiles().sort((a, b) => b.stat.mtime - a.stat.mtime);
    if (files.length === 0) {
      return null;
    }

    for (const file of files) {
      const markdown = await this.plugin.app.vault.read(file);
      const parsed = this.parseMarkdownData(markdown);
      if (!parsed) {
        continue;
      }

      const normalized = this.serializeMarkdownData(parsed);
      await this.writeVaultDataMarkdown(normalized);
      await this.removeDuplicateDataFiles();
      return parsed;
    }

    return null;
  }

  private async writeVaultDataFile(): Promise<void> {
    const markdown = this.serializeMarkdownData(this.data);
    await this.writeVaultDataMarkdown(markdown);
    await this.removeDuplicateDataFiles();
  }

  private async writeVaultDataMarkdown(markdown: string): Promise<void> {
    const existing = this.plugin.app.vault.getAbstractFileByPath(DATA_FILE_PATH);

    if (existing instanceof TFile) {
      const current = await this.plugin.app.vault.read(existing);
      if (current === markdown) {
        return;
      }
      await this.plugin.app.vault.modify(existing, markdown);
      return;
    }

    await this.plugin.app.vault.create(DATA_FILE_PATH, markdown);
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
