//go:build windows

package main

import "golang.org/x/sys/windows/registry"

func setAutostart(enable bool, exePath string) error {
	key, _, err := registry.CreateKey(registry.CURRENT_USER, `Software\Microsoft\Windows\CurrentVersion\Run`, registry.SET_VALUE)
	if err != nil {
		return err
	}
	defer key.Close()

	if enable {
		return key.SetStringValue("WILO", exePath)
	}
	return key.DeleteValue("WILO")
}