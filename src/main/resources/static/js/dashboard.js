document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    initializeTaskForm();
    initializeHistory();
    updateTaskCounts();
});

function initializeDashboard() {
    // Sidebar toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Animate summary cards
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

function initializeTaskForm() {
    const addTaskBtn = document.querySelector('.add-task-btn');
    const taskFormModal = document.querySelector('.task-form-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const taskForm = document.getElementById('newTaskForm');

    if (addTaskBtn && taskFormModal) {
        addTaskBtn.addEventListener('click', () => {
            taskFormModal.classList.add('active');
        });
    }

    if (closeModalBtns) {
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                taskFormModal.classList.remove('active');
            });
        });
    }

    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newTask = {
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('taskDescription').value,
                category: document.getElementById('taskCategory').value,
                priority: document.getElementById('taskPriority').value,
                status: document.getElementById('taskStatus').value || 'NOT_STARTED',
                deadline: document.getElementById('taskDeadline').value,
                reminder: {
                    time: document.getElementById('taskReminder').value,
                    frequency: document.getElementById('reminderFrequency').value
                }
            };

            createNewTask(newTask);
            taskForm.reset();
            taskFormModal.classList.remove('active');
        });
    }
}

function initializeHistory() {
    // History toggle functionality
    const historyHeader = document.getElementById('toggleHistory');
    const historyContent = document.getElementById('historyContent');
    const toggleBtn = document.querySelector('.toggle-history-btn');

    if (historyHeader && historyContent && toggleBtn) {
        historyHeader.addEventListener('click', () => {
            historyContent.classList.toggle('active');
            toggleBtn.classList.toggle('active');
        });
    }

    // Setup task checkbox handlers for moving to history
    const taskCheckboxes = document.querySelectorAll('.task-item:not(.completed) input[type="checkbox"]');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                const taskItem = this.closest('.task-item');
                moveTaskToHistory(taskItem);
            }
        });
    });
}

function createNewTask(taskData) {
    const tasksList = document.querySelector('.tasks-list');
    if (!tasksList) return;

    const taskId = Date.now();
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    
    const reminderText = taskData.reminder.time 
        ? `Remind at ${formatTime(taskData.reminder.time)} (${taskData.reminder.frequency})`
        : 'No reminder';
    
    taskElement.innerHTML = `
        <div class="task-checkbox">
            <input type="checkbox" id="task${taskId}">
            <label for="task${taskId}"></label>
        </div>
        <div class="task-details">
            <h3 class="task-title">${taskData.title}</h3>
            <p class="task-desc">${taskData.description}</p>
            <div class="task-meta">
                <span class="task-category">
                    <i class="fas fa-folder"></i> ${taskData.category}
                </span>
                <span class="status-badge status-${taskData.status.toLowerCase()}">
                    <i class="fas fa-spinner"></i> ${taskData.status.replace(/_/g, ' ')}
                </span>
                <span class="task-deadline">
                    <i class="fas fa-calendar"></i> ${formatDate(taskData.deadline)}
                </span>
                <span class="task-reminder">
                    <i class="fas fa-bell"></i> ${reminderText}
                </span>
            </div>
        </div>
        <div class="task-priority priority-${taskData.priority.toLowerCase()}">
            ${taskData.priority.replace(/_/g, ' ')}
        </div>
        <div class="task-actions">
            <button class="edit-btn"><i class="fas fa-edit"></i></button>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        </div>
    `;

    // Add checkbox event listener for history
    const checkbox = taskElement.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            moveTaskToHistory(taskElement);
        }
    });

    tasksList.prepend(taskElement);
    updateTaskCounts();
}

function moveTaskToHistory(taskItem) {
    // Create a copy of the task for history
    const historyItem = taskItem.cloneNode(true);
    historyItem.classList.add('completed');
    
    // Update the task status to completed
    const statusBadge = historyItem.querySelector('.status-badge');
    statusBadge.className = 'status-badge status-completed';
    statusBadge.innerHTML = '<i class="fas fa-check"></i> COMPLETED';

    // Add completion date
    const taskMeta = historyItem.querySelector('.task-meta');
    const completionDate = document.createElement('span');
    completionDate.className = 'completion-date';
    completionDate.innerHTML = `<i class="fas fa-flag-checkered"></i> Completed on ${formatDate(new Date())}`;
    taskMeta.appendChild(completionDate);

    // Disable the checkbox
    const checkbox = historyItem.querySelector('input[type="checkbox"]');
    checkbox.disabled = true;

    // Remove action buttons
    const actionsDiv = historyItem.querySelector('.task-actions');
    if (actionsDiv) {
        actionsDiv.remove();
    }

    // Add to history and show history section
    const historyContent = document.getElementById('historyContent');
    if (historyContent) {
        historyContent.insertBefore(historyItem, historyContent.firstChild);
        historyContent.classList.add('active');
        const toggleBtn = document.querySelector('.toggle-history-btn');
        if (toggleBtn) {
            toggleBtn.classList.add('active');
        }
    }

    // Remove original task and update counts
    taskItem.remove();
    updateTaskCounts();
}

function updateTaskCounts() {
    const totalTasks = document.querySelectorAll('.task-item').length;
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    const pendingTasks = totalTasks - completedTasks;

    const summaryCards = document.querySelectorAll('.summary-cards .card-info p');
    if (summaryCards.length >= 3) {
        summaryCards[0].textContent = totalTasks;
        summaryCards[1].textContent = completedTasks;
        summaryCards[2].textContent = pendingTasks;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
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
