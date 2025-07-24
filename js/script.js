
(function () {
    const todoForm = document.getElementById('todoForm');
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const todoList = document.getElementById('todoList');
    const filterBtn = document.getElementById('filterBtn');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const emptyMsg = document.getElementById('emptyMsg');

    let todos = [];
    let filterActive = false;

    function saveToLocal() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function loadFromLocal() {
        const saved = localStorage.getItem('todos');
        if (saved) {
            todos = JSON.parse(saved);
        }
    }

    function renderTodos() {
        todoList.innerHTML = '';
        let visibleTodos = todos;
        if (filterActive) {
            visibleTodos = todos.filter(todo => !todo.completed);
        }
        if (visibleTodos.length === 0) {
            emptyMsg.style.display = 'table-row';
            todoList.appendChild(emptyMsg);
            return;
        } else {
            emptyMsg.style.display = 'none';
        }
        visibleTodos.forEach((todo, index) => {
            const tr = document.createElement('tr');

            const taskTd = document.createElement('td');
            taskTd.textContent = todo.task;
            taskTd.className = todo.completed ? 'line-through text-indigo-500 select-text' : 'select-text';

            const dateTd = document.createElement('td');
            const dt = new Date(todo.dueDate);
            dateTd.textContent = dt.toLocaleDateString();
            dateTd.className = todo.completed ? 'text-indigo-500' : '';

            const statusTd = document.createElement('td');
            statusTd.className = 'relative';
            const statusBtn = document.createElement('button');
            statusBtn.textContent = todo.completed ? 'Completed' : 'Pending';
            statusBtn.className = todo.completed
                ? 'bg-green-600 text-green-100 px-3 py-1 rounded cursor-pointer select-none hover:bg-green-700 transition'
                : 'bg-yellow-600 text-yellow-100 px-3 py-1 rounded cursor-pointer select-none hover:bg-yellow-700 transition';
            statusBtn.setAttribute('aria-label', `Mark todo '${todo.task}' as ${todo.completed ? 'pending' : 'completed'}`);
            statusBtn.addEventListener('click', () => {
                todos[index].completed = !todos[index].completed;
                saveToLocal();
                renderTodos();
            });
            statusTd.appendChild(statusBtn);

            const actionsTd = document.createElement('td');

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'action-btn mr-2 bg-sky-500 hover:bg-blue-700 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 active:bg-violet-700 p-2 rounded  ';
            editBtn.setAttribute('aria-label', `Edit todo: ${todo.task}`);
            editBtn.addEventListener('click', () => {
                taskInput.value = todo.task;
                dateInput.value = todo.dueDate;
                taskInput.focus();
                // Mark this as a temporary edit with index stored in data attribute
                todoForm.dataset.editIndex = index;
                todoForm.querySelector('button[type="submit"]').textContent = '↻';
                todoForm.querySelector('button[type="submit"]').setAttribute('title', 'Update todo');
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'action-btn bg-red-500 hover:bg-red-700 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 active:bg-violet-700 p-2 rounded  ';
            deleteBtn.setAttribute('aria-label', `Delete todo: ${todo.task}`);
            deleteBtn.addEventListener('click', () => {
                todos.splice(index, 1);
                saveToLocal();
                renderTodos();
            });

            actionsTd.appendChild(editBtn);
            actionsTd.appendChild(deleteBtn);

            tr.appendChild(taskTd);
            tr.appendChild(dateTd);
            tr.appendChild(statusTd);
            tr.appendChild(actionsTd);

            todoList.appendChild(tr);
        });
    }

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskVal = taskInput.value.trim();
        const dateVal = dateInput.value;

        if (!taskVal || !dateVal) {
            alert('Please provide both task description and due date.');
            return;
        }

        const editIndex = todoForm.dataset.editIndex;
        if (editIndex !== undefined) {
            todos[editIndex] = {
                ...todos[editIndex],
                task: taskVal,
                dueDate: dateVal
            };
            delete todoForm.dataset.editIndex;
            todoForm.querySelector('button[type="submit"]').textContent = '+';
            todoForm.querySelector('button[type="submit"]').setAttribute('title', 'Add todo');
        } else {
            todos.push({
                task: taskVal,
                dueDate: dateVal,
                completed: false
            });
        }

        saveToLocal();
        renderTodos();
        todoForm.reset();
        taskInput.focus();
    });

    filterBtn.addEventListener('click', () => {
        filterActive = !filterActive;
        filterBtn.textContent = filterActive ? 'Show All' : 'Filter';
        renderTodos();
    });

    deleteAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all tasks?')) {
            todos = [];
            saveToLocal();
            renderTodos();
        }
    });

    // Initial load
    loadFromLocal();
    renderTodos();
})();

