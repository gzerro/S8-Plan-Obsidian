import { getLocale, getWeekdayLabel } from './i18n';
import type { PlannerLanguage } from './types';

export function jsDayToWeekday(jsDay: number): number {
  return jsDay === 0 ? 7 : jsDay;
}

export function weekdayToJsDay(weekday: number): number {
  return weekday === 7 ? 0 : weekday;
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function startOfWeekMonday(source: Date): Date {
  const d = new Date(source.getFullYear(), source.getMonth(), source.getDate());
  const weekday = jsDayToWeekday(d.getDay());
  d.setDate(d.getDate() - (weekday - 1));
  return d;
}

export function addDays(source: Date, amount: number): Date {
  const d = new Date(source.getFullYear(), source.getMonth(), source.getDate());
  d.setDate(d.getDate() + amount);
  return d;
}

export function getWeekDates(weekStartMonday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStartMonday, i));
}

export function formatMonthYear(date: Date, language: PlannerLanguage): string {
  return date.toLocaleDateString(getLocale(language), {
    month: 'long',
    year: 'numeric'
  });
}

export function formatMonthOnly(date: Date, language: PlannerLanguage): string {
  return date.toLocaleDateString(getLocale(language), {
    month: 'long'
  });
}

export function formatDayTitle(date: Date, language: PlannerLanguage): string {
  const weekday = jsDayToWeekday(date.getDay());
  const label = getWeekdayLabel(weekday, language);
  const shortDate = date.toLocaleDateString(getLocale(language), {
    month: 'short',
    day: 'numeric'
  });
  return `${label} • ${shortDate}`;
}

export function getDatesInMonth(year: number, monthIndex: number): Date[] {
  const first = new Date(year, monthIndex, 1);
  const nextMonth = new Date(year, monthIndex + 1, 1);
  const days = Math.round((nextMonth.getTime() - first.getTime()) / 86400000);
  return Array.from({ length: days }, (_, i) => new Date(year, monthIndex, i + 1));
}

export function getWeekOfMonthInfo(weekStartMonday: Date, monthReferenceDate: Date): { index: number; total: number } {
  const year = monthReferenceDate.getFullYear();
  const month = monthReferenceDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const firstWeekStart = startOfWeekMonday(firstDay);
  const lastWeekStart = startOfWeekMonday(lastDay);
  const currentWeekStart = startOfWeekMonday(weekStartMonday);

  const total = Math.floor((lastWeekStart.getTime() - firstWeekStart.getTime()) / 604800000) + 1;
  const rawIndex = Math.floor((currentWeekStart.getTime() - firstWeekStart.getTime()) / 604800000) + 1;
  const index = Math.min(Math.max(rawIndex, 1), total);

  return { index, total };
}
