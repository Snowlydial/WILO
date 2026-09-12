package com.snowlydial.wilo.model;

import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Setting {
    private boolean reminderState;
    private boolean displayOver;
    private boolean autostart;
    private LocalTime notifyTimeOfDay;
}