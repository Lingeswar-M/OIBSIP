// Task class to create task objects
class Task {
    constructor(id, text) {
        this.id = id;
        this.text = text;
        this.completed = false;
        this.createdAt = new Date();
        this.completedAt = null;
    }
}

// UI class to handle UI operations
class UI {
    constructor() {
        this.taskInput = document.getElementById('taskInput');
        this.taskForm = document.getElementById('taskForm');
        this.tasksList = document.getElementById('tasksList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';

        // Initialize event listeners
        this.initEventListeners();
        this.displayCurrentDate();
        
        // Load tasks from localStorage
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.renderTasks();
    }

    initEventListeners() {
        this.taskForm.addEventListener('submit', (e) => this.handleSubmit(e));
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.handleFilter(btn));
        });
    }

    displayCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('en-US', options);
    }

    handleSubmit(e) {
        e.preventDefault();
        const text = this.taskInput.value.trim();
        if (text) {
            const task = new Task(Date.now().toString(), text);
            this.tasks.unshift(task);
            this.saveToLocalStorage();
            this.renderTasks();
            this.taskInput.value = '';
        }
    }

    handleFilter(btn) {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.renderTasks();
    }

    toggleComplete(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date() : null;
            this.saveToLocalStorage();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveToLocalStorage();
        this.renderTasks();
    }

    editTask(id, newText) {
        const task = this.tasks.find(t => t.id === id);
        if (task && newText.trim()) {
            task.text = newText.trim();
            this.saveToLocalStorage();
            this.renderTasks();
        }
    }

    formatDate(date) {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    renderTasks() {
        const filteredTasks = this.tasks.filter(task => {
            if (this.currentFilter === 'pending') return !task.completed;
            if (this.currentFilter === 'completed') return task.completed;
            return true;
        });

        this.tasksList.innerHTML = filteredTasks.map(task => `
            <div class="task ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-content">
                    <div class="task-text">${task.text}</div>
                    <div class="task-date">
                        Created: ${this.formatDate(task.createdAt)}
                        ${task.completedAt ? `<br>Completed: ${this.formatDate(task.completedAt)}` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn-complete" onclick="ui.toggleComplete('${task.id}')">
                        ${task.completed ? '↺' : '✓'}
                    </button>
                    <button class="btn-edit" onclick="ui.startEdit('${task.id}')">✎</button>
                    <button class="btn-delete" onclick="ui.deleteTask('${task.id}')">×</button>
                </div>
            </div>
        `).join('');
    }

    startEdit(id) {
        const taskElement = document.querySelector(`[data-id="${id}"]`);
        const task = this.tasks.find(t => t.id === id);
        if (taskElement && task) {
            const textElement = taskElement.querySelector('.task-text');
            const currentText = task.text;
            textElement.innerHTML = `
                <input type="text" class="edit-input" value="${currentText}">
            `;
            const input = textElement.querySelector('input');
            input.focus();
            input.select();

            const handleEdit = (e) => {
                if (e.key === 'Enter' || e.type === 'blur') {
                    this.editTask(id, input.value);
                    input.removeEventListener('keyup', handleEdit);
                    input.removeEventListener('blur', handleEdit);
                } else if (e.key === 'Escape') {
                    this.renderTasks();
                }
            };

            input.addEventListener('keyup', handleEdit);
            input.addEventListener('blur', handleEdit);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Initialize UI
const ui = new UI();