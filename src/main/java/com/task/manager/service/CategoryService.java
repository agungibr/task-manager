package com.task.manager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.task.manager.exception.CategoryNotFoundException;
import com.task.manager.model.Category;
import com.task.manager.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<Category> getUserCategories(Long userId) {
        return categoryRepository.findByUserId(userId);
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id, Long userId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found"));
        
        if (!category.getUserId().equals(userId)) {
            throw new CategoryNotFoundException("Category not found for this user");
        }
        
        categoryRepository.delete(category);
    }
}