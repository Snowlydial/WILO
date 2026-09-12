package com.snowlydial.wilo.dto;
import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LogRequest(
    @Size(max = 100, message = "Name cannot exceed 100 characters") String title,
    String content,
    @NotNull LocalDate dateFor,
    @NotNull boolean isDone,
    LocalDate reminderFor
) {

}
