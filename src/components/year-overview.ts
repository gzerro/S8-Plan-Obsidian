import { formatMonthOnly } from '../date-utils';
import { getLocale, t } from '../i18n';
import type { PlannerLanguage } from '../types';

interface YearDayProgress {
  date: Date;
  planned: number;
  completed: number;
  percent: number;
  isToday: boolean;
}

interface YearMonthOverview {
  monthDate: Date;
  days: YearDayProgress[];
}

interface YearOverviewInput {
  language: PlannerLanguage;
  year: number;
  months: YearMonthOverview[];
}

export function renderYearOverview(container: HTMLElement, input: YearOverviewInput): void {
  const wrap = container.createDiv({ cls: 'wp-year-overview' });

  input.months.forEach((month) => {
    const monthSection = wrap.createDiv({ cls: 'wp-year-month' });
    monthSection.createDiv({
      cls: 'wp-year-month-title',
      text: `${formatMonthOnly(month.monthDate, input.language)} ${input.year}`
    });

    const grid = monthSection.createDiv({ cls: 'wp-year-grid' });
    month.days.forEach((day) => {
      const circle = grid.createDiv({ cls: 'wp-day-circle', text: `${day.percent}%` });
      if (day.percent === 0) {
        circle.addClass('is-zero');
      } else {
        circle.addClass('is-done');
      }
      if (day.isToday) {
        circle.addClass('is-today');
      }

      const shortDate = day.date.toLocaleDateString(getLocale(input.language), {
        month: 'short',
        day: 'numeric'
      });
      circle.setAttr(
        'title',
        t(input.language, 'dayProgressTitle', {
          date: shortDate,
          completed: day.completed,
          planned: day.planned,
          percent: day.percent
        })
      );
    });
  });
}
