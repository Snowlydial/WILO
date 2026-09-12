package main

import (
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

var backendCmd *exec.Cmd

func resolveJarPath() string {
	exePath, err := os.Executable()
	if err != nil {
		return ""
	}
	exeDir := filepath.Dir(exePath)
	return filepath.Join(exeDir, "..", "..", "backend", "wilo-0.0.1.jar")
}

func startBackend() {
	jarPath := resolveJarPath()
	if jarPath == "" {
		return
	}
	backendCmd = exec.Command("java", "-jar", jarPath)
	hideConsoleWindow(backendCmd)
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
