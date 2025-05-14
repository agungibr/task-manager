package com.task.manager.controller;

import org.springframework.web.bind.annotation.*;

@RestController
// @RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    
    @GetMapping("/getUser")
    public String getUser() {
        return "Hello User";
    }

    
    @PostMapping("/pong")
    public String pong() {
        return "Pong";
    }
}
