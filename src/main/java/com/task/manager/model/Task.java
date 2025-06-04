package com.task.manager.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tasks")  
@Data  
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false) 
    private String title;

    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime dueDate;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}