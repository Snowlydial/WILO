package com.snowlydial.wilo.dto;

import java.time.LocalDate;
import com.snowlydial.wilo.model.Log;

public record LogStatusResponse(
    LocalDate dateFor,
    boolean isDone,
    boolean hasReminder
) {
    public static LogStatusResponse from(Log log) {
        return new LogStatusResponse(log.getDateFor(), log.isDone(), log.getReminderFor() != null);
    }
}