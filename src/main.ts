import { App, Notice, Plugin, PluginManifest } from 'obsidian';
import { VIEW_TYPE_WEEKLY_PLANNER } from './constants';
import { PlannerStore } from './store';
import { PlannerSettingTab } from './settings';
import { WeeklyPlannerView } from './view';
import { t } from './i18n';

export default class WeeklyPlannerPlugin extends Plugin {
  store: PlannerStore;
  viewType = VIEW_TYPE_WEEKLY_PLANNER;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.store = new PlannerStore(this);
  }

  async onload(): Promise<void> {
    await this.store.load();
    const language = this.store.getLanguage();

    this.registerView(this.viewType, (leaf) => new WeeklyPlannerView(leaf, this));

    this.addRibbonIcon('calendar-days', t(language, 'openWeeklyPlanner'), () => {
      void this.openPlannerView();
    });

    this.addCommand({
      id: 'open-weekly-planner',
      name: t(language, 'openWeeklyPlanner'),
      callback: () => {
        void this.openPlannerView();
      }
    });

    this.addSettingTab(new PlannerSettingTab(this));
  }

  onunload(): void {
    // Keep user leaf placement intact between plugin reloads.
  }

  async openPlannerView(): Promise<void> {
    const language = this.store.getLanguage();
    const workspace = this.app.workspace;
    const leaf = workspace.getLeaf('tab');
    if (!leaf) {
      new Notice(t(language, 'couldNotCreatePlannerTab'));
      return;
    }

    try {
      await leaf.setViewState({
        type: this.viewType,
        active: true
      });
      await workspace.revealLeaf(leaf);
    } catch (error) {
      console.error('Failed to open weekly planner view', error);
      const details = error instanceof Error ? error.message : String(error);
      new Notice(t(language, 'couldNotOpenWeeklyPlannerView', { details }));
    }
  }

  refreshViews(): void {
    const leaves = this.app.workspace.getLeavesOfType(this.viewType);
    leaves.forEach((leaf) => {
      const view = leaf.view;
      if (view instanceof WeeklyPlannerView) {
        view.refresh();
      }
    });
  }
}
