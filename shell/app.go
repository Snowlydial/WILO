package main

import (
	"context"

	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	wailsruntime.WindowExecJS(ctx, `
		window.addEventListener('load', function() {
			document.body.style.zoom = '90%';
		});
	`)

	if settings, err := loadSettings(); err == nil {
		wailsruntime.WindowSetAlwaysOnTop(ctx, settings.DisplayOver)
	}
}

// SetAlwaysOnTop is bound and callable from the frontend
func (a *App) SetAlwaysOnTop(enabled bool) {
	wailsruntime.WindowSetAlwaysOnTop(a.ctx, enabled)
}