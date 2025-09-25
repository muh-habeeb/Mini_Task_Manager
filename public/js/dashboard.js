let tasks = [];
let editingTaskId = null;
// let API_BASE = '/api';
// Initialize dashboard
function initDashboard() {
    if (!checkAuth()) return;

    setupEventListeners();
    displayUserInfo();
    loadTasks();
    loadAnalytics();
}

// Setup event listeners
function setupEventListeners() {
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Add task button
    document.getElementById('add-task-btn').addEventListener('click', () => {
        showTaskModal();
    });

    // Task form
    document.getElementById('task-form').addEventListener('submit', handleTaskSubmit);

    // Cancel task
    document.getElementById('cancel-task').addEventListener('click', closeTaskModal);

    // Close modal
    document.querySelector('.close').addEventListener('click', closeTaskModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('task-modal');
        if (e.target === modal) {
            closeTaskModal();
        }
    });

    // Apply filters
    document.getElementById('apply-filters').addEventListener('click', loadTasks);
    document.getElementById('reset-filters').addEventListener('click', () => {
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-priority').value = '';
        document.getElementById('sort-by').value = 'created_at';
        document.getElementById('sort-order').value = 'desc';
        loadTasks();
    }
    );

    // Analytics period change
    document.getElementById('analytics-period').addEventListener('change', loadAnalytics);
}

// Display user info
function displayUserInfo() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('user-welcome').textContent = `Welcome, ${user.username}!`;
    }
}

// Load tasks
async function loadTasks() {
    try {
        const status = document.getElementById('filter-status').value;
        const priority = document.getElementById('filter-priority').value;
        const sort = document.getElementById('sort-by').value;
        const order = document.getElementById('sort-order').value;

        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (priority) params.append('priority', priority);
        params.append('sort', sort);
        params.append('order', order);

        const response = await fetch(`${API_BASE}/tasks?${params}`, {
            headers: getAuthHeaders()
        });
        if (response.ok) {
            tasks = await response.json();
            renderTasks();
        } else {
            showAlert('Failed to load tasks');
        }
    } catch (error) {
        showAlert('Network error while loading tasks');
    }
}

// Render tasks
function renderTasks() {
    const container = document.getElementById('tasks-container');

    if (tasks.length === 0) {
        container.innerHTML = '<p>No tasks found. Create your first task!</p>';
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-item ${task.status === 'Completed' ? 'status-completed' : ''}">
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <span class="task-priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
            </div>
            <div class="task-meta">
                <span>Due: ${task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                <span>Status: ${task.status}</span>
                <span>Created: ${new Date(task.created_at).toLocaleDateString()}</span>
            </div>
            ${task.description ? `<p style="margin: 0.5rem 0; color: #666;">${task.description}</p>` : ''}
            <div class="task-actions">
                <button class="btn btn-warning" onclick="editTask(${task.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Show task modal
function showTaskModal() {
    editingTaskId = null;
    document.getElementById('modal-title').textContent = 'Add New Task';
    document.getElementById('task-form').reset();
    document.getElementById('task-modal').style.display = 'block';
    document.getElementById('status-group').style.display = 'none';
}

// Close task modal
function closeTaskModal() {
    document.getElementById('task-modal').style.display = 'none';
}

// Handle task submit
async function handleTaskSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const taskData = {
        title: formData.get('title'),
        description: formData.get('description'),
        due_date: formData.get('due_date'),
        priority: formData.get('priority'),
        status: formData.get('status') || 'Pending'
    };

    try {
        const response = editingTaskId
            ? await fetch(`${API_BASE}/tasks/${editingTaskId}`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            })
            : await fetch(`${API_BASE}/tasks`, {
                method: 'POST',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(taskData)
            });
        console.log(response);
        if (response.ok) {
            closeTaskModal();
            loadTasks();
        } else {
            showAlert('Failed to save task');
        }
    } catch (error) {
        showAlert('Network error while saving task');
    }
}

// Edit task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    console.log(task)
    if (task) {
        editingTaskId = id;
        document.getElementById('modal-title').textContent = 'Edit Task';
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description;
        document.getElementById('task-due-date').value = new Date(task.due_date)
            .toISOString()
            .split('T')[0];
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-status').style.display = 'block';
        document.getElementById('task-modal').style.display = 'block';
        document.getElementById('status-group').style.display = 'block';
    }
}

// Delete task
async function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            const response = await fetch(`${API_BASE}/tasks/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                loadTasks();
            } else {
                showAlert('Failed to delete task');
            }
        } catch (error) {
            showAlert('Network error while deleting task');
        }
    }
}