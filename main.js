"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => WeeklyPlannerPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/constants.ts
var VIEW_TYPE_WEEKLY_PLANNER = "weekly-planner-view";
var DATA_FILE_PATH = "S8 Plan Data.md";
var WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 7];

// src/store.ts
var import_obsidian = require("obsidian");

// src/i18n.ts
var TRANSLATIONS = {
  en: {
    weekInMonth: "Week in month",
    todayButton: "Today",
    previousWeek: "Previous week",
    nextWeek: "Next week",
    goToCurrentWeek: "Go to current week",
    overallProgress: "Overall progress",
    completed: "Completed",
    today: "Today",
    noTasksYetAddInSettings: "No tasks yet. Add tasks in plugin settings.",
    noTasksForDay: "No tasks for this day.",
    toggleTask: "Toggle {title}",
    openWeeklyPlanner: "Open weekly planner",
    couldNotCreatePlannerTab: "Could not create planner tab",
    couldNotOpenWeeklyPlannerView: "Could not open weekly planner view: {details}",
    weeklyPlannerSettings: "Weekly planner settings",
    language: "Language",
    languageDescription: "Choose interface language.",
    english: "English",
    russian: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    tasks: "Tasks",
    noTasksYet: "No tasks yet.",
    createTask: "Create task",
    taskTitle: "Task title",
    taskTitlePlaceholder: "Task title",
    actions: "Actions",
    addTask: "Add task",
    save: "Save",
    delete: "Delete",
    moveUp: "Move up",
    moveDown: "Move down",
    weekViewDisplayName: "Week",
    overallButton: "Overall",
    weekButton: "Week",
    year: "Year",
    dayProgressTitle: "{date}: {completed}/{planned} ({percent}%)",
    yearProgress: "Year progress"
  },
  ru: {
    weekInMonth: "\u041D\u0435\u0434\u0435\u043B\u044F \u043C\u0435\u0441\u044F\u0446\u0430",
    todayButton: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F",
    previousWeek: "\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0430\u044F \u043D\u0435\u0434\u0435\u043B\u044F",
    nextWeek: "\u0421\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u043D\u0435\u0434\u0435\u043B\u044F",
    goToCurrentWeek: "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0442\u0435\u043A\u0443\u0449\u0435\u0439 \u043D\u0435\u0434\u0435\u043B\u0435",
    overallProgress: "\u041E\u0431\u0449\u0438\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441",
    completed: "\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E",
    today: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F",
    noTasksYetAddInSettings: "\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u043F\u043B\u0430\u0433\u0438\u043D\u0430.",
    noTasksForDay: "\u041D\u0430 \u044D\u0442\u043E\u0442 \u0434\u0435\u043D\u044C \u0437\u0430\u0434\u0430\u0447 \u043D\u0435\u0442.",
    toggleTask: "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0438\u0442\u044C {title}",
    openWeeklyPlanner: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043D\u0435\u0434\u0435\u043B\u044C\u043D\u044B\u0439 \u043F\u043B\u0430\u043D\u0435\u0440",
    couldNotCreatePlannerTab: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0432\u043A\u043B\u0430\u0434\u043A\u0443 \u043F\u043B\u0430\u043D\u0435\u0440\u0430",
    couldNotOpenWeeklyPlannerView: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u043B\u0430\u043D\u0435\u0440: {details}",
    weeklyPlannerSettings: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043D\u0435\u0434\u0435\u043B\u044C\u043D\u043E\u0433\u043E \u043F\u043B\u0430\u043D\u0435\u0440\u0430",
    language: "\u042F\u0437\u044B\u043A",
    languageDescription: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u044F\u0437\u044B\u043A \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430.",
    english: "English",
    russian: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
    tasks: "\u0417\u0430\u0434\u0430\u0447\u0438",
    noTasksYet: "\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447.",
    createTask: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443",
    taskTitle: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",
    taskTitlePlaceholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438",
    actions: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F",
    addTask: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443",
    save: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
    delete: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
    moveUp: "\u0412\u0432\u0435\u0440\u0445",
    moveDown: "\u0412\u043D\u0438\u0437",
    weekViewDisplayName: "\u041D\u0435\u0434\u0435\u043B\u044F",
    overallButton: "\u041E\u0431\u0449\u0435\u0435",
    weekButton: "\u041D\u0435\u0434\u0435\u043B\u044F",
    year: "\u0413\u043E\u0434",
    dayProgressTitle: "{date}: {completed}/{planned} ({percent}%)",
    yearProgress: "\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0437\u0430 \u0433\u043E\u0434"
  }
};
var WEEKDAY_LABELS = {
  en: {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday"
  },
  ru: {
    1: "\u041F\u043E\u043D\u0435\u0434\u0435\u043B\u044C\u043D\u0438\u043A",
    2: "\u0412\u0442\u043E\u0440\u043D\u0438\u043A",
    3: "\u0421\u0440\u0435\u0434\u0430",
    4: "\u0427\u0435\u0442\u0432\u0435\u0440\u0433",
    5: "\u041F\u044F\u0442\u043D\u0438\u0446\u0430",
    6: "\u0421\u0443\u0431\u0431\u043E\u0442\u0430",
    7: "\u0412\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435"
  }
};
function t(language, key, params) {
  const template = TRANSLATIONS[language][key];
  if (!params) {
    return template;
  }
  return Object.entries(params).reduce((result, [name, value]) => {
    return result.replace(`{${name}}`, String(value));
  }, template);
}
function getWeekdayLabel(weekday, language) {
  return WEEKDAY_LABELS[language][weekday];
}
function getLocale(language) {
  return language === "ru" ? "ru-RU" : "en-US";
}

