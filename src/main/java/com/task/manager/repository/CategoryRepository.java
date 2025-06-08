package com.task.manager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.task.manager.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUserId(Long userId);
}