package com.snowlydial.wilo.repo;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.snowlydial.wilo.model.Log;

public interface LogRepository extends JpaRepository<Log, Long>{
    Optional<Log> findByDateFor(LocalDate date);
}
