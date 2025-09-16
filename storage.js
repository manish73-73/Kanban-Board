// Loads tasks from localStorage or returns an empty array if none exist.
export function loadTasks() {
    const tasksJson = localStorage.getItem('kanban-tasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
}

// Saves tasks to localStorage.
export function saveTasks(tasks) {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
}