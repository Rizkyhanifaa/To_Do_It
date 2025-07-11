const todoInput = document.getElementById("todo-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-btn");
const deleteAllBtn = document.getElementById("delete-all-btn");
const filterBtn = document.getElementById("filter-btn");
const filterMenu = document.getElementById("filter-menu");
const todoList = document.getElementById("todo-list");

let todos = [];
let editId = null; 

// Show alert message
function showAlert(message, type = "success") {
    const alertDiv = document.createElement("div");
    alertDiv.className = `bg-green-500 text-white text-center py-3 rounded-lg mb-4`;
    alertDiv.textContent = message;

    const heading = document.querySelector("h1");
    heading.insertAdjacentElement("afterend", alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 2000);
}

// Add or Update To-Do
addBtn.addEventListener("click", () => {
    const task = todoInput.value.trim();
    const dueDate = dateInput.value;

    if (!task || !dueDate) {
        alert("Please fill in both task and due date!");
        return;
    }

    if (editId) {
        // ✅ Update task
        const todo = todos.find(t => t.id === editId);
        todo.task = task;
        todo.dueDate = dueDate;
        showAlert("Todo updated successfully", "success");
        editId = null; // Reset edit mode
        addBtn.innerHTML = "+"; // Ganti icon tombol kembali ke '+'
    } else {
        // ➕ Add new task
        todos.push({
            id: Date.now(),
            task,
            dueDate,
            completed: false
        });
        showAlert("Task added successfully", "success");
    }

    renderTodos();
    todoInput.value = "";
    dateInput.value = "";
});

// Delete All
deleteAllBtn.addEventListener("click", () => {
    todos = [];
    renderTodos();
    showAlert("All tasks deleted", "success");
});

// Toggle FIlter dropdown
filterBtn.addEventListener("click", () => {
    filterMenu.classList.toggle("hidden");
});

// Filter todos
function filterTodos(type) {
    let filtered = [];

    if (type === "all") {
        filtered = todos;
    } else if (type === "pending") {
        filtered = todos.filter(todo => !todo.completed);
    } else if (type === "completed") {
        filtered = todos.filter(todo => todo.completed);
    }

    renderTodos(filtered);
    filterMenu.classList.add("hidden"); 
}

// Delete single task
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
    showAlert("Task deleted", "success");
}

// Toggle complete
function toggleComplete(id) {
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    renderTodos();
    showAlert("Task updated", "success");
}

// Edit task (populate inputs, change button icon)
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    todoInput.value = todo.task;
    dateInput.value = todo.dueDate;
    todoInput.focus();
    editId = id; 
    addBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-black mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
    `;
    }

// Render To-Do list
function renderTodos(list = todos) {
    if (list.length === 0) {
        todoList.innerHTML = `<tr><td colspan="4" class="py-4">No task found</td></tr>`;
        return;
    }

    todoList.innerHTML = "";
    list.forEach(todo => {
        const tr = document.createElement("tr");
        tr.className = "border-b hover:bg-gray-50";

        tr.innerHTML = `
            <td class="py-2">${todo.task}</td>
            <td class="py-2">${todo.dueDate}</td>
            <td class="py-2">${todo.completed ? "Completed" : "Pending"}</td>
            <td class="py-2 flex justify-center gap-2">
                <!-- Edit Button -->
                <button onclick="editTodo(${todo.id})" class="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-black justify-item-center" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                </button>

                <!-- Complete Button -->
                <button onclick="toggleComplete(${todo.id})" class="bg-green-400 hover:bg-green-500 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                </button>

                <!-- Delete Button -->
                <button onclick="deleteTodo(${todo.id})" class="bg-red-400 hover:bg-red-500 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
            </td>
        `;
        todoList.appendChild(tr);
    });
}
