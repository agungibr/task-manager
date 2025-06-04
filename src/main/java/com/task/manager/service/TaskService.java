package com.task.manager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.task.manager.exception.TaskNotFoundException;
import com.task.manager.model.Task;
import com.task.manager.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));
    }

    public List<Task> getTasksByUserId(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    public Task updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id)
                .map(task -> {
                    task.setTitle(updatedTask.getTitle());
                    task.setDescription(updatedTask.getDescription());
                    task.setDueDate(updatedTask.getDueDate());
                    return taskRepository.save(task);
                })
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}