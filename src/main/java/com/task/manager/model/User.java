package com.task.manager.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
// import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_task_id")

public class User{
    @Id @GeneratedValue
    private String UserId;

    private String UserName;
    private String UserEmail;
    private String Password;

    // @JsonIgnore
    // @OneToMany(mappedBy = "taskId")
    // private TaskList<Task> taskList;

}