package main

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"syscall"
	"time"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	wailsruntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

type Settings struct {
	ReminderState   bool   `json:"reminderState"`
	DisplayOver     bool   `json:"displayOver"`
	Autostart       bool   `json:"autostart"`
	NotifyTimeOfDay string `json:"notifyTimeOfDay"`
}

func loadSettings() (*Settings, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return nil, err
	}
	path := filepath.Join(home, ".wilo", "settings.json")

	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var settings Settings
	if err := json.Unmarshal(data, &settings); err != nil {
		return nil, err
	}
	return &settings, nil
}

var backendCmd *exec.Cmd

func resolveJarPath() string {
	exePath, err := os.Executable()
	if err != nil {
		return ""
	}
	exeDir := filepath.Dir(exePath)
	return filepath.Join(exeDir, "..", "..", "..", "backend", "target", "wilo-0.0.1.jar")
}

func startBackend() {
	jarPath := resolveJarPath()
	if jarPath == "" {
		return
	}
	backendCmd = exec.Command("java", "-jar", jarPath)
	if runtime.GOOS == "windows" {
		backendCmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	}
	backendCmd.Start()

	for i := 0; i < 30; i++ {
		resp, err := http.Get("http://localhost:8080/api/logs/date/1970-01-01")
		if err == nil {
			resp.Body.Close()
			return
		}
		time.Sleep(500 * time.Millisecond)
	}
}

func stopBackend() {
	if backendCmd != nil && backendCmd.Process != nil {
		backendCmd.Process.Kill()
	}
}

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

//?=== SetAlwaysOnTop is bound and callable from the frontend
func (a *App) SetAlwaysOnTop(enabled bool) {
	wailsruntime.WindowSetAlwaysOnTop(a.ctx, enabled)
}

func main() {
	startBackend()
	defer stopBackend()

	app := &App{}

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