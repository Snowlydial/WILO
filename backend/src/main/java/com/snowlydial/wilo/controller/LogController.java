package com.snowlydial.wilo.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.snowlydial.wilo.dto.LogRequest;
import com.snowlydial.wilo.dto.LogResponse;
import com.snowlydial.wilo.dto.LogStatusResponse;
import com.snowlydial.wilo.service.LogService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {
    private final LogService logService;
    
    @GetMapping("/{id}")
    public LogResponse show(@PathVariable Long id) {
        return LogResponse.from(logService.findById(id));
    }

    @GetMapping("/date/{date}")
    public LogResponse showForDate(@PathVariable LocalDate date) {
        return LogResponse.from(logService.findByDateFor(date));
    }

    @GetMapping("/search")
    public List<LogResponse> search(@RequestParam String q) {
        return logService.search(q);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LogResponse store(@Valid @RequestBody LogRequest request) {
        return LogResponse.from(logService.create(request));
    }

    @PutMapping("/{id}")
    public LogResponse update(@PathVariable Long id, @Valid @RequestBody LogRequest request) {
        return LogResponse.from(logService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void destroy(@PathVariable Long id) {
        logService.delete(id);
    }

    @GetMapping("/reminders/due")
    public List<LogResponse> getDueReminders() {
        return logService.getDueReminders();
    }

    @GetMapping("/status")
    public List<LogStatusResponse> getStatusRange(@RequestParam LocalDate start, @RequestParam LocalDate end) {
        return logService.getStatusRange(start, end);
    }
}
