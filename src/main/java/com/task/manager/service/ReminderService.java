package com.task.manager.service;

import org.springframework.stereotype.Service;

import com.task.manager.exception.TaskNotFoundException;
import com.task.manager.model.Reminder;
import com.task.manager.model.Task;
import com.task.manager.repository.ReminderRepository;
import com.task.manager.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReminderService {
    private final ReminderRepository reminderRepository;
    private final TaskRepository taskRepository;

    public Reminder createReminder(Long taskId, Reminder reminder) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task not found"));
        
        reminder.setTask(task);
        return reminderRepository.save(reminder);
    }

    public Reminder updateReminder(Long reminderId, Reminder updatedReminder) {
        return reminderRepository.findById(reminderId)
                .map(reminder -> {
                    reminder.setRemindAt(updatedReminder.getRemindAt());
                    reminder.setReminderMessage(updatedReminder.getReminderMessage());
                    reminder.setActive(updatedReminder.isActive());
                    return reminderRepository.save(reminder);
                })
                .orElseThrow(() -> new RuntimeException("Reminder not found"));
    }

    public void deleteReminder(Long reminderId) {
        reminderRepository.deleteById(reminderId);
    }
}