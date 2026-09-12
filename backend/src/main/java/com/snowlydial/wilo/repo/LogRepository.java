package com.snowlydial.wilo.repo;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.snowlydial.wilo.model.Log;

public interface LogRepository extends JpaRepository<Log, Long>{
    Optional<Log> findByDateFor(LocalDate date);

    @Query("SELECT l FROM Log l WHERE " +
           "LOWER(l.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.content) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY l.dateFor DESC")
    List<Log> searchByTitleOrContent(@Param("query") String query);

    @Query("SELECT l FROM Log l WHERE l.reminderFor <= :date AND l.isDone = false")
    List<Log> findDueReminders(@Param("date") LocalDate date);

    @Query("SELECT l FROM Log l WHERE l.dateFor BETWEEN :start AND :end")
    List<Log> findByDateForBetween(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
