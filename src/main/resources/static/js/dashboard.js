let currentUserId = null;
let categoriesData = [];

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    initializeDashboard();
    initializeElegantForm();
    initializeEditForm();
    initializeDeleteConfirmation();
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
        showCustomAlert('❌ Loading Error', 'Error loading data. Please refresh the page.', 'error');
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
    const inputs = document.querySelectorAll('#newTaskForm .form-input, #newTaskForm .form-select, #newTaskForm .form-datetime');
    
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
    
    if (!isValid) {
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
    
    console.log('=== FORM SUBMISSION STARTED ===');
    
    const title = document.getElementById('taskTitle').value.trim();
    const priority = document.getElementById('taskPriority').value;
    
    console.log('Quick validation check:');
    console.log('Title:', title);
    console.log('Priority:', priority);
    
    if (!title) {
        console.log('❌ Title is empty');
        showCustomAlert('❌ Title Required', 'Please enter a task title.', 'error');
        return;
    }
    
    if (!priority) {
        console.log('❌ Priority is empty');
        showCustomAlert('❌ Priority Required', 'Please select a priority level.', 'error');
        return;
    }
    
    console.log('✅ Basic validation passed, proceeding with full validation');
    
    const isFormValid = validateForm();
    if (!isFormValid) {
        showCustomAlert('❌ Form Invalid', 'Please fill in all required fields correctly.', 'error');
        return;
    }
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    showCustomAlert('📝 Creating Task', 'Please wait while we create your new task...', 'info');
    
    try {
        const taskData = collectFormData();
        await createTask(taskData);
        
        showCustomAlert('🎉 Success!', `Task "${taskData.title}" has been created successfully! You can view it in your task list below.`, 'success');
        setTimeout(() => {
            document.querySelector('.task-form-modal').classList.remove('active');
            form.reset();
            resetFormState();
        }, 1500);
        
    } catch (error) {
        console.error('Error creating task:', error);
        showCustomAlert('❌ Creation Failed', 'Failed to create task. Please try again.', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function validateForm() {
    const requiredFields = document.querySelectorAll('#newTaskForm [required]');
    let isValid = true;
    let invalidFields = [];
    
    console.log('=== FORM VALIDATION DEBUG ===');
    console.log('Found required fields:', requiredFields);
    
    requiredFields.forEach(field => {
        const fieldValid = field.checkValidity();
        const fieldValue = field.value;
        
        console.log(`Field: ${field.id || field.name}`, {
            value: fieldValue,
            isValid: fieldValid,
            type: field.type,
            tagName: field.tagName
        });
        
        if (!fieldValid) {
            isValid = false;
            invalidFields.push({
                id: field.id || field.name || 'Unknown field',
                value: fieldValue,
                reason: field.validationMessage
            });
        }
        
        validateField(field);
    });
    
    if (!isValid) {
        console.log('❌ Form validation failed!');
        console.log('Invalid fields:', invalidFields);
    } else {
        console.log('✅ Form validation passed!');
    }
    
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
    
    console.log('=== FORM DATA COLLECTION DEBUG ===');
    console.log('Collected task data:', taskData);
    console.log('Priority field element:', document.getElementById('taskPriority'));
    console.log('Priority value from element:', document.getElementById('taskPriority').value);
    console.log('Priority selected index:', document.getElementById('taskPriority').selectedIndex);
    console.log('Reminder enabled:', reminderEnabled);
    
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
    
    console.log('Final task data with reminders:', taskData);
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

function initializeEditForm() {
    const editFormModal = document.getElementById('editTaskFormModal');
    const closeEditModalBtns = document.querySelectorAll('.close-edit-modal');
    const editForm = document.getElementById('editTaskForm');
    
    if (closeEditModalBtns) {
        closeEditModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                editFormModal.classList.remove('active');
                setTimeout(() => {
                    editForm.reset();
                }, 300);
            });
        });
    }
    
    editFormModal?.addEventListener('click', (e) => {
        if (e.target === editFormModal) {
            editFormModal.classList.remove('active');
            setTimeout(() => {
                editForm.reset();
            }, 300);
        }
    });
    
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleEditFormSubmission();
        });
    }
    
    const editInputs = document.querySelectorAll('#editTaskForm .form-input');
    editInputs.forEach(input => {
        input.addEventListener('input', () => updateEditFormLabels());
        input.addEventListener('focus', () => updateEditFormLabels());
        input.addEventListener('blur', () => updateEditFormLabels());
    });
}

