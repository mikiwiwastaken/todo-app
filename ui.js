export function render(todos, list, status, editingId) {
  const filteredTodos = todos.filter((todo) => {
    const isCompleted = todo.completed;
    return (
      status === "all" ||
      (status === "active" && !isCompleted) ||
      (status === "completed" && isCompleted)
    );
  });

  list.replaceChildren();

  filteredTodos.forEach((todo) => {
    const item = document.createElement("li");
    item.dataset.id = todo.id;
    if (todo.completed) item.classList.add("completed");

    const checkbox = document.createElement("button");
    checkbox.classList.add("checkbox");
    checkbox.innerHTML = todo.completed
      ? '<i class="fa-regular fa-square-check"></i>'
      : '<i class="fa-regular fa-square"></i>';

    let label;
    if (todo.id === editingId) {
      label = document.createElement("input");
      label.classList.add("edit-input");
      label.value = todo.title;
    } else {
      label = document.createElement("p");
      label.classList.add("todo-text");
      label.textContent = todo.title;
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    item.append(checkbox, label, deleteBtn);
    list.appendChild(item);

    if (todo.id === editingId) {
      label.focus();
      label.select();
    }
  });
}

export function updateTasksDone(todos, tasksDone) {
  tasksDone.textContent = todos.filter((todo) => todo.completed).length;
}
