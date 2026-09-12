package com.snowlydial.wilo.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.snowlydial.wilo.model.Log;

public record LogResponse(
    Long id,
    String title,
    String content,
    LocalDate dateFor,
    boolean isDone,
    LocalDate reminderFor,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static LogResponse from(Log log) {
        return new LogResponse(
            log.getId(),
            log.getTitle(),
            log.getContent(),
            log.getDateFor(),
            log.isDone(),
            log.getReminderFor(),
            log.getCreatedAt(),
            log.getUpdatedAt()
        );
    }
}