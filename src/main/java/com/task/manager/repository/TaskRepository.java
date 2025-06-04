package com.task.manager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.task.manager.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId);
}