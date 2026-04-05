import { PluginSettingTab, Setting } from 'obsidian';
import type WeeklyPlannerPlugin from './main';
import { WEEKDAY_ORDER } from './constants';
import { getWeekdayLabel, t } from './i18n';
import type { PlannerLanguage, Task } from './types';

export class PlannerSettingTab extends PluginSettingTab {
  private plugin: WeeklyPlannerPlugin;

  constructor(plugin: WeeklyPlannerPlugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    const language = this.plugin.store.getLanguage();

    containerEl.createEl('h2', { text: t(language, 'weeklyPlannerSettings') });
    this.renderLanguageSetting(containerEl, language);

    this.renderCreateTask(containerEl, language);
    containerEl.createEl('h3', { text: t(language, 'tasks') });

    const tasks = this.plugin.store.getTasks();
    if (tasks.length === 0) {
      containerEl.createDiv({ cls: 'wp-empty', text: t(language, 'noTasksYet') });
      return;
    }

    tasks.forEach((task, index) => this.renderTaskCard(containerEl, task, index, tasks.length, language));
  }

  private renderLanguageSetting(containerEl: HTMLElement, language: PlannerLanguage): void {
    new Setting(containerEl)
      .setName(t(language, 'language'))
      .setDesc(t(language, 'languageDescription'))
      .addDropdown((dropdown) => {
        dropdown.addOption('en', t(language, 'english'));
        dropdown.addOption('ru', t(language, 'russian'));
        dropdown.setValue(language);
        dropdown.onChange(async (value) => {
          if (value !== 'en' && value !== 'ru') {
            return;
          }
          await this.plugin.store.setLanguage(value);
          await this.plugin.refreshViews();
          this.display();
        });
      });
  }

  private renderCreateTask(containerEl: HTMLElement, language: PlannerLanguage): void {
    let draftTitle = '';
    let draftWeekdays: number[] = [];

    containerEl.createEl('h3', { text: t(language, 'createTask') });

    new Setting(containerEl)
      .setName(t(language, 'taskTitle'))
      .addText((text) =>
        text
          .setPlaceholder(t(language, 'taskTitlePlaceholder'))
          .onChange((value) => {
            draftTitle = value;
          })
      );

    const weekdayRow = containerEl.createDiv({ cls: 'wp-weekdays' });
    WEEKDAY_ORDER.forEach((weekday) => {
      const chip = weekdayRow.createEl('button', { cls: 'wp-weekday-chip', text: getWeekdayLabel(weekday, language) });
      chip.addEventListener('click', () => {
        if (draftWeekdays.includes(weekday)) {
          draftWeekdays = draftWeekdays.filter((w) => w !== weekday);
          chip.removeClass('is-active');
        } else {
          draftWeekdays = [...draftWeekdays, weekday].sort((a, b) => a - b);
          chip.addClass('is-active');
        }
      });
    });

    new Setting(containerEl)
      .setName(t(language, 'actions'))
      .addButton((button) =>
        button.setButtonText(t(language, 'addTask')).onClick(async () => {
          await this.plugin.store.addTask(draftTitle, draftWeekdays);
          await this.plugin.refreshViews();
          this.display();
        })
      );
  }

  private renderTaskCard(
    containerEl: HTMLElement,
    task: Task,
    index: number,
    total: number,
    language: PlannerLanguage
  ): void {
    const card = containerEl.createDiv({ cls: 'wp-settings-task' });

    let draftTitle = task.title;
    let draftWeekdays = [...task.weekdays];

    new Setting(card)
      .setName(t(language, 'taskTitle'))
      .addText((text) =>
        text
          .setValue(task.title)
          .onChange((value) => {
            draftTitle = value;
          })
      );

    const weekdayRow = card.createDiv({ cls: 'wp-weekdays' });
    WEEKDAY_ORDER.forEach((weekday) => {
      const chip = weekdayRow.createEl('button', { cls: 'wp-weekday-chip', text: getWeekdayLabel(weekday, language) });
      if (draftWeekdays.includes(weekday)) {
        chip.addClass('is-active');
      }
      chip.addEventListener('click', () => {
        if (draftWeekdays.includes(weekday)) {
          draftWeekdays = draftWeekdays.filter((w) => w !== weekday);
          chip.removeClass('is-active');
        } else {
          draftWeekdays = [...draftWeekdays, weekday].sort((a, b) => a - b);
          chip.addClass('is-active');
        }
      });
    });

    const controls = card.createDiv({ cls: 'wp-controls' });

    const saveBtn = controls.createEl('button', { text: t(language, 'save') });
    saveBtn.addEventListener('click', async () => {
      await this.plugin.store.updateTask(task.id, {
        title: draftTitle,
        weekdays: draftWeekdays
      });
      await this.plugin.refreshViews();
      this.display();
    });

    const deleteBtn = controls.createEl('button', { text: t(language, 'delete') });
    deleteBtn.addEventListener('click', async () => {
      await this.plugin.store.deleteTask(task.id);
      await this.plugin.refreshViews();
      this.display();
    });

    const upBtn = controls.createEl('button', { text: t(language, 'moveUp') });
    upBtn.disabled = index === 0;
    upBtn.addEventListener('click', async () => {
      await this.plugin.store.moveTask(task.id, 'up');
      await this.plugin.refreshViews();
      this.display();
    });

    const downBtn = controls.createEl('button', { text: t(language, 'moveDown') });
    downBtn.disabled = index === total - 1;
    downBtn.addEventListener('click', async () => {
      await this.plugin.store.moveTask(task.id, 'down');
      await this.plugin.refreshViews();
      this.display();
    });
  }
}
