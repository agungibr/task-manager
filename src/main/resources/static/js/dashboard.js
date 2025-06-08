let currentUserId = null;
let categoriesData = [];

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initializeDashboard();
    initializeElegantForm();
    initializeHistory();
    loadUserData();
    
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});

function checkAuthentication() {
    console.log('checkAuthentication called');
    const currentUser = localStorage.getItem('currentUser');
    console.log('currentUser from localStorage:', currentUser);
    
    if (!currentUser) {
        console.log('No currentUser found, redirecting to login');
        window.location.href = 'auth/login.html';
        return false;
    }
    
    try {
        const userData = JSON.parse(currentUser);
        currentUserId = userData.userId;
        console.log('Authentication successful, currentUserId set to:', currentUserId);
        
        updateUserInfo(userData);
        return true;
    } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('currentUser');
        window.location.href = 'auth/login.html';
        return false;
    }
}

function updateUserInfo(userData) {
    const userProfileImg = document.querySelector('.user-profile img');
    if (userProfileImg) {
        userProfileImg.alt = userData.username || userData.email;
    }
    
    console.log('User logged in:', userData.username || userData.email);
}

async function loadUserData() {
    console.log('loadUserData called, currentUserId:', currentUserId);
    if (!currentUserId) {
        console.error('loadUserData called but no currentUserId set');
        return;
    }
    
    try {
        console.log('Loading categories...');
        await loadCategories();
        
        console.log('Loading tasks...');
        await loadTasks();
        
        console.log('Updating task counts...');
        updateTaskCounts();
        
        console.log('User data loaded successfully');
    } catch (error) {
        console.error('Error loading user data:', error);
        showNotification('Error loading data. Please refresh the page.', 'error');
    }
}

function initializeDashboard() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    const summaryCards = document.querySelectorAll('.summary-card');
    summaryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

function initializeElegantForm() {
    const addTaskBtn = document.querySelector('.add-task-btn');
    const taskFormModal = document.querySelector('.task-form-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const taskForm = document.getElementById('newTaskForm');
    const reminderToggle = document.getElementById('enableReminder');
    const reminderContent = document.getElementById('reminderContent');

    if (addTaskBtn && taskFormModal) {
        addTaskBtn.addEventListener('click', () => {
            taskFormModal.classList.add('active');
            setTimeout(() => {
                const formSections = document.querySelectorAll('.form-section');
                formSections.forEach(section => {
                    section.style.animation = 'none';
                    section.offsetHeight; 
                    section.style.animation = null;
                });
            }, 100);
        });
    }

    if (closeModalBtns) {
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                taskFormModal.classList.remove('active');
                setTimeout(() => {
                    taskForm.reset();
                    resetFormState();
                }, 300);
            });
        });
    }

    taskFormModal?.addEventListener('click', (e) => {
        if (e.target === taskFormModal) {
            taskFormModal.classList.remove('active');
            setTimeout(() => {
                taskForm.reset();
                resetFormState();
            }, 300);
        }
    });

    if (reminderToggle && reminderContent) {
        reminderToggle.addEventListener('change', function() {
            if (this.checked) {
                reminderContent.classList.add('active');
                const dueDateInput = document.getElementById('taskDueDate');
                const reminderInput = document.getElementById('reminderDateTime');
                if (dueDateInput.value && reminderInput) {
                    const dueDate = new Date(dueDateInput.value);
                    const reminderDate = new Date(dueDate.getTime() - 60 * 60 * 1000); 
                    reminderInput.value = reminderDate.toISOString().slice(0, 16);
                }
            } else {
                reminderContent.classList.remove('active');
            }
        });
    }

    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission();
        });
    }

    initializeFloatingLabels();
    
    initializeFormValidation();
}

function initializeFloatingLabels() {
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        checkFloatingLabel(input);
        
        input.addEventListener('focus', () => checkFloatingLabel(input));
        input.addEventListener('blur', () => checkFloatingLabel(input));
        input.addEventListener('input', () => checkFloatingLabel(input));
    });
}

function checkFloatingLabel(input) {
    const label = input.nextElementSibling;
    if (input.value || input === document.activeElement) {
        label?.classList.add('active');
    } else {
        label?.classList.remove('active');
    }
}

function initializeFormValidation() {
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-datetime');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const isValid = field.checkValidity();
    const wrapper = field.closest('.form-group') || field.closest('.select-wrapper') || field.closest('.datetime-group');
    
    if (!isValid && field.value) {
        wrapper?.classList.add('error');
    } else {
        wrapper?.classList.remove('error');
    }
    
    return isValid;
}

function clearFieldError(field) {
    const wrapper = field.closest('.form-group') || field.closest('.select-wrapper') || field.closest('.datetime-group');
    wrapper?.classList.remove('error');
}

