package com.snowlydial.wilo.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.snowlydial.wilo.model.Log;
import com.snowlydial.wilo.dto.LogRequest;
import com.snowlydial.wilo.repo.LogRepository;

@Service
@RequiredArgsConstructor
public class LogService {
    private LogRepository logRepository;

    // prolly never gonna use this one tho
    public List<Log> findAll() {
        return logRepository.findAll();
    }

    public Log findById(Long id) {
        return logRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No log found"));
    }

    public Log findByDateFor(LocalDate date) {
        return logRepository.findByDateFor(date)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No log found for date: " + date));
    }

    public Log create(LogRequest request) {
        Log Log = new Log();
        applyRequest(Log, request);
        return logRepository.save(Log);
    }

    public Log update(Long id, LogRequest request) {
        Log Log = findById(id);
        applyRequest(Log, request);
        return logRepository.save(Log);
    }

    @Transactional
    public void delete(Long id) {
        Log log = findById(id);
        logRepository.delete(log);
    }

    private void applyRequest(Log log, LogRequest request) {
        log.setTitle(request.title());
        log.setContent(request.content());
        log.setDateFor(request.dateFor());
        log.setDone(request.isDone());
        log.setReminderFor(request.reminderFor());
    }
}
