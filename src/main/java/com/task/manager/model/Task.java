package com.task.manager.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Task")
@Getter
@Setter


public class Task {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taskId;

    @Column(nullable = false)
    private Long userId; // References User.userId
    private String title;
    private String description;
    private LocalDateTime createdAt; // Set when user submits the task
    private LocalDateTime dueDate;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // taskId is used for get, post, put, and database operations
    // Retrievals: get all, get by taskId, get by userId (handled in repository/service)
}
