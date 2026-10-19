const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = JSON.parse(localStorage.getItem("taskflow-tasks") || "[]");

function saveTasks() {
  localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task complete");

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", "Delete " + task.text);

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(checkbox, text, deleteButton);
    taskList.appendChild(li);
  });

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const remaining = total - completed;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("totalCount").textContent = total;
  document.getElementById("completedCount").textContent = completed;
  document.getElementById("remainingCount").textContent = remaining;
  document.getElementById("completionRate").textContent = rate;
  document.getElementById("taskBadge").textContent = total;
  document.getElementById("taskLabel").textContent =
    total + (total === 1 ? " task" : " tasks");

  document.getElementById("sidebarCount").textContent = total;
  document.getElementById("ringPercent").textContent = rate + "%";
  document.getElementById("legendDone").textContent = completed;
  document.getElementById("legendTodo").textContent = remaining;

  emptyMessage.style.display = total === 0 ? "block" : "none";
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: Date.now(),
    text: text,
    completed: false
  });

  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
});

renderTasks();