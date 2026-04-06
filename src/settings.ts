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

    new Setting(containerEl).setName(t(language, 'weeklyPlannerSettings')).setHeading();
    this.renderLanguageSetting(containerEl, language);

    this.renderCreateTask(containerEl, language);
    new Setting(containerEl).setName(t(language, 'tasks')).setHeading();

    const tasks = this.plugin.store.getTasks();
    if (tasks.length === 0) {
      containerEl.createDiv({ cls: 'wp-empty', text: t(language, 'noTasksYet') });
      return;
    }

    tasks.forEach((task, index) => this.renderTaskCard(containerEl, task, index, tasks.length, language));
  }

  private runAsync(action: () => Promise<void>): void {
    void action().catch((error) => {
      console.error('Planner settings action failed', error);
    });
  }

  private async applyLanguage(language: PlannerLanguage): Promise<void> {
    await this.plugin.store.setLanguage(language);
    this.plugin.refreshViews();
    this.display();
  }

  private renderLanguageSetting(containerEl: HTMLElement, language: PlannerLanguage): void {
    new Setting(containerEl)
      .setName(t(language, 'language'))
      .setDesc(t(language, 'languageDescription'))
      .addDropdown((dropdown) => {
        dropdown.addOption('en', t(language, 'english'));
        dropdown.addOption('ru', t(language, 'russian'));
        dropdown.setValue(language);
        dropdown.onChange((value) => {
          if (value !== 'en' && value !== 'ru') {
            return;
          }
          this.runAsync(() => this.applyLanguage(value));
        });
      });
  }

  private renderCreateTask(containerEl: HTMLElement, language: PlannerLanguage): void {
    let draftTitle = '';
    let draftWeekdays: number[] = [];

    new Setting(containerEl).setName(t(language, 'createTask')).setHeading();

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
        button.setButtonText(t(language, 'addTask')).onClick(() => {
          this.runAsync(async () => {
            await this.plugin.store.addTask(draftTitle, draftWeekdays);
            this.plugin.refreshViews();
            this.display();
          });
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
    saveBtn.addEventListener('click', () => {
      this.runAsync(async () => {
        await this.plugin.store.updateTask(task.id, {
          title: draftTitle,
          weekdays: draftWeekdays
        });
        this.plugin.refreshViews();
        this.display();
      });
    });

    const deleteBtn = controls.createEl('button', { text: t(language, 'delete') });
    deleteBtn.addEventListener('click', () => {
      this.runAsync(async () => {
        await this.plugin.store.deleteTask(task.id);
        this.plugin.refreshViews();
        this.display();
      });
    });

    const upBtn = controls.createEl('button', { text: t(language, 'moveUp') });
    upBtn.disabled = index === 0;
    upBtn.addEventListener('click', () => {
      this.runAsync(async () => {
        await this.plugin.store.moveTask(task.id, 'up');
        this.plugin.refreshViews();
        this.display();
      });
    });

    const downBtn = controls.createEl('button', { text: t(language, 'moveDown') });
    downBtn.disabled = index === total - 1;
    downBtn.addEventListener('click', () => {
      this.runAsync(async () => {
        await this.plugin.store.moveTask(task.id, 'down');
        this.plugin.refreshViews();
        this.display();
      });
    });
  }
}
