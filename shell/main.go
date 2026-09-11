package main

import (
	"context"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
	"time"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var backendCmd *exec.Cmd

func resolveJarPath() string {
	exePath, err := os.Executable()
	if err != nil {
		println("Failed to resolve executable path:", err.Error())
		return ""
	}
	exeDir := filepath.Dir(exePath)

	// shell/build/bin/wilo.exe -> ../../../backend/target/wilo-0.0.1.jar
	return filepath.Join(exeDir, "..", "..", "..", "backend", "target", "wilo-0.0.1.jar")
}

func startBackend() {
	jarPath := resolveJarPath()
	if jarPath == "" {
		return
	}

	backendCmd = exec.Command("java", "-jar", jarPath)
	backendCmd.SysProcAttr = &syscall.SysProcAttr{
		HideWindow: true,
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
	runtime.WindowExecJS(ctx, `
		window.addEventListener('load', function() {
			document.body.style.zoom = '90%';
		});
	`)
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
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
