//go:build linux

package main

import (
	"fmt"
	"os"
	"path/filepath"
)

func setAutostart(enable bool, exePath string) error {
	home, err := os.UserHomeDir()
	if err != nil {
		return err
	}
	autostartDir := filepath.Join(home, ".config", "autostart")
	desktopFile := filepath.Join(autostartDir, "wilo.desktop")

	if !enable {
		return os.Remove(desktopFile)
	}

	if err := os.MkdirAll(autostartDir, 0755); err != nil {
		return err
	}

	content := fmt.Sprintf(`[Desktop Entry]
Type=Application
Name=WILO
Exec=%s
X-GNOME-Autostart-enabled=true
`, exePath)

	return os.WriteFile(desktopFile, []byte(content), 0644)
}