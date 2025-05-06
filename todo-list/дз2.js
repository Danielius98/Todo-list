function saveTodos() {
    const todoList = document.getElementById('todoList');
    const items = Array.from(todoList.getElementsByClassName('todo-item'));
    const todos = items.map(item => ({
        text: item.querySelector('.first-child span').textContent,
        completed: item.classList.contains('completed'),
        date: item.querySelector('.date').textContent.replace('от ', '')
    }));
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    const todoList = document.getElementById('todoList');
    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.className = 'todo-item' + (todo.completed ? ' completed' : '');
        listItem.innerHTML = `
            <div class="first-child">
                <span>${todo.text}</span>
                <br><span class="date">от ${todo.date}</span>
            </div>
            <div class="button-nav">
                <button class="complete" onclick="toggleComplete(this)">✔</button>
                <button class="delete" onclick="deleteTodo(this)">✖</button>
            </div>
        `;
        todoList.appendChild(listItem);
    });
    filterTodos();
    sortTodos();
}

function addTodo() {
    const todoInput = document.getElementById('newTodo');
    const todoList = document.getElementById('todoList');

    if (todoInput.value.trim() === '') return;

    const listItem = document.createElement('li');
    listItem.className = 'todo-item';

    const currentDate = new Date().toLocaleDateString();

    listItem.innerHTML = `
                <div class="first-child">
                    <span>${todoInput.value}</span>
                    <br><span class="date">от ${currentDate}</span>
                </div>
                <div class="button-nav">
                    <button class="complete" onclick="toggleComplete(this)">✔</button>
                    <button class="delete" onclick="deleteTodo(this)">✖</button>
                </div>
            `;

    todoList.appendChild(listItem);
    todoInput.value = '';
    sortTodos();
    saveTodos();
}

function toggleComplete(button) {
    const item = button.closest('.todo-item');
    item.classList.toggle('completed');
    filterTodos();
    sortTodos();
    saveTodos();
}

function deleteTodo(button) {
    const item = button.closest('.todo-item');
    item.remove();
    sortTodos();
    saveTodos();
}

function clearTodos() {
    document.getElementById('todoList').innerHTML = '';
    localStorage.removeItem('todos');
}

let currentFilter = 'all';

function filterTodos() {
    const todoList = document.getElementById('todoList');
    const items = todoList.getElementsByClassName('todo-item');

    for (let item of items) {
        switch (currentFilter) {
            case 'completed':
                item.style.display = item.classList.contains('completed') ? '' : 'none';
                break;
            case 'not-completed':
                item.style.display = !item.classList.contains('completed') ? '' : 'none';
                break;
            case 'all':
            default:
                item.style.display = '';
                break;
        }
    }
}

function showCompleted() {
    currentFilter = 'completed';
    filterTodos();
    sortTodos();
}

function showNotCompleted() {
    currentFilter = 'not-completed';
    filterTodos();
    sortTodos();
}

function showAll() {
    currentFilter = 'all';
    filterTodos();
    sortTodos();
}

function sortTodos() {
    const todoList = document.getElementById('todoList');
    const selectedOption = document.querySelector('.selected-option');
    const sortValue = selectedOption.getAttribute('data-value');

    // Получаем все элементы списка
    const items = Array.from(todoList.getElementsByClassName('todo-item'));

    // Фильтруем только видимые элементы с учётом текущего фильтра
    const visibleItems = items.filter(item => item.style.display !== 'none');

    // Сортируем видимые элементы
    visibleItems.sort((a, b) => {
        const textA = a.querySelector('.first-child span').textContent.toLowerCase();
        const textB = b.querySelector('.first-child span').textContent.toLowerCase();

        if (sortValue === 'alphabet') {
            return textA.localeCompare(textB, 'ru'); // Сортировка А-Я
        } else if (sortValue === 'alphabet-reverse') {
            return textB.localeCompare(textA, 'ru'); // Сортировка Я-А
        }
        return 0; // По умолчанию без сортировки
    });

    // Сохраняем порядок всех элементов (включая скрытые)
    const allItemsSorted = [];
    let visibleIndex = 0;

    items.forEach(item => {
        if (item.style.display !== 'none') {
            allItemsSorted.push(visibleItems[visibleIndex]);
            visibleIndex++;
        } else {
            allItemsSorted.push(item);
        }
    });

    // Перестраиваем список
    allItemsSorted.forEach(item => todoList.appendChild(item));
}

document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    const customSelect = document.querySelector('.custom-select');
    const selectedOption = customSelect.querySelector('.selected-option');
    const options = customSelect.querySelector('.options');


    options.style.display = 'none';


    selectedOption.addEventListener('click', () => {
        options.style.display = options.style.display === 'block' ? 'none' : 'block';
    });


    options.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            selectedOption.textContent = option.textContent;
            selectedOption.setAttribute('data-value', option.getAttribute('data-value'));
            options.style.display = 'none';
            sortTodos();
        });
    });


    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            options.style.display = 'none';
        }
    });
});