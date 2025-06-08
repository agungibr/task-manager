package com.task.manager.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    private LocalDateTime dueDate;
    
    private LocalDateTime completedAt;
    
    @Enumerated(EnumType.STRING)
    private Priority priority;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    @OneToOne(mappedBy = "task", cascade = CascadeType.ALL)
    private Reminder reminder;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}