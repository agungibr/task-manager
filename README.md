# Task Manager

## Productivity Simplified

Where efficiency meets elegance

---

## 🚀 What We Built

> A web application that **transforms** how you manage tasks.  
> Clean. Intuitive. Powerful.

Built with **Spring Boot** and **PostgreSQL**, designed for those who value both function and form.

## ✨ The Experience

### 🎯 Dashboard That Breathes

Real-time task management with elegant animations and responsive design.

### 📋 Smart Organization

Categories, priorities, and deadlines that adapt to your workflow.

### ⚡ Never Miss a Beat

Intelligent reminders that keep you ahead of what matters.

### 🔒 Your Data, Secure

PostgreSQL database with encrypted authentication. Your privacy protected.

## Technology Stack

- **Backend:** Spring Boot 3.4.5, Spring Security, JPA/Hibernate
- **Database:** PostgreSQL (Neon Cloud)
- **Frontend:** Vanilla JavaScript, CSS3, HTML5
- **Security:** BCrypt password encryption
- **Architecture:** RESTful API, MVC pattern

## Features

✨ **Task Management**  
Create, edit, complete, and organize with effortless precision.

📊 **Live Dashboard**  
Real-time metrics and progress tracking that motivates.

🔔 **Smart Reminders**  
Custom notifications that work with your schedule.

📱 **Responsive Design**  
Beautiful on desktop, tablet, and mobile.

🔐 **Secure Authentication**  
Registration and login with enterprise-grade security.

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.6+
- PostgreSQL database

### Quick Start

```bash
git clone https://github.com/agungibr/task-manager.git
cd task-manager
mvn spring-boot:run
```

Navigate to `http://localhost:8080` and experience productivity redefined.

## Database Configuration

Configure your PostgreSQL connection in `application.properties`:

- Database URL, username, and password
- Automatic schema updates with Hibernate DDL
- Connection pooling optimized for performance

## API Architecture

### RESTful Design

Clean endpoints for tasks, categories, users, and reminders.

### Real-time Updates

Dynamic content loading without page refreshes.

### Error Handling

Graceful degradation with user-friendly messaging.

## Project Structure

```text
src/
├── main/java/com/task/manager/
│   ├── controller/     # REST API endpoints
│   ├── model/         # Data entities
│   ├── repository/    # Data access layer
│   ├── service/       # Business logic
│   └── config/        # Security configuration
└── resources/static/  # Frontend assets
```

## Security Features

- Password encryption with BCrypt
- Session-based authentication
- XSS protection
- CSRF protection
- Secure database connections

## Performance

- Optimized SQL queries
- Efficient caching strategies
- Minimal JavaScript bundle
- Fast page load times
- Responsive user interactions

---

*Where productivity meets elegance.*

Built with precision. Designed for impact.
