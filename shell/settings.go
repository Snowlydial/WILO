package main

import (
	"encoding/json"
	"os"
	"path/filepath"
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
