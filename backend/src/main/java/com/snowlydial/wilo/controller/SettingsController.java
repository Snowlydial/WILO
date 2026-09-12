package com.snowlydial.wilo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.snowlydial.wilo.model.Setting;
import com.snowlydial.wilo.service.SettingsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {
    private final SettingsService settingsService;

    @GetMapping
    public Setting getSettings() {
        return settingsService.loadSettings();
    }

    @PutMapping
    public Setting updateSettings(@RequestBody Setting settings) {
        settingsService.saveSettings(settings);
        return settings;
    }
}