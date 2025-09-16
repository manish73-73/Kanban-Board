import { createElement } from './utils.js';
import { loadTasks, saveTasks } from './storage.js';

class Kanban {
    constructor() {
        this.tasks = loadTasks();
        this.form = document.getElementById('task-form');
        this.columns = document.querySelectorAll('.column');
        this.init();
    }

    init() {
        this.renderTasks();
        this.initEvents();
        this.initDragDrop();
    }

    renderTasks() {
        const lists = {
            todo: document.querySelector('#todo .task-list'),
            inprogress: document.querySelector('#inprogress .task-list'),
            done: document.querySelector('#done .task-list')
        };

        this.tasks.forEach(task => {
            const card = this.createTaskCard(task);
            lists[task.status].appendChild(card);
            // Trigger reflow to restart animation on load
            card.offsetWidth;
            card.style.animation = 'fadeIn 0.5s ease forwards';
        });
    }

    createTaskCard(task) {
        const card = createElement('div', 'task-card');
        card.draggable = true;
        card.dataset.id = task.id;

        const title = createElement('h3', null, task.title);
        const desc = createElement('p', null, task.description);

        card.appendChild(title);
        card.appendChild(desc);

        card.addEventListener('dragstart', (e) => {
            card.classList.add('dragging');
            e.dataTransfer.setData('text/plain', task.id.toString());
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });

        return card;
    }

    initEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('task-title').value.trim();
            const desc = document.getElementById('task-desc').value.trim();

            if (!title) return;

            const id = Date.now();
            const task = { id, title, description: desc, status: 'todo' };

            this.tasks.push(task);

            const card = this.createTaskCard(task);
            const todoList = document.querySelector('#todo .task-list');
            todoList.appendChild(card);

            // Trigger animation
            card.offsetWidth;
            card.style.animation = 'fadeIn 0.5s ease forwards';

            this.save();
            this.form.reset();
        });
    }

    initDragDrop() {
        this.columns.forEach(column => {
            column.addEventListener('dragover', (e) => e.preventDefault());
            column.addEventListener('dragenter', (e) => {
                e.preventDefault();
                column.classList.add('over');
            });
            column.addEventListener('dragleave', () => column.classList.remove('over'));
            column.addEventListener('drop', (e) => {
                column.classList.remove('over');

                const id = Number(e.dataTransfer.getData('text/plain'));
                const card = document.querySelector(`.task-card[data-id="${id}"]`);

                if (card) {
                    const targetList = column.querySelector('.task-list');
                    targetList.appendChild(card);

                    // Add drop animation
                    card.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                    card.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                    }, 300);

                    const task = this.tasks.find(t => t.id === id);
                    if (task) {
                        task.status = column.dataset.status;
                        this.save();
                    }
                }
            });
        });
    }

    save() {
        saveTasks(this.tasks);
    }
}

new Kanban();