// src/date-utils.ts
function jsDayToWeekday(jsDay) {
  return jsDay === 0 ? 7 : jsDay;
}
function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function startOfWeekMonday(source) {
  const d = new Date(source.getFullYear(), source.getMonth(), source.getDate());
  const weekday = jsDayToWeekday(d.getDay());
  d.setDate(d.getDate() - (weekday - 1));
  return d;
}
function addDays(source, amount) {
  const d = new Date(source.getFullYear(), source.getMonth(), source.getDate());
  d.setDate(d.getDate() + amount);
  return d;
}
function getWeekDates(weekStartMonday) {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStartMonday, i));
}
function formatMonthYear(date, language) {
  return date.toLocaleDateString(getLocale(language), {
    month: "long",
    year: "numeric"
  });
}
function formatMonthOnly(date, language) {
  return date.toLocaleDateString(getLocale(language), {
    month: "long"
  });
}
function formatDayTitle(date, language) {
  const weekday = jsDayToWeekday(date.getDay());
  const label = getWeekdayLabel(weekday, language);
  const shortDate = date.toLocaleDateString(getLocale(language), {
    month: "short",
    day: "numeric"
  });
  return `${label} \u2022 ${shortDate}`;
}
function getDatesInMonth(year, monthIndex) {
  const first = new Date(year, monthIndex, 1);
  const nextMonth = new Date(year, monthIndex + 1, 1);
  const days = Math.round((nextMonth.getTime() - first.getTime()) / 864e5);
  return Array.from({ length: days }, (_, i) => new Date(year, monthIndex, i + 1));
}
function getWeekOfMonthInfo(weekStartMonday, monthReferenceDate) {
  const year = monthReferenceDate.getFullYear();
  const month = monthReferenceDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekStart = startOfWeekMonday(firstDay);
  const lastWeekStart = startOfWeekMonday(lastDay);
  const currentWeekStart = startOfWeekMonday(weekStartMonday);
  const total = Math.floor((lastWeekStart.getTime() - firstWeekStart.getTime()) / 6048e5) + 1;
  const rawIndex = Math.floor((currentWeekStart.getTime() - firstWeekStart.getTime()) / 6048e5) + 1;
  const index = Math.min(Math.max(rawIndex, 1), total);
  return { index, total };
}

