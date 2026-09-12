declare global {
    interface Window {
        go: {
            main: {
                App: {
                    SetAlwaysOnTop: (enabled: boolean) => Promise<void>;
                    SetAutostart: (enabled: boolean) => Promise<void>;
                };
            };
        };
    }
}

export async function setAlwaysOnTop(enabled: boolean) {
    if (window.go?.main?.App?.SetAlwaysOnTop) {
        await window.go.main.App.SetAlwaysOnTop(enabled);
    }
    // if window.go doesn't exist, we're running in a plain browser (dev mode), just no-op
}

export async function setAutostart(enabled: boolean) {
    if (window.go?.main?.App?.SetAutostart) {
        await window.go.main.App.SetAutostart(enabled);
    }
}