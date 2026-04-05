import type { PlannerLanguage } from './types';

type TranslationKey =
  | 'weekInMonth'
  | 'todayButton'
  | 'previousWeek'
  | 'nextWeek'
  | 'goToCurrentWeek'
  | 'overallProgress'
  | 'completed'
  | 'today'
  | 'noTasksYetAddInSettings'
  | 'noTasksForDay'
  | 'toggleTask'
  | 'openWeeklyPlanner'
  | 'couldNotCreatePlannerTab'
  | 'couldNotOpenWeeklyPlannerView'
  | 'weeklyPlannerSettings'
  | 'language'
  | 'languageDescription'
  | 'english'
  | 'russian'
  | 'tasks'
  | 'noTasksYet'
  | 'createTask'
  | 'taskTitle'
  | 'taskTitlePlaceholder'
  | 'actions'
  | 'addTask'
  | 'save'
  | 'delete'
  | 'moveUp'
  | 'moveDown'
  | 'weekViewDisplayName'
  | 'overallButton'
  | 'weekButton'
  | 'year'
  | 'dayProgressTitle'
  | 'yearProgress';

const TRANSLATIONS: Record<PlannerLanguage, Record<TranslationKey, string>> = {
  en: {
    weekInMonth: 'Week in month',
    todayButton: 'Today',
    previousWeek: 'Previous week',
    nextWeek: 'Next week',
    goToCurrentWeek: 'Go to current week',
    overallProgress: 'Overall progress',
    completed: 'Completed',
    today: 'Today',
    noTasksYetAddInSettings: 'No tasks yet. Add tasks in plugin settings.',
    noTasksForDay: 'No tasks for this day.',
    toggleTask: 'Toggle {title}',
    openWeeklyPlanner: 'Open weekly planner',
    couldNotCreatePlannerTab: 'Could not create planner tab',
    couldNotOpenWeeklyPlannerView: 'Could not open weekly planner view: {details}',
    weeklyPlannerSettings: 'Weekly planner settings',
    language: 'Language',
    languageDescription: 'Choose interface language.',
    english: 'English',
    russian: 'Русский',
    tasks: 'Tasks',
    noTasksYet: 'No tasks yet.',
    createTask: 'Create task',
    taskTitle: 'Task title',
    taskTitlePlaceholder: 'Task title',
    actions: 'Actions',
    addTask: 'Add task',
    save: 'Save',
    delete: 'Delete',
    moveUp: 'Move up',
    moveDown: 'Move down',
    weekViewDisplayName: 'Week',
    overallButton: 'Overall',
    weekButton: 'Week',
    year: 'Year',
    dayProgressTitle: '{date}: {completed}/{planned} ({percent}%)',
    yearProgress: 'Year progress'
  },
  ru: {
    weekInMonth: 'Неделя месяца',
    todayButton: 'Сегодня',
    previousWeek: 'Предыдущая неделя',
    nextWeek: 'Следующая неделя',
    goToCurrentWeek: 'Перейти к текущей неделе',
    overallProgress: 'Общий прогресс',
    completed: 'Выполнено',
    today: 'Сегодня',
    noTasksYetAddInSettings: 'Пока нет задач. Добавьте задачи в настройках плагина.',
    noTasksForDay: 'На этот день задач нет.',
    toggleTask: 'Переключить {title}',
    openWeeklyPlanner: 'Открыть недельный планер',
    couldNotCreatePlannerTab: 'Не удалось создать вкладку планера',
    couldNotOpenWeeklyPlannerView: 'Не удалось открыть планер: {details}',
    weeklyPlannerSettings: 'Настройки недельного планера',
    language: 'Язык',
    languageDescription: 'Выберите язык интерфейса.',
    english: 'English',
    russian: 'Русский',
    tasks: 'Задачи',
    noTasksYet: 'Пока нет задач.',
    createTask: 'Создать задачу',
    taskTitle: 'Название задачи',
    taskTitlePlaceholder: 'Название задачи',
    actions: 'Действия',
    addTask: 'Добавить задачу',
    save: 'Сохранить',
    delete: 'Удалить',
    moveUp: 'Вверх',
    moveDown: 'Вниз',
    weekViewDisplayName: 'Неделя',
    overallButton: 'Общее',
    weekButton: 'Неделя',
    year: 'Год',
    dayProgressTitle: '{date}: {completed}/{planned} ({percent}%)',
    yearProgress: 'Прогресс за год'
  }
};

const WEEKDAY_LABELS: Record<PlannerLanguage, Record<number, string>> = {
  en: {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday'
  },
  ru: {
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
    7: 'Воскресенье'
  }
};

export function t(
  language: PlannerLanguage,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  const template = TRANSLATIONS[language][key];
  if (!params) {
    return template;
  }

  return Object.entries(params).reduce((result, [name, value]) => {
    return result.replace(`{${name}}`, String(value));
  }, template);
}

export function getWeekdayLabel(weekday: number, language: PlannerLanguage): string {
  return WEEKDAY_LABELS[language][weekday];
}

export function getLocale(language: PlannerLanguage): string {
  return language === 'ru' ? 'ru-RU' : 'en-US';
}
