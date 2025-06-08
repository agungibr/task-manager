package com.task.manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.task.manager.model.Reminder;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
}