async function handleFormSubmission() {
    const form = document.getElementById('newTaskForm');
    const submitBtn = form.querySelector('.btn-primary');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    const isFormValid = validateForm();
    if (!isFormValid) {
        showFormError('Please fill in all required fields correctly.');
        return;
    }
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        const taskData = collectFormData();
        await createTask(taskData);
        
        showFormSuccess('Task created successfully!');
        setTimeout(() => {
            document.querySelector('.task-form-modal').classList.remove('active');
            form.reset();
            resetFormState();
        }, 1500);
        
    } catch (error) {
        console.error('Error creating task:', error);
        showFormError('Failed to create task. Please try again.');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function validateForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function collectFormData() {
    const reminderEnabled = document.getElementById('enableReminder').checked;
    
    const taskData = {
        title: document.getElementById('taskTitle').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        priority: document.getElementById('taskPriority').value,
        categoryId: document.getElementById('taskCategory').value || null,
        dueDate: document.getElementById('taskDueDate').value || null
    };
    
    if (reminderEnabled) {
        const remindAt = document.getElementById('reminderDateTime').value;
        const reminderMessage = document.getElementById('reminderMessage').value.trim();
        
        if (remindAt) {
            taskData.reminder = {
                remindAt: remindAt,
                reminderMessage: reminderMessage || `Reminder for: ${taskData.title}`,
                isActive: true
            };
        }
    }
    
    return taskData;
}    async function createTask(taskData) {
    try {
        const taskPayload = {
            userId: currentUserId,
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority,
            dueDate: taskData.dueDate ? taskData.dueDate : null,
            category: taskData.categoryId ? { id: taskData.categoryId } : null
        };

        console.log('Creating task with payload:', taskPayload);
        
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskPayload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Create task error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }

        const createdTask = await response.json();
        console.log('Created task:', createdTask);

        if (taskData.reminder && taskData.reminder.remindAt) {
            await createReminder(createdTask.id, taskData.reminder);
        }

        await loadTasks();
        return createdTask;

    } catch (error) {
        console.error('Error creating task:', error);
        throw new Error('Failed to create task. Please try again.');
    }
}


function resetFormState() {
    document.querySelectorAll('.form-label').forEach(label => {
        label.classList.remove('active');
    });
    
    const reminderToggle = document.getElementById('enableReminder');
    const reminderContent = document.getElementById('reminderContent');
    if (reminderToggle && reminderContent) {
        reminderToggle.checked = false;
        reminderContent.classList.remove('active');
    }
    
    document.querySelectorAll('.form-group, .select-wrapper, .datetime-group').forEach(wrapper => {
        wrapper.classList.remove('error');
    });
    
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
}

function showFormError(message) {
    showFormMessage(message, 'error');
}

function showFormSuccess(message) {
    showFormMessage(message, 'success');
}

