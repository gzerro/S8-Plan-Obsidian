import { ItemView, WorkspaceLeaf } from 'obsidian';
import type WeeklyPlannerPlugin from './main';
import {
  formatMonthYear,
  getDatesInMonth,
  getWeekDates,
  getWeekOfMonthInfo,
  jsDayToWeekday,
  startOfWeekMonday,
  toISODate
} from './date-utils';
import { renderPlannerHeader } from './components/header';
import { renderDaySection } from './components/day-section';
import { renderYearOverview } from './components/year-overview';
import { VIEW_TYPE_WEEKLY_PLANNER } from './constants';
import { t } from './i18n';
import type { PlannerLanguage } from './types';

type PlannerMode = 'week' | 'overall';

export class WeeklyPlannerView extends ItemView {
  private plugin: WeeklyPlannerPlugin;
  private weekStart: Date;
  private mode: PlannerMode = 'week';
  private dayCollapseOverrides = new Map<string, boolean>();

  constructor(leaf: WorkspaceLeaf, plugin: WeeklyPlannerPlugin) {
    super(leaf);
    this.plugin = plugin;
    this.weekStart = startOfWeekMonday(new Date());
  }

  getViewType(): string {
    return VIEW_TYPE_WEEKLY_PLANNER;
  }

  getDisplayText(): string {
    return t(this.plugin.store.getLanguage(), 'weekViewDisplayName');
  }

  getIcon(): string {
    return 'calendar-days';
  }

  async onOpen(): Promise<void> {
    this.render();
  }

  async onClose(): Promise<void> {
    this.contentEl.empty();
  }

  setCurrentWeekStart(date: Date): void {
    this.weekStart = startOfWeekMonday(date);
    this.render();
  }

  refresh(): void {
    this.render();
  }

  private render(): void {
    const root = this.contentEl;
    root.empty();
    root.addClass('wp-root');

    const language = this.plugin.store.getLanguage();
    const today = new Date();
    const todayIso = toISODate(today);
    const headerMonthDate = new Date(this.weekStart.getFullYear(), this.weekStart.getMonth(), 1);
    const weekOfMonth = getWeekOfMonthInfo(this.weekStart, headerMonthDate);
    const progressForHeader =
      this.mode === 'overall'
        ? this.plugin.store.getOverallYearProgress(this.weekStart)
        : this.plugin.store.getOverallMonthProgress(headerMonthDate);
    const todayProgress = this.plugin.store.getTodayProgress(today);

    const monthLabel =
      this.mode === 'overall' ? String(this.weekStart.getFullYear()) : formatMonthYear(headerMonthDate, language);
    const badgeText =
      this.mode === 'overall'
        ? `${t(language, 'year')}: ${this.weekStart.getFullYear()}`
        : `${t(language, 'weekInMonth')}: ${weekOfMonth.index}/${weekOfMonth.total}`;

    renderPlannerHeader(
      root,
      {
        language,
        mode: this.mode,
        monthLabel,
        badgeText,
        overallPercent: progressForHeader.percent,
        overallCompleted: progressForHeader.completed,
        overallPlanned: progressForHeader.planned,
        todayCompleted: todayProgress.completed,
        todayPlanned: todayProgress.planned
      },
      {
        onPrevWeek: () => {
          if (this.mode === 'overall') {
            this.weekStart = new Date(this.weekStart.getFullYear() - 1, this.weekStart.getMonth(), this.weekStart.getDate());
          } else {
            this.weekStart.setDate(this.weekStart.getDate() - 7);
          }
          this.render();
        },
        onNextWeek: () => {
          if (this.mode === 'overall') {
            this.weekStart = new Date(this.weekStart.getFullYear() + 1, this.weekStart.getMonth(), this.weekStart.getDate());
          } else {
            this.weekStart.setDate(this.weekStart.getDate() + 7);
          }
          this.render();
        },
        onToday: () => {
          this.weekStart = startOfWeekMonday(new Date());
          this.render();
        },
        onToggleMode: () => {
          this.mode = this.mode === 'week' ? 'overall' : 'week';
          this.render();
        }
      }
    );

    if (this.mode === 'overall') {
      this.renderOverall(root, language, todayIso);
      return;
    }

    this.renderWeek(root, language, todayIso);
  }

  private renderWeek(root: HTMLElement, language: PlannerLanguage, todayIso: string): void {
    const daysWrap = root.createDiv({ cls: 'wp-days' });
    const weekDates = getWeekDates(this.weekStart);
    const tasks = this.plugin.store.getActiveTasks();

    if (tasks.length === 0) {
      daysWrap.createDiv({ cls: 'wp-empty', text: t(language, 'noTasksYetAddInSettings') });
      return;
    }

    weekDates.forEach((date) => {
      const isoDate = toISODate(date);
      const isToday = isoDate === todayIso;
      const override = this.dayCollapseOverrides.get(isoDate);
      const collapsed = override !== undefined ? override : !isToday;
      const weekday = jsDayToWeekday(date.getDay());

      const dayTasks = this.plugin.store.getTasksForWeekday(weekday).map((task) => {
        const monthly = this.plugin.store.getTaskMonthlyProgress(task, date);
        return {
          task,
          completed: this.plugin.store.isTaskCompletedOnDate(task.id, isoDate),
          progressText: monthly.planned > 0 ? `${monthly.completed}/${monthly.planned} • ${monthly.percent}%` : undefined
        };
      });

      renderDaySection(daysWrap, {
        language,
        date,
        isToday,
        dayTasks,
        collapsed,
        onToggleCollapse: (targetDate) => {
          const targetIso = toISODate(targetDate);
          const targetIsToday = targetIso === todayIso;
          const current = this.dayCollapseOverrides.get(targetIso) ?? !targetIsToday;
          this.dayCollapseOverrides.set(targetIso, !current);
          this.render();
        },
        onToggleTask: async (taskId, toggleDate) => {
          await this.plugin.store.toggleTaskCompletion(taskId, toggleDate);
          this.render();
        }
      });
    });
  }

  private renderOverall(root: HTMLElement, language: PlannerLanguage, todayIso: string): void {
    const holder = root.createDiv({ cls: 'wp-days' });
    const year = this.weekStart.getFullYear();

    const months = Array.from({ length: 12 }, (_, monthIndex) => {
      const monthDate = new Date(year, monthIndex, 1);
      const days = getDatesInMonth(year, monthIndex).map((date) => {
        const progress = this.plugin.store.getDateProgress(date);
        return {
          date,
          planned: progress.planned,
          completed: progress.completed,
          percent: progress.percent,
          isToday: toISODate(date) === todayIso
        };
      });
      return { monthDate, days };
    });

    renderYearOverview(holder, { language, year, months });
  }
}
