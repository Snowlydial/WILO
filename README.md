# WILO - Where I Left Off

A minimal daily-log desktop app built for late-night coders who lose track of what they were doing. Write one note per day, mark it done when resolved, set a reminder to revisit it later, and get nudged with a notification when it's time.

## Why

I am just forgetful the next morning after coding late tbh...that's it

## Features

- One log entry per day, Markdown-supported content
- Set a reminder for any day; get a native OS notification when it's due
- Mark logs as done, editing an unresolved log automatically reopens it
- Full-text search across all logs, with a live preview pane
- Weekly date strip + month/year picker with a calendar-day jump
- Monthly recap: see how many days were resolved vs. still open
- Configurable notification time, always-on-top window, and launch-on-startup
- Runs as a native desktop app (Wails-wrapped), not a browser tab

## Stack

- **Backend:** Spring Boot (Java), H2 embedded database
- **Frontend:** React + TypeScript (Vite)
- **Desktop shell:** Wails (Go) - wraps the web app in a native window and manages the backend process

## Project structure
```
WILO/
├── backend/ Spring Boot API + H2 database
├── frontend/ React + TypeScript UI
└── shell/ Go/Wails native desktop wrapper
```

## Setup before building

Add a motivation/reference image at `frontend/public/images/motivation.jpg` (roughly 1000x600 or similar ratio works well) - it displays in the search panel when idle. The app expects a file at this path; without it, that panel will just show an empty background.

## Building from source

**Prerequisites:** Java 21+, Node.js, Go, [Wails CLI](https://wails.io/docs/gettingstarted/installation)

```bash
# from the shell/ folder
./build.sh     # Linux/macOS
build.bat      # Windows
```

This builds the frontend, bundles it into the Spring Boot jar, and produces a native executable with the jar alongside it in `shell/build/bin/` - the whole folder is self-contained and can be moved anywhere.

**Running the backend alone (dev mode):**
```bash
cd backend
./mvnw spring-boot:run
```

**Running the frontend alone (dev mode, proxied to backend):**
```bash
cd frontend
npm install
npm run dev
```

## Requirements to run the built app

- Java (JRE 21+) must be installed and available on PATH, the desktop shell launches the backend as a subprocess
- Windows and Linux are supported (autostart uses the Windows Registry or an XDG `.desktop` file respectively)