// src/store.ts
var DEFAULT_DATA = {
  tasks: [],
  completionsByDate: {},
  language: "en"
};
var DATA_FILE_TITLE = "# S8 Plan Data";
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function parseLanguage(value) {
  return value === "ru" || value === "en" ? value : DEFAULT_DATA.language;
}
function parseWeekdays(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  const valid = value.filter((day) => typeof day === "number" && Number.isInteger(day) && day >= 1 && day <= 7);
  return [...new Set(valid)].sort((a, b) => a - b);
}
function parseCompletionsByDate(value) {
  if (!isRecord(value)) {
    return {};
  }
  const result = {};
  Object.entries(value).forEach(([date, taskIds]) => {
    if (!Array.isArray(taskIds)) {
      return;
    }
    const validIds = taskIds.filter((id) => typeof id === "string");
    if (validIds.length > 0) {
      result[date] = [...new Set(validIds)];
    }
  });
  return result;
}
function parseTasks(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  const tasks = [];
  value.forEach((entry, index) => {
    if (!isRecord(entry)) {
      return;
    }
    const id = typeof entry.id === "string" ? entry.id : "";
    const title = typeof entry.title === "string" ? entry.title : "";
    if (!id || !title.trim()) {
      return;
    }
    const task = {
      id,
      title: title.trim(),
      weekdays: parseWeekdays(entry.weekdays),
      order: typeof entry.order === "number" && Number.isFinite(entry.order) ? entry.order : index
    };
    if (typeof entry.createdAt === "string") {
      task.createdAt = entry.createdAt;
    }
    if (typeof entry.archived === "boolean") {
      task.archived = entry.archived;
    }
    tasks.push(task);
  });
  return tasks;
}
function hasMeaningfulData(data) {
  return data.tasks.length > 0 || Object.keys(data.completionsByDate).length > 0 || data.language !== DEFAULT_DATA.language;
}
var PlannerStore = class {
  constructor(plugin) {
    this.data = { ...DEFAULT_DATA };
    this.plugin = plugin;
  }
  async load() {
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
  async save() {
    await this.writeVaultDataFile();
  }
  async reloadFromDataFile() {
    const vaultData = await this.readVaultDataFile();
    if (!vaultData) {
      return false;
    }
    this.data = vaultData;
    this.normalizeOrders();
    return true;
  }
  getTasks() {
    return [...this.data.tasks].sort((a, b) => a.order - b.order);
  }
  getLanguage() {
    return this.data.language;
  }
  async setLanguage(language) {
    this.data.language = language;
    await this.save();
  }
  getActiveTasks() {
    return this.getTasks().filter((task) => !task.archived);
  }
  async addTask(title, weekdays) {
    const cleanTitle = title.trim();
    if (!cleanTitle || weekdays.length === 0) {
      return;
    }
    const tasks = this.getTasks();
    const task = {
      id: this.generateTaskId(),
      title: cleanTitle,
      weekdays: [...new Set(weekdays)].sort((a, b) => a - b),
      order: tasks.length,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.data.tasks.push(task);
    await this.save();
  }
  async updateTask(taskId, updates) {
    const task = this.data.tasks.find((t2) => t2.id === taskId);
    if (!task) {
      return;
    }
    if (typeof updates.title === "string") {
      task.title = updates.title.trim();
    }
    if (Array.isArray(updates.weekdays)) {
      task.weekdays = [...new Set(updates.weekdays)].sort((a, b) => a - b);
    }
    await this.save();
  }
  async deleteTask(taskId) {
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
  async moveTask(taskId, direction) {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t2) => t2.id === taskId);
    if (index < 0) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tasks.length) {
      return;
    }
    const [item] = tasks.splice(index, 1);
    tasks.splice(targetIndex, 0, item);
    tasks.forEach((task, i) => {
      const original = this.data.tasks.find((t2) => t2.id === task.id);
      if (original) {
        original.order = i;
      }
    });
    await this.save();
  }
  getTasksForWeekday(weekday) {
    return this.getActiveTasks().filter((task) => task.weekdays.includes(weekday));
  }
  isTaskCompletedOnDate(taskId, isoDate) {
    const completed = this.data.completionsByDate[isoDate] ?? [];
    return completed.includes(taskId);
  }
  async toggleTaskCompletion(taskId, date) {
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
  getTaskMonthlyProgress(task, referenceDate) {
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
    const percent = planned === 0 ? 0 : Math.round(completed / planned * 100);
    return {
      taskId: task.id,
      planned,
      completed,
      remaining,
      percent
    };
  }
  getOverallMonthProgress(referenceDate) {
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
    const percent = totals.planned === 0 ? 0 : Math.round(totals.completed / totals.planned * 100);
    return {
      planned: totals.planned,
      completed: totals.completed,
      percent
    };
  }
  getOverallYearProgress(referenceDate) {
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
    const percent = planned === 0 ? 0 : Math.round(completed / planned * 100);
    return { planned, completed, percent };
  }
  getTodayProgress(today) {
    return this.getDateProgress(today);
  }
  getDateProgress(date) {
    const weekday = jsDayToWeekday(date.getDay());
    const tasks = this.getTasksForWeekday(weekday);
    const iso = toISODate(date);
    const planned = tasks.length;
    const completed = tasks.filter((task) => this.isTaskCompletedOnDate(task.id, iso)).length;
    const percent = planned === 0 ? 0 : Math.round(completed / planned * 100);
    return { planned, completed, percent };
  }
  coerceData(source) {
    if (!isRecord(source)) {
      return { ...DEFAULT_DATA };
    }
    return {
      tasks: parseTasks(source.tasks),
      completionsByDate: parseCompletionsByDate(source.completionsByDate),
      language: parseLanguage(source.language)
    };
  }
  parseMarkdownData(markdown) {
    const jsonBlock = markdown.match(/```json\s*([\s\S]*?)\s*```/i);
    const rawJson = jsonBlock ? jsonBlock[1] : markdown.trim();
    if (!rawJson) {
      return null;
    }
    try {
      const parsed = JSON.parse(rawJson);
      return this.coerceData(parsed);
    } catch (error) {
      console.error("Failed to parse S8 Plan Data.md", error);
      return null;
    }
  }
  serializeMarkdownData(data) {
    return `${DATA_FILE_TITLE}

\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`
`;
  }
  async readVaultDataFile() {
    const existing = this.plugin.app.vault.getAbstractFileByPath(DATA_FILE_PATH);
    if (!(existing instanceof import_obsidian.TFile)) {
      return null;
    }
    const markdown = await this.plugin.app.vault.read(existing);
    return this.parseMarkdownData(markdown);
  }
  async writeVaultDataFile() {
    const markdown = this.serializeMarkdownData(this.data);
    const existing = this.plugin.app.vault.getAbstractFileByPath(DATA_FILE_PATH);
    if (existing instanceof import_obsidian.TFile) {
      await this.plugin.app.vault.modify(existing, markdown);
      return;
    }
    await this.plugin.app.vault.create(DATA_FILE_PATH, markdown);
  }
  generateTaskId() {
    return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  normalizeOrders() {
    const sorted = [...this.data.tasks].sort((a, b) => a.order - b.order);
    sorted.forEach((task, index) => {
      task.order = index;
    });
    this.data.tasks = sorted;
  }
};

// src/settings.ts
var import_obsidian2 = require("obsidian");
var PlannerSettingTab = class extends import_obsidian2.PluginSettingTab {
  constructor(plugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    const language = this.plugin.store.getLanguage();
    new import_obsidian2.Setting(containerEl).setName(t(language, "weeklyPlannerSettings")).setHeading();
    this.renderLanguageSetting(containerEl, language);
    this.renderCreateTask(containerEl, language);
    new import_obsidian2.Setting(containerEl).setName(t(language, "tasks")).setHeading();
    const tasks = this.plugin.store.getTasks();
    if (tasks.length === 0) {
      containerEl.createDiv({ cls: "wp-empty", text: t(language, "noTasksYet") });
      return;
    }
    tasks.forEach((task, index) => this.renderTaskCard(containerEl, task, index, tasks.length, language));
  }
  runAsync(action) {
    void action().catch((error) => {
      console.error("Planner settings action failed", error);
    });
  }
  async applyLanguage(language) {
    await this.plugin.store.setLanguage(language);
    this.plugin.refreshViews();
    this.display();
  }
  renderLanguageSetting(containerEl, language) {
    new import_obsidian2.Setting(containerEl).setName(t(language, "language")).setDesc(t(language, "languageDescription")).addDropdown((dropdown) => {
      dropdown.addOption("en", t(language, "english"));
      dropdown.addOption("ru", t(language, "russian"));
      dropdown.setValue(language);
      dropdown.onChange((value) => {
        if (value !== "en" && value !== "ru") {
          return;
        }
        this.runAsync(() => this.applyLanguage(value));
      });
    });
  }
  renderCreateTask(containerEl, language) {
    let draftTitle = "";
    let draftWeekdays = [];
    new import_obsidian2.Setting(containerEl).setName(t(language, "createTask")).setHeading();
    new import_obsidian2.Setting(containerEl).setName(t(language, "taskTitle")).addText(
      (text) => text.setPlaceholder(t(language, "taskTitlePlaceholder")).onChange((value) => {
        draftTitle = value;
      })
    );
    const weekdayRow = containerEl.createDiv({ cls: "wp-weekdays" });
    WEEKDAY_ORDER.forEach((weekday) => {
      const chip = weekdayRow.createEl("button", { cls: "wp-weekday-chip", text: getWeekdayLabel(weekday, language) });
      chip.addEventListener("click", () => {
        if (draftWeekdays.includes(weekday)) {
          draftWeekdays = draftWeekdays.filter((w) => w !== weekday);
          chip.removeClass("is-active");
        } else {
          draftWeekdays = [...draftWeekdays, weekday].sort((a, b) => a - b);
          chip.addClass("is-active");
        }
      });
    });
    new import_obsidian2.Setting(containerEl).setName(t(language, "actions")).addButton(
      (button) => button.setButtonText(t(language, "addTask")).onClick(() => {
        this.runAsync(async () => {
          await this.plugin.store.addTask(draftTitle, draftWeekdays);
          this.plugin.refreshViews();
          this.display();
        });
      })
    );
  }
  renderTaskCard(containerEl, task, index, total, language) {
    const card = containerEl.createDiv({ cls: "wp-settings-task" });
    let draftTitle = task.title;
    let draftWeekdays = [...task.weekdays];
    new import_obsidian2.Setting(card).setName(t(language, "taskTitle")).addText(
      (text) => text.setValue(task.title).onChange((value) => {
        draftTitle = value;
      })
    );
    const weekdayRow = card.createDiv({ cls: "wp-weekdays" });
    WEEKDAY_ORDER.forEach((weekday) => {
      const chip = weekdayRow.createEl("button", { cls: "wp-weekday-chip", text: getWeekdayLabel(weekday, language) });
      if (draftWeekdays.includes(weekday)) {
        chip.addClass("is-active");
      }
      chip.addEventListener("click", () => {
        if (draftWeekdays.includes(weekday)) {
          draftWeekdays = draftWeekdays.filter((w) => w !== weekday);
          chip.removeClass("is-active");
        } else {
          draftWeekdays = [...draftWeekdays, weekday].sort((a, b) => a - b);
          chip.addClass("is-active");
        }
      });
    });
    const controls = card.createDiv({ cls: "wp-controls" });
    const saveBtn = controls.createEl("button", { text: t(language, "save") });
    saveBtn.addEventListener("click", () => {
      this.runAsync(async () => {
        await this.plugin.store.updateTask(task.id, {
          title: draftTitle,
          weekdays: draftWeekdays
        });
        this.plugin.refreshViews();
        this.display();
      });
    });
    const deleteBtn = controls.createEl("button", { text: t(language, "delete") });
    deleteBtn.addEventListener("click", () => {
      this.runAsync(async () => {
        await this.plugin.store.deleteTask(task.id);
        this.plugin.refreshViews();
        this.display();
      });
    });
    const upBtn = controls.createEl("button", { text: t(language, "moveUp") });
    upBtn.disabled = index === 0;
    upBtn.addEventListener("click", () => {
      this.runAsync(async () => {
        await this.plugin.store.moveTask(task.id, "up");
        this.plugin.refreshViews();
        this.display();
      });
    });
    const downBtn = controls.createEl("button", { text: t(language, "moveDown") });
    downBtn.disabled = index === total - 1;
    downBtn.addEventListener("click", () => {
      this.runAsync(async () => {
        await this.plugin.store.moveTask(task.id, "down");
        this.plugin.refreshViews();
        this.display();
      });
    });
  }
};

// src/view.ts
var import_obsidian3 = require("obsidian");

// src/components/header.ts
function renderPlannerHeader(container, stats, handlers) {
  const header = container.createDiv({ cls: "wp-sticky-header" });
  const topRow = header.createDiv({ cls: "wp-header-top" });
  topRow.createDiv({ cls: "wp-month-label", text: stats.monthLabel });
  const nav = topRow.createDiv({ cls: "wp-week-nav" });
  nav.createDiv({ cls: "wp-week-badge", text: stats.badgeText });
  const prevBtn = nav.createEl("button", { cls: "wp-nav-btn", text: "<" });
  prevBtn.setAttr("aria-label", t(stats.language, "previousWeek"));
  prevBtn.addEventListener("click", handlers.onPrevWeek);
  const todayBtn = nav.createEl("button", { cls: "wp-nav-btn", text: t(stats.language, "todayButton") });
  todayBtn.setAttr("aria-label", t(stats.language, "goToCurrentWeek"));
  todayBtn.addEventListener("click", handlers.onToday);
  const nextBtn = nav.createEl("button", { cls: "wp-nav-btn", text: ">" });
  nextBtn.setAttr("aria-label", t(stats.language, "nextWeek"));
  nextBtn.addEventListener("click", handlers.onNextWeek);
  const modeRow = header.createDiv({ cls: "wp-mode-row" });
  const modeBtnText = stats.mode === "week" ? t(stats.language, "overallButton") : t(stats.language, "weekButton");
  const modeBtn = modeRow.createEl("button", { cls: "wp-mode-btn", text: modeBtnText });
  modeBtn.addEventListener("click", handlers.onToggleMode);
  const statsWrap = header.createDiv({ cls: "wp-header-stats" });
  if (stats.mode === "overall") {
    statsWrap.createDiv({ text: `${t(stats.language, "yearProgress")}: ${stats.overallPercent}%` });
    statsWrap.createDiv({ text: `${t(stats.language, "completed")}: ${stats.overallCompleted} / ${stats.overallPlanned}` });
  } else {
    statsWrap.createDiv({ text: `${t(stats.language, "overallProgress")}: ${stats.overallPercent}%` });
    statsWrap.createDiv({ text: `${t(stats.language, "completed")}: ${stats.overallCompleted} / ${stats.overallPlanned}` });
    statsWrap.createDiv({ text: `${t(stats.language, "today")}: ${stats.todayCompleted} / ${stats.todayPlanned}` });
  }
}

// src/components/task-row.ts
function renderTaskRow(container, input) {
  const row = container.createDiv({ cls: "wp-task-row" });
  const checkbox = row.createEl("input", { cls: "wp-task-checkbox", type: "checkbox" });
  checkbox.checked = input.completed;
  checkbox.setAttr("aria-label", t(input.language, "toggleTask", { title: input.task.title }));
  checkbox.addEventListener("change", input.onToggle);
  const textWrap = row.createDiv();
  const title = textWrap.createDiv({ cls: "wp-task-title", text: input.task.title });
  if (input.completed) {
    title.addClass("is-done");
  }
  if (input.progressText) {
    textWrap.createDiv({ cls: "wp-task-meta", text: input.progressText });
  }
}

// src/components/day-section.ts
function renderDaySection(container, input) {
  const day = container.createDiv({ cls: "wp-day" });
  if (input.isToday) {
    day.addClass("is-today");
  }
  const headerButton = day.createEl("button", { cls: "wp-day-header-btn" });
  headerButton.setAttr("aria-expanded", String(!input.collapsed));
  headerButton.addEventListener("click", () => {
    input.onToggleCollapse(new Date(input.date.getFullYear(), input.date.getMonth(), input.date.getDate()));
  });
  headerButton.createDiv({ cls: "wp-day-title", text: formatDayTitle(input.date, input.language) });
  headerButton.createDiv({ cls: "wp-day-toggle-label", text: input.collapsed ? "\u2228" : "\u2227" });
  if (input.collapsed) {
    day.setAttr("data-date", toISODate(input.date));
    return;
  }
  const list = day.createDiv({ cls: "wp-task-list" });
  if (input.dayTasks.length === 0) {
    list.createDiv({ cls: "wp-empty", text: t(input.language, "noTasksForDay") });
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
  day.setAttr("data-date", toISODate(input.date));
}

// src/components/year-overview.ts
function renderYearOverview(container, input) {
  const wrap = container.createDiv({ cls: "wp-year-overview" });
  input.months.forEach((month) => {
    const monthSection = wrap.createDiv({ cls: "wp-year-month" });
    monthSection.createDiv({
      cls: "wp-year-month-title",
      text: `${formatMonthOnly(month.monthDate, input.language)} ${input.year}`
    });
    const grid = monthSection.createDiv({ cls: "wp-year-grid" });
    month.days.forEach((day) => {
      const circle = grid.createDiv({ cls: "wp-day-circle", text: `${day.percent}%` });
      if (day.percent === 0) {
        circle.addClass("is-zero");
      } else {
        circle.addClass("is-done");
      }
      if (day.isToday) {
        circle.addClass("is-today");
      }
      const shortDate = day.date.toLocaleDateString(getLocale(input.language), {
        month: "short",
        day: "numeric"
      });
      circle.setAttr(
        "title",
        t(input.language, "dayProgressTitle", {
          date: shortDate,
          completed: day.completed,
          planned: day.planned,
          percent: day.percent
        })
      );
    });
  });
}

// src/view.ts
var WeeklyPlannerView = class extends import_obsidian3.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.mode = "week";
    this.dayCollapseOverrides = /* @__PURE__ */ new Map();
    this.plugin = plugin;
    this.weekStart = startOfWeekMonday(/* @__PURE__ */ new Date());
  }
  getViewType() {
    return VIEW_TYPE_WEEKLY_PLANNER;
  }
  getDisplayText() {
    return t(this.plugin.store.getLanguage(), "weekViewDisplayName");
  }
  getIcon() {
    return "calendar-days";
  }
  onOpen() {
    this.render();
    return Promise.resolve();
  }
  onClose() {
    this.contentEl.empty();
    return Promise.resolve();
  }
  setCurrentWeekStart(date) {
    this.weekStart = startOfWeekMonday(date);
    this.render();
  }
  refresh() {
    this.render();
  }
  render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("wp-root");
    const language = this.plugin.store.getLanguage();
    const today = /* @__PURE__ */ new Date();
    const todayIso = toISODate(today);
    const headerMonthDate = new Date(this.weekStart.getFullYear(), this.weekStart.getMonth(), 1);
    const weekOfMonth = getWeekOfMonthInfo(this.weekStart, headerMonthDate);
    const progressForHeader = this.mode === "overall" ? this.plugin.store.getOverallYearProgress(this.weekStart) : this.plugin.store.getOverallMonthProgress(headerMonthDate);
    const todayProgress = this.plugin.store.getTodayProgress(today);
    const monthLabel = this.mode === "overall" ? String(this.weekStart.getFullYear()) : formatMonthYear(headerMonthDate, language);
    const badgeText = this.mode === "overall" ? `${t(language, "year")}: ${this.weekStart.getFullYear()}` : `${t(language, "weekInMonth")}: ${weekOfMonth.index}/${weekOfMonth.total}`;
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
          if (this.mode === "overall") {
            this.weekStart = new Date(this.weekStart.getFullYear() - 1, this.weekStart.getMonth(), this.weekStart.getDate());
          } else {
            this.weekStart.setDate(this.weekStart.getDate() - 7);
          }
          this.render();
        },
        onNextWeek: () => {
          if (this.mode === "overall") {
            this.weekStart = new Date(this.weekStart.getFullYear() + 1, this.weekStart.getMonth(), this.weekStart.getDate());
          } else {
            this.weekStart.setDate(this.weekStart.getDate() + 7);
          }
          this.render();
        },
        onToday: () => {
          this.weekStart = startOfWeekMonday(/* @__PURE__ */ new Date());
          this.render();
        },
        onToggleMode: () => {
          this.mode = this.mode === "week" ? "overall" : "week";
          this.render();
        }
      }
    );
    if (this.mode === "overall") {
      this.renderOverall(root, language, todayIso);
      return;
    }
    this.renderWeek(root, language, todayIso);
  }
  renderWeek(root, language, todayIso) {
    const daysWrap = root.createDiv({ cls: "wp-days" });
    const weekDates = getWeekDates(this.weekStart);
    const tasks = this.plugin.store.getActiveTasks();
    if (tasks.length === 0) {
      daysWrap.createDiv({ cls: "wp-empty", text: t(language, "noTasksYetAddInSettings") });
      return;
    }
    weekDates.forEach((date) => {
      const isoDate = toISODate(date);
      const isToday = isoDate === todayIso;
      const override = this.dayCollapseOverrides.get(isoDate);
      const collapsed = override !== void 0 ? override : !isToday;
      const weekday = jsDayToWeekday(date.getDay());
      const dayTasks = this.plugin.store.getTasksForWeekday(weekday).map((task) => {
        const monthly = this.plugin.store.getTaskMonthlyProgress(task, date);
        return {
          task,
          completed: this.plugin.store.isTaskCompletedOnDate(task.id, isoDate),
          progressText: monthly.planned > 0 ? `${monthly.completed}/${monthly.planned} \u2022 ${monthly.percent}%` : void 0
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
        onToggleTask: (taskId, toggleDate) => {
          void this.plugin.store.toggleTaskCompletion(taskId, toggleDate).then(() => {
            this.render();
          }).catch((error) => {
            console.error("Failed to toggle task completion", error);
          });
        }
      });
    });
  }
  renderOverall(root, language, todayIso) {
    const holder = root.createDiv({ cls: "wp-days" });
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
};

// src/main.ts
var WeeklyPlannerPlugin = class extends import_obsidian4.Plugin {
  constructor(app, manifest) {
    super(app, manifest);
    this.viewType = VIEW_TYPE_WEEKLY_PLANNER;
    this.store = new PlannerStore(this);
  }
  async onload() {
    await this.store.load();
    const language = this.store.getLanguage();
    this.registerView(this.viewType, (leaf) => new WeeklyPlannerView(leaf, this));
    this.addRibbonIcon("calendar-days", t(language, "openWeeklyPlanner"), () => {
      void this.openPlannerView();
    });
    this.addCommand({
      id: "open-weekly-planner",
      name: t(language, "openWeeklyPlanner"),
      callback: () => {
        void this.openPlannerView();
      }
    });
    this.addSettingTab(new PlannerSettingTab(this));
    this.registerDataFileSyncEvents();
  }
  onunload() {
  }
  async openPlannerView() {
    const language = this.store.getLanguage();
    const workspace = this.app.workspace;
    const leaf = workspace.getLeaf("tab");
    if (!leaf) {
      new import_obsidian4.Notice(t(language, "couldNotCreatePlannerTab"));
      return;
    }
    try {
      await leaf.setViewState({
        type: this.viewType,
        active: true
      });
      await workspace.revealLeaf(leaf);
    } catch (error) {
      console.error("Failed to open weekly planner view", error);
      const details = error instanceof Error ? error.message : String(error);
      new import_obsidian4.Notice(t(language, "couldNotOpenWeeklyPlannerView", { details }));
    }
  }
  refreshViews() {
    const leaves = this.app.workspace.getLeavesOfType(this.viewType);
    leaves.forEach((leaf) => {
      const view = leaf.view;
      if (view instanceof WeeklyPlannerView) {
        view.refresh();
      }
    });
  }
  registerDataFileSyncEvents() {
    this.registerEvent(
      this.app.vault.on("modify", (file) => {
        if (!this.isDataFile(file)) {
          return;
        }
        this.syncFromDataFile();
      })
    );
    this.registerEvent(
      this.app.vault.on("create", (file) => {
        if (!this.isDataFile(file)) {
          return;
        }
        this.syncFromDataFile();
      })
    );
    this.registerEvent(
      this.app.vault.on("rename", (file, oldPath) => {
        if (oldPath !== DATA_FILE_PATH && !this.isDataFile(file)) {
          return;
        }
        this.syncFromDataFile();
      })
    );
    this.registerEvent(
      this.app.vault.on("delete", (file) => {
        if (!this.isDataFile(file)) {
          return;
        }
        this.syncFromDataFile();
      })
    );
  }
  isDataFile(file) {
    return file?.path === DATA_FILE_PATH;
  }
  syncFromDataFile() {
    void this.store.reloadFromDataFile().then((loaded) => {
      if (loaded) {
        this.refreshViews();
      }
    }).catch((error) => {
      console.error("Failed to sync planner data from S8 Plan Data.md", error);
    });
  }
};
