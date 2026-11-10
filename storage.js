export function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

export function loadTodos() {
  const todos = JSON.parse(localStorage.getItem("todos"));
  return Array.isArray(todos) ? todos : null;
}
