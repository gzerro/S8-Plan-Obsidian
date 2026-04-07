# S8 Plan

`S8 Plan` is a mobile-first Obsidian plugin with a weekly planner, recurring weekday tasks, and monthly/yearly progress tracking.

## Features

- `Week` mode (main screen):
  - Monday-to-Sunday layout.
  - Tasks shown only on selected weekdays.
  - Per-date completion checkboxes.
  - Per-day collapse/expand (`∧` / `∨`).
  - By default, all non-today days are collapsed.
  - Today is highlighted with the current theme accent color.
- `Overall` mode:
  - Full-year overview grouped by months.
  - Daily circles with completion percentage.
  - `0%` = gray circle, `>0%` = accent-colored circle.
- Sticky top header:
  - Week navigation (`<`, `Today`, `>`).
  - Mode toggle button (`Overall` / `Week`).
  - Dynamic stats:
    - in `Week` mode: monthly progress + today progress;
    - in `Overall` mode: yearly progress.
- Settings tab:
  - Create task.
  - Edit task title and weekdays.
  - Delete task.
  - Global task ordering (`Move up` / `Move down`).
  - Interface language selection (`English` / `Русский`).

## Task and progress logic

- A task appears on a day only if that weekday is selected in the task settings.
- Completion is stored for exact dates (`YYYY-MM-DD`), not globally.
- Monthly progress is calculated using the real calendar month (no fixed “4 weeks” assumption).
- Daily percent = `completed tasks for date / planned tasks for that weekday`.
- Yearly percent = total completed for the year / total planned for the year.

## Install in an Obsidian vault

1. Build the plugin:

```bash
npm install
npm run build
```

2. Create the plugin folder in your vault:

```bash
<Vault>/.obsidian/plugins/s8-plan/
```

3. Copy files:

- `main.js`
- `manifest.json`
- `styles.css`

4. In Obsidian:

- open `Settings -> Community plugins`
- disable `Restricted mode` if enabled
- enable `S8 Plan`

## How to use

1. Open the planner:

- from the left ribbon icon, or
- with the command `Open weekly planner`.

2. Add tasks:

- `Settings -> Community plugins -> S8 Plan (gear icon)`.

3. Mark tasks complete in `Week` mode via checkboxes.

4. Switch modes:

- `Overall` for yearly overview;
- `Week` to return to weekly planning.

## Data storage

The plugin stores planner data in a Markdown file in the vault root:

- `S8 Plan Data.md`

Inside that file, data is saved as JSON in a `json` code block.

Stored data includes:

- task list;
- date-based completion map;
- selected interface language.

Migration behavior:

- if `S8 Plan Data.md` already exists, it is used as the source of truth;
- if it does not exist, the plugin tries to migrate legacy data from `.obsidian/plugins/s8-plan/data.json`;
- after migration, the plugin writes to `S8 Plan Data.md`.

## Development

### Commands

```bash
npm install
npm run dev
npm run build
npx tsc --noEmit
```

### Project structure

- `manifest.json` - plugin metadata (`id: s8-plan`, `isDesktopOnly: false`)
- `styles.css` - plugin styles
- `src/main.ts` - plugin lifecycle, command, ribbon, view opening
- `src/view.ts` - main UI and mode switching
- `src/settings.ts` - task and language settings
- `src/store.ts` - persistence and progress calculations
- `src/date-utils.ts` - date helpers
- `src/i18n.ts` - localization
- `src/components/*` - UI components

## Compatibility

- Works in Obsidian Desktop and Obsidian Mobile.
- No desktop-only APIs are used.
