import { t } from '../i18n';
import type { PlannerLanguage } from '../types';

type PlannerMode = 'week' | 'overall';

interface HeaderStats {
  language: PlannerLanguage;
  monthLabel: string;
  badgeText: string;
  mode: PlannerMode;
  overallPercent: number;
  overallCompleted: number;
  overallPlanned: number;
  todayCompleted: number;
  todayPlanned: number;
}

interface HeaderHandlers {
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onToggleMode: () => void;
}

export function renderPlannerHeader(container: HTMLElement, stats: HeaderStats, handlers: HeaderHandlers): void {
  const header = container.createDiv({ cls: 'wp-sticky-header' });

  const topRow = header.createDiv({ cls: 'wp-header-top' });
  topRow.createDiv({ cls: 'wp-month-label', text: stats.monthLabel });

  const nav = topRow.createDiv({ cls: 'wp-week-nav' });
  nav.createDiv({ cls: 'wp-week-badge', text: stats.badgeText });

  const prevBtn = nav.createEl('button', { cls: 'wp-nav-btn', text: '<' });
  prevBtn.setAttr('aria-label', t(stats.language, 'previousWeek'));
  prevBtn.addEventListener('click', handlers.onPrevWeek);

  const todayBtn = nav.createEl('button', { cls: 'wp-nav-btn', text: t(stats.language, 'todayButton') });
  todayBtn.setAttr('aria-label', t(stats.language, 'goToCurrentWeek'));
  todayBtn.addEventListener('click', handlers.onToday);

  const nextBtn = nav.createEl('button', { cls: 'wp-nav-btn', text: '>' });
  nextBtn.setAttr('aria-label', t(stats.language, 'nextWeek'));
  nextBtn.addEventListener('click', handlers.onNextWeek);

  const modeRow = header.createDiv({ cls: 'wp-mode-row' });
  const modeBtnText = stats.mode === 'week' ? t(stats.language, 'overallButton') : t(stats.language, 'weekButton');
  const modeBtn = modeRow.createEl('button', { cls: 'wp-mode-btn', text: modeBtnText });
  modeBtn.addEventListener('click', handlers.onToggleMode);

  const statsWrap = header.createDiv({ cls: 'wp-header-stats' });
  if (stats.mode === 'overall') {
    statsWrap.createDiv({ text: `${t(stats.language, 'yearProgress')}: ${stats.overallPercent}%` });
    statsWrap.createDiv({ text: `${t(stats.language, 'completed')}: ${stats.overallCompleted} / ${stats.overallPlanned}` });
  } else {
    statsWrap.createDiv({ text: `${t(stats.language, 'overallProgress')}: ${stats.overallPercent}%` });
    statsWrap.createDiv({ text: `${t(stats.language, 'completed')}: ${stats.overallCompleted} / ${stats.overallPlanned}` });
    statsWrap.createDiv({ text: `${t(stats.language, 'today')}: ${stats.todayCompleted} / ${stats.todayPlanned}` });
  }
}
