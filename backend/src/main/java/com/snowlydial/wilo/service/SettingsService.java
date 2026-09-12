package com.snowlydial.wilo.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalTime;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.snowlydial.wilo.model.Setting;

@Service
public class SettingsService {

    private final Path settingsPath = Path.of(System.getProperty("user.home"), ".wilo", "settings.json");
    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    public void saveSettings(Setting settings) {
        try {
            Files.createDirectories(settingsPath.getParent());
            objectMapper.writeValue(settingsPath.toFile(), settings);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save settings", e);
        }
    }

    private Setting createDefaultSettings() {
        Setting defaults = new Setting(true, false, false, LocalTime.of(9, 0));
        saveSettings(defaults);
        return defaults;
    }

    public Setting loadSettings() {
        try {
            if (!Files.exists(settingsPath)) {
                return createDefaultSettings();
            }
            return objectMapper.readValue(settingsPath.toFile(), Setting.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load settings", e);
        }
    }
    
}