function showFormMessage(message, type) {
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    
    const formActions = document.querySelector('.form-actions');
    formActions.parentNode.insertBefore(messageEl, formActions);
    
    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

async function loadCategories() {
    if (!currentUserId) return;
    
    try {
        const response = await fetch(`/api/categories/user/${currentUserId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const categories = await response.json();
        categoriesData = categories;
        
        const categorySelect = document.getElementById('taskCategory');
        if (categorySelect) {
            while (categorySelect.children.length > 1) {
                categorySelect.removeChild(categorySelect.lastChild);
            }
            
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        loadDefaultCategories();
    }
}

function loadDefaultCategories() {
    categoriesData = [];
    
    const categorySelect = document.getElementById('taskCategory');
    if (categorySelect) {
        while (categorySelect.children.length > 1) {
            categorySelect.removeChild(categorySelect.lastChild);
        }
    }
    
    console.warn('Failed to load categories from backend, no categories available');
}

function getCategoryName(categoryId) {
    if (!categoryId) return null;
    const category = categoriesData.find(cat => cat.id == categoryId);
    return category ? category.name : null;
}

function formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'No date set';
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function initializeHistory() {
    const historyHeader = document.getElementById('toggleHistory');
    const historyContent = document.getElementById('historyContent');
    const toggleBtn = document.querySelector('.toggle-history-btn');

    if (historyHeader && historyContent && toggleBtn) {
        historyHeader.addEventListener('click', () => {
            historyContent.classList.toggle('active');
            toggleBtn.classList.toggle('active');
        });
    }
}

function updateTaskCounts() {
    const allTasks = document.querySelectorAll('.task-item');
    const completedTasks = document.querySelectorAll('.task-item.completed');
    const activeTasks = document.querySelectorAll('.task-item:not(.completed)');
    
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    let deadlineNear = 0;
    
    activeTasks.forEach(taskElement => {
        const deadlineSpan = taskElement.querySelector('.task-deadline');
        if (deadlineSpan && deadlineSpan.textContent !== 'No due date') {
            const taskId = taskElement.dataset.taskId;
            const taskData = taskElement.querySelector('.task-deadline').textContent;
            try {
                const dueDate = new Date(taskData.replace('📅 ', ''));
                if (!isNaN(dueDate.getTime()) && dueDate <= nextWeek) {
                    deadlineNear++;
                }
            } catch (e) {
            }
        }
    });

    const summaryCards = document.querySelectorAll('.summary-cards .card-info p');
    if (summaryCards.length >= 4) {
        summaryCards[0].textContent = allTasks.length;
        summaryCards[1].textContent = completedTasks.length;
        summaryCards[2].textContent = activeTasks.length;
        summaryCards[3].textContent = deadlineNear;
    }
}

function formatDate(dateInput) {
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}

function formatTime(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

async function loadTasks() {
    if (!currentUserId) return;
    
    try {
        const response = await fetch(`/api/tasks/user/${currentUserId}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Load tasks error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        }
        
        const tasks = await response.json();
        console.log('Loaded tasks:', tasks);
        renderTasks(tasks);
        
    } catch (error) {
        console.error('Error loading tasks:', error);
        showNotification('Error loading tasks. Please refresh the page.', 'error');
    }
}

function renderTasks(tasks) {
    const tasksList = document.querySelector('.tasks-list');
    const historyContent = document.getElementById('historyContent');
    
    if (!tasksList) return;
    
    tasksList.innerHTML = '';
    if (historyContent) {
        historyContent.innerHTML = '';
    }
    
    tasks.forEach(task => {
        if (task.completedAt) {
            if (historyContent) {
                const historyElement = createTaskElement(task, true);
                historyContent.appendChild(historyElement);
            }
        } else {
            const taskElement = createTaskElement(task, false);
            tasksList.appendChild(taskElement);
        }
    });
    
    updateTaskCounts();
}

function createTaskElement(task, isCompleted = false) {
    const taskElement = document.createElement('div');
    taskElement.className = isCompleted ? 'task-item completed' : 'task-item';
    taskElement.dataset.taskId = task.id;
    
    const categoryName = getCategoryName(task.category?.id);
    const priority = task.priority || 'NOT_IMPORTANT';
    const priorityClass = priority.toLowerCase().replace(/_/g, '-');
    const priorityDisplay = priority.replace(/_/g, ' ');
    const dueDateDisplay = task.dueDate ? formatDateTime(task.dueDate) : 'No due date';
    const reminderDisplay = task.reminder ? `Reminder set for ${formatDateTime(task.reminder.remindAt)}` : 'No reminder';
    const completionDate = task.completedAt ? formatDate(task.completedAt) : '';
    
    taskElement.innerHTML = `
        <div class="task-checkbox">
            <input type="checkbox" id="task${task.id}" ${isCompleted ? 'checked disabled' : ''}>
            <label for="task${task.id}"></label>
        </div>
        <div class="task-details">
            <h3 class="task-title">${task.title}</h3>
            <p class="task-desc">${task.description || ''}</p>
            <div class="task-meta">
                ${categoryName ? `<span class="task-category"><i class="fas fa-folder"></i> ${categoryName}</span>` : ''}
                <span class="status-badge status-${isCompleted ? 'completed' : 'not-started'}">
                    <i class="fas fa-${isCompleted ? 'check' : 'circle'}"></i> ${isCompleted ? 'COMPLETED' : 'NOT STARTED'}
                </span>
                <span class="task-deadline"><i class="fas fa-calendar"></i> ${dueDateDisplay}</span>
                <span class="task-reminder"><i class="fas fa-bell"></i> ${reminderDisplay}</span>
                ${isCompleted ? `<span class="completion-date"><i class="fas fa-flag-checkered"></i> Completed on ${completionDate}</span>` : ''}
            </div>
        </div>
        <div class="task-priority priority-${priorityClass}">
            ${priorityDisplay}
        </div>
        ${!isCompleted ? `
        <div class="task-actions">
            <button class="edit-btn" onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
        </div>
        ` : ''}
    `;

    if (!isCompleted) {
        const checkbox = taskElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                markTaskAsCompleted(task.id);
            }
        });
    }
    
    return taskElement;
}

async function markTaskAsCompleted(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}/complete`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await loadTasks();
        showNotification('Task marked as completed!', 'success');

    } catch (error) {
        console.error('Error completing task:', error);
        showNotification('Error completing task. Please try again.', 'error');
        const checkbox = document.querySelector(`input[id="task${taskId}"]`);
        if (checkbox) checkbox.checked = false;
    }
}

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.style.transition = 'all 0.3s ease';
            taskElement.style.opacity = '0';
            taskElement.style.transform = 'translateX(-100%)';
            
            setTimeout(() => {
                taskElement.remove();
                updateTaskCounts();
            }, 300);
        }

        showNotification('Task deleted successfully!', 'success');

    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Error deleting task. Please try again.', 'error');
    }
}

async function editTask(taskId) {
    console.log('Edit task:', taskId);
}

async function createReminder(taskId, reminderData) {
    try {
        const response = await fetch(`/api/tasks/${taskId}/reminder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                remindAt: new Date(reminderData.remindAt).toISOString(),
                reminderMessage: reminderData.reminderMessage,
                isActive: reminderData.isActive
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        console.error('Error creating reminder:', error);
        throw error;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'auth/login.html';
}
