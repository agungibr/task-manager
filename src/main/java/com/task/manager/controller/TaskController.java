package com.task.manager.controller;

import org.springframework.web.bind.annotation.*;
import com.task.manager.model.Task;
import com.task.manager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/task")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping("/getTask")
    public String getTask() {
        return "Hello Task";
    }

    @GetMapping("/all")
    public List<Task> getAllTask() {
        return taskRepository.findAll();
    }

    @PostMapping("/add")
    public Task addTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    @PostMapping("/addWithParams")
    public Task addTaskWithParams(@RequestParam String title, @RequestParam String description) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        return taskRepository.save(task);
    }

    @PostMapping("/addWithBody")
    public Task addTaskWithBody(@RequestBody Task task) {
        return taskRepository.save(task);
    }
}
