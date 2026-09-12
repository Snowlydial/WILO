package main

import (
	"context"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

func main() {
	startBackend()
	defer stopBackend()

	app := &App{}

	if settings, err := loadSettings(); err == nil {
		exePath, _ := os.Executable()
		setAutostart(settings.Autostart, exePath)
	}

	target, _ := url.Parse("http://localhost:8080")
	proxy := httputil.NewSingleHostReverseProxy(target)

	err := wails.Run(&options.App{
		Title:     "WILO",
		Width:     1280,
		Height:    700,
		MinWidth:  900,
		MinHeight: 600,
		OnStartup: app.startup,
		OnShutdown: func(ctx context.Context) {
			stopBackend()
		},
		AssetServer: &assetserver.Options{
			Handler: proxy,
		},
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}