function initializeDeleteConfirmation() {
    const deleteModal = document.getElementById('deleteConfirmModal');
    const cancelDeleteBtn = document.querySelector('.cancel-delete');
    const confirmDeleteBtn = document.querySelector('.confirm-delete');
    
    cancelDeleteBtn?.addEventListener('click', () => {
        deleteModal.classList.remove('active');
        taskToDelete = null;
        showCustomAlert('🚫 Delete Cancelled', 'Task deletion was cancelled', 'info');
    });
    
    confirmDeleteBtn?.addEventListener('click', () => {
        confirmDelete();
    });
    
    deleteModal?.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            deleteModal.classList.remove('active');
            taskToDelete = null;
            showCustomAlert('🚫 Delete Cancelled', 'Task deletion was cancelled', 'info');
        }
    });
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
        showCustomAlert('❌ Loading Error', 'Error loading tasks. Please refresh the page.', 'error');
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
        showCustomAlert('✅ Completing Task', 'Marking task as completed...', 'info');
        
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
        showCustomAlert('🎉 Congratulations!', 'Excellent work! Your task has been completed and moved to the history section.', 'success');

    } catch (error) {
        console.error('Error completing task:', error);
        showCustomAlert('❌ Complete Failed', 'Failed to mark task as completed. Please try again.', 'error');
        const checkbox = document.querySelector(`input[id="task${taskId}"]`);
        if (checkbox) checkbox.checked = false;
    }
}

let taskToDelete = null;

async function deleteTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (!taskElement) return;
    
    const taskTitle = taskElement.querySelector('.task-title').textContent;
    const taskDesc = taskElement.querySelector('.task-desc').textContent || 'No description';
    
    taskToDelete = taskId;
    
    showDeleteConfirmation(taskTitle, taskDesc);
}

function showDeleteConfirmation(title, description) {
    const deleteModal = document.getElementById('deleteConfirmModal');
    const titleElement = document.getElementById('deleteTaskTitle');
    const descElement = document.getElementById('deleteTaskDesc');
    
    titleElement.textContent = title;
    descElement.textContent = description;
    
    deleteModal.classList.add('active');
    
    showCustomAlert('⚠️ Deletion Confirmation', 'Please confirm if you want to delete this task', 'warning');
}

async function confirmDelete() {
    if (!taskToDelete) return;
    
    try {
        showCustomAlert('🗑️ Deleting Task', 'Please wait while we delete your task...', 'info');
        
        const response = await fetch(`/api/tasks/${taskToDelete}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const taskElement = document.querySelector(`[data-task-id="${taskToDelete}"]`);
        if (taskElement) {
            taskElement.style.transition = 'all 0.3s ease';
            taskElement.style.opacity = '0';
            taskElement.style.transform = 'translateX(-100%)';
            
            setTimeout(() => {
                taskElement.remove();
                updateTaskCounts();
            }, 300);
        }

        document.getElementById('deleteConfirmModal').classList.remove('active');
        
        showCustomAlert('✅ Task Deleted', 'Your task has been permanently deleted and removed from your task list', 'success');
        taskToDelete = null;

    } catch (error) {
        console.error('Error deleting task:', error);
        showCustomAlert('❌ Delete Failed', 'Failed to delete task. Please try again.', 'error');
    }
}

async function editTask(taskId) {
    try {
        showCustomAlert('📝 Loading Task', 'Loading task details for editing...', 'info');
        
        const response = await fetch(`/api/tasks/${taskId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const task = await response.json();
        console.log('Loaded task for editing:', task);
        
        populateEditForm(task);
        
        const editModal = document.getElementById('editTaskFormModal');
        editModal.classList.add('active');
        
        showCustomAlert('✏️ Edit Mode Active', 'Task details loaded successfully. Edit any field below and save your changes.', 'success');
        
    } catch (error) {
        console.error('Error loading task for edit:', error);
        showCustomAlert('❌ Load Failed', 'Failed to load task details. Please try again.', 'error');
    }
}

function populateEditForm(task) {
    document.getElementById('editTaskId').value = task.id;
    document.getElementById('editTaskTitle').value = task.title || '';
    document.getElementById('editTaskDescription').value = task.description || '';
    document.getElementById('editTaskPriority').value = task.priority || '';
    document.getElementById('editTaskCategory').value = task.category?.id || '';
    
    if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const formattedDate = dueDate.toISOString().slice(0, 16);
        document.getElementById('editTaskDueDate').value = formattedDate;
    } else {
        document.getElementById('editTaskDueDate').value = '';
    }
    
    populateEditCategoryDropdown();
    
    setTimeout(() => {
        updateEditFormLabels();
    }, 100);
}

function populateEditCategoryDropdown() {
    const editCategorySelect = document.getElementById('editTaskCategory');
    if (editCategorySelect && categoriesData) {
        while (editCategorySelect.children.length > 1) {
            editCategorySelect.removeChild(editCategorySelect.lastChild);
        }
        
        categoriesData.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            editCategorySelect.appendChild(option);
        });
    }
}

function updateEditFormLabels() {
    const inputs = document.querySelectorAll('#editTaskForm .form-input');
    inputs.forEach(input => {
        const label = input.nextElementSibling;
        if (label && label.classList.contains('form-label')) {
            if (input.value.trim() !== '') {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        }
    });
}

async function handleEditFormSubmission() {
    const form = document.getElementById('editTaskForm');
    const submitBtn = form.querySelector('.btn-primary');
    
    const isValid = validateEditForm();
    if (!isValid) {
        showCustomAlert('❌ Validation Error', 'Please fill in all required fields correctly.', 'error');
        return;
    }
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    showCustomAlert('💾 Updating Task', 'Saving your changes...', 'info');
    
    try {
        const taskData = collectEditFormData();
        const taskId = document.getElementById('editTaskId').value;
        
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Update task error:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const updatedTask = await response.json();
        console.log('Updated task:', updatedTask);
        
        document.getElementById('editTaskFormModal').classList.remove('active');
        await loadTasks();
        
        showCustomAlert('✅ Update Complete', `Task "${taskData.title}" has been successfully updated with your changes!`, 'success');
        
    } catch (error) {
        console.error('Error updating task:', error);
        showCustomAlert('❌ Update Failed', 'Failed to update task. Please try again.', 'error');
    } finally {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function validateEditForm() {
    const title = document.getElementById('editTaskTitle').value.trim();
    const priority = document.getElementById('editTaskPriority').value;
    
    return title.length > 0 && priority.length > 0;
}

function collectEditFormData() {
    const taskData = {
        userId: currentUserId,
        title: document.getElementById('editTaskTitle').value.trim(),
        description: document.getElementById('editTaskDescription').value.trim(),
        priority: document.getElementById('editTaskPriority').value,
        categoryId: document.getElementById('editTaskCategory').value || null,
        dueDate: document.getElementById('editTaskDueDate').value || null
    };
    
    if (taskData.categoryId) {
        taskData.category = { id: taskData.categoryId };
    }
    
    return taskData;
}

function showCustomAlert(title, message, type = 'info') {
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alertElement = document.createElement('div');
    alertElement.className = `custom-alert ${type}`;
    
    const iconMap = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    alertElement.innerHTML = `
        <div class="alert-icon">
            <i class="${iconMap[type] || iconMap.info}"></i>
        </div>
        <div class="alert-content">
            <div class="alert-title">${title}</div>
            <div class="alert-message">${message}</div>
        </div>
        <button class="alert-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(alertElement);
    
    setTimeout(() => {
        alertElement.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        if (alertElement.parentElement) {
            alertElement.classList.remove('show');
            setTimeout(() => {
                if (alertElement.parentElement) {
                    alertElement.remove();
                }
            }, 400);
        }
    }, 5000);
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
    showCustomAlert('👋 Logging Out', 'Thank you for using Task Manager. See you soon!', 'info');
    
    setTimeout(() => {
        localStorage.removeItem('currentUser');
        window.location.href = 'auth/login.html';
    }, 1500);
}

function testFormValidation() {
    console.log('=== MANUAL FORM TEST ===');
    
    const titleField = document.getElementById('taskTitle');
    const priorityField = document.getElementById('taskPriority');
    
    console.log('Title field:', {
        element: titleField,
        value: titleField?.value,
        required: titleField?.required,
        validity: titleField?.checkValidity()
    });
    
    console.log('Priority field:', {
        element: priorityField,
        value: priorityField?.value,
        required: priorityField?.required,
        validity: priorityField?.checkValidity(),
        selectedIndex: priorityField?.selectedIndex,
        selectedOption: priorityField?.options[priorityField?.selectedIndex]?.text
    });
    
    const form = document.getElementById('newTaskForm');
    console.log('Form validity:', form?.checkValidity());
    
    return validateForm();
}

window.testFormValidation = testFormValidation;
