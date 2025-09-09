## Hospital Reception Management (Electron + React + Excel)

A simple desktop app for hospital reception workflows: add patients, filter/search, view stats, and export to Excel. Built with React + Vite, Electron, Tailwind CSS, and xlsx.

### Badges
- ![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?logo=javascript&logoColor=000)
- ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)
- ![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=fff)
- ![Electron](https://img.shields.io/badge/Electron-31-47848F?logo=electron&logoColor=fff)
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=fff)
- ![XLSX](https://img.shields.io/badge/xlsx-0.18-207245)
- ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

### Features
- Add new patients with auto S.No and IP No
- Filter by name, place, date, age, referral name, or IP No
- View stats for today, this week, this month, and total
- Excel-first storage (file is created automatically if missing)
- Export filtered or full list to uniquely named Excel files

### Tech Stack
- React 19, Vite 7
- Electron 31, electron-builder
- Tailwind CSS 4, lucide-react icons
- xlsx for Excel I/O

### Prerequisites
- Node.js 18+ (LTS recommended)
- Git (for cloning)
- Windows/macOS/Linux

### Clone
```bash
git clone https://github.com/your-username/hospital-reception-desktop.git
cd hospital-reception-desktop
npm install
```

### Run (Development)
Starts the React dev server and launches Electron.
```bash
npm run dev
```
- React dev server: http://localhost:5173
- Electron waits for the dev server and opens the desktop app.

Alternatively, run separately:
```bash
npm run dev:react
npm run dev:electron
```

### Build (Web Assets)
Produces the production web build (used by the desktop app).
```bash
npm run build
```

### Package (Desktop Installers)
Create installers using electron-builder.
```bash
# Build all supported targets for your OS
npm run dist

# Or explicitly per OS
npm run dist:win
npm run dist:mac
npm run dist:linux
```
- Installers/output will be in the `dist/` folder.
- On Windows, the NSIS installer will be generated (per the config).

### Data & Excel
- On startup, the app checks if the Excel file exists; if not, it initializes it.
- Patient actions read/write through the Electron preload bridge (`window.api`).
- Export saves to the OS Downloads folder with a timestamped filename.

### Project Structure
- `electron/`: Electron `main` and `preload`
- `src/`: React app
  - `components/`: UI components
  - `utils/`: date and Excel helpers

### Tips
- If you change the Vite output folder, ensure electron-builder `files` matches. For default Vite output, it should include `dist/**`.
- For production code signing (Windows/macOS), configure certificate path and password via environment variables rather than hardcoding them.

### License
MIT

### Author
Kokatam Janardhan Reddy
