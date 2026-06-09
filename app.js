const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

let editingId = null;

// Load tasks from localStorage or initialize an empty array
let tasks =
JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

function updateStats() {

    totalTasks.textContent = tasks.length;

    completedTasks.textContent =
    tasks.filter(task => task.completed).length;
}

// Render tasks based on the search query
function renderTasks(search = "") {

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task =>
        task.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if(filteredTasks.length === 0){

        taskList.innerHTML = `
            <div class="text-center text-slate-500">
                No tasks found
            </div>
        `;

        return;
    }

    filteredTasks.forEach(task => {

        // Create task element
        const div =
        document.createElement("div");

        div.className =
        "bg-white p-4 rounded-xl shadow-sm flex items-center justify-between";

        // Set task content
        div.innerHTML = `
            <div class="flex items-center gap-3">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                    onchange="toggleTask(${task.id})"
                >

                <span class="${
                    task.completed
                    ? "line-through text-slate-400"
                    : ""
                }">

                    ${task.title}

                </span>

            </div>

            
            <div class="flex gap-4">

                <button
                    onclick="editTask(${task.id})"
                    class="text-blue-500">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    onclick="deleteTask(${task.id})"
                    class="text-red-500">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>
        `;

        taskList.appendChild(div);

    });

    updateStats();
}

// Add or update a task
function addTask() {

    const title =
    taskInput.value.trim();

    if(title === "") {
        alert("Please enter a task title");
        return;
    }

    if(editingId){

        const task =
        tasks.find(
            t => t.id === editingId
        );

        task.title = title;

        editingId = null;

        addBtn.innerHTML =
        `<i class="fa-solid fa-plus"></i>`;

    } else {

        tasks.push({
            id: Date.now(),
            title,
            completed: false
        });

    }

    saveTasks();

    renderTasks(
        searchInput.value
    );

    taskInput.value = "";
}

// Delete a task by id
function deleteTask(id){

    tasks =
    tasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks(
        searchInput.value
    );
}

// Toggle task completion status by id
function toggleTask(id){

    tasks = tasks.map(task => {

        if(task.id === id){
            task.completed =
            !task.completed;
        }

        return task;
    });

    saveTasks();

    renderTasks(
        searchInput.value
    );
}

// Edit a task by id
function editTask(id){

    const task =
    tasks.find(
        task => task.id === id
    );

    taskInput.value =
    task.title;

    taskInput.focus();

    editingId = id;

    addBtn.innerHTML =
    `<i class="fa-solid fa-check"></i>`;
}

// Event listeners
addBtn.addEventListener(
    "click",
    addTask
);

// Allow adding task with Enter key
taskInput.addEventListener(
    "keypress",
    (e) => {

        if(e.key === "Enter"){
            addTask();
        }
    }
);

// Search tasks on input
searchInput.addEventListener(
    "input",
    () => {

        renderTasks(
            searchInput.value
        );
    }
);

renderTasks();