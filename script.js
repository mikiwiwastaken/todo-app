import { render, updateTasksDone } from "./ui.js";
import { saveTodos, loadTodos } from "./storage.js";
import { fetchTodos } from "./todo-api.js";

const list = document.getElementById("todo-list");
const addBtn = document.getElementById("addBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const newItem = document.getElementById("newItem");
const filterSelect = document.getElementById("filterSelect");
const tasksDone = document.querySelector("#taskStatus span");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const closeToast = document.getElementById("closeToast");

let todos = []; // todo = { id, title, completed }
let nextId = 1;
let editingId = null; // id of the todo being edited, or null when none

list.addEventListener("mousedown", (event) => {
  if (event.target.closest(".deleteBtn, .checkbox")) {
    event.preventDefault();
  }
});

list.addEventListener("click", (event) => {
  const item = event.target.closest("li");
  if (!item) return;
  const id = Number(item.dataset.id);

  const isDelete = event.target.closest(".deleteBtn");
  const isCheckbox = event.target.closest(".checkbox");
  if (!isDelete && !isCheckbox) return;

  commitPendingEdit();

  if (isDelete) {
    todos = todos.filter((todo) => todo.id !== id);
  } else {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );
  }
  update();
});

list.addEventListener("dblclick", (event) => {
  const item = event.target.closest("li");
  if (!item) return;

  if (event.target.closest(".todo-text")) {
    editingId = Number(item.dataset.id);
    update();
  }
});

list.addEventListener("keydown", (event) => {
  const input = event.target.closest(".edit-input");
  if (input) {
    if (event.key === "Escape") {
      editingId = null;
      update();
    } else if (event.key === "Enter") {
      commitEdit(Number(input.closest("li").dataset.id), input.value);
      update();
    }
  }
});

list.addEventListener("focusout", (event) => {
  if (editingId === null) return;
  const input = event.target.closest(".edit-input");
  if (input) {
    commitEdit(Number(input.closest("li").dataset.id), input.value);
    update();
  }
});

addBtn.addEventListener("click", () => {
  const title = newItem.value.trim();
  if (title === "") return;
  todos.push({ id: nextId++, title, completed: false });

  update();

  newItem.value = "";
  newItem.focus();
});

clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  update();
});

newItem.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addBtn.click();
});

filterSelect.addEventListener("change", () => {
  render(todos, list, filterSelect.value, editingId);
  updateTasksDone(todos, tasksDone);
});

closeToast.addEventListener("click", () => {
  toast.classList.remove("show");
});

function update() {
  render(todos, list, filterSelect.value, editingId);
  saveTodos(todos);
  updateTasksDone(todos, tasksDone);
}

function commitEdit(id, value) {
  if (value.trim() !== "") {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, title: value.trim() } : todo,
    );
  }
  editingId = null;
}

function commitPendingEdit() {
  if (editingId === null) return;
  const input = list.querySelector(".edit-input");
  if (input) {
    commitEdit(Number(input.closest("li").dataset.id), input.value);
  }
}

async function init() {
  let tempTodos;

  try {
    tempTodos = loadTodos();
  } catch (error) {
    toast.classList.add("show");
    toastMessage.textContent = `Could not read storage: ${error.message}`;
  }

  try {
    if (!tempTodos) {
      const fetched = await fetchTodos();
      tempTodos = fetched.map((todo) => ({
        id: todo.id,
        title: todo.title,
        completed: todo.completed,
      }));
    }

    nextId =
      tempTodos.length > 0 ? Math.max(...tempTodos.map((t) => t.id)) + 1 : 1;
    todos = tempTodos;
    update();
  } catch (error) {
    toast.classList.add("show");
    toastMessage.textContent = `Could not load todos: ${error.message}`;
  }
}

init();
