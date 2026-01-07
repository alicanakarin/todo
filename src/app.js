const form = document.querySelector("#addTodoForm");
const addInput = document.querySelector("#todoName");
const todoList = document.querySelector("#todoList");
const alertContainer = document.querySelector("#alertContainer");
const completedTodoList = document.querySelector("#completedTodoList");
const todoCount = document.querySelector("#todoCount");
const completedCount = document.querySelector("#completedCount");

let todos = [];
let completedTodos = [];

runEvents();

function runEvents() {
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadTodosFromStorage);
  todoList.addEventListener("click", handleTodoClick);
  completedTodoList.addEventListener("click", handleCompletedClick);
}

function addTodo(e) {
  e.preventDefault();
  const inputText = addInput.value.trim();

  if (inputText == null || inputText == "") {
    showAlert("amber-200", "Please enter a todo item.");
  } else {
    // arayüze ekleme
    showAlert("green-300", "Todo item added successfully.");
    addTodoToUI(inputText);
    addTodoToStorage(inputText);
    addInput.value = ""; // Inputu temizle
  }
}

function loadTodosFromStorage() {
  checkTodosFromStorage();
  todos.forEach((todo) => {
    addTodoToUI(todo);
  });

  checkCompletedTodosFromStorage();
  completedTodos.forEach((todo) => {
    addCompletedTodoToUI(todo);
  });
}

function addTodoToUI(newTodo) {
  const li = document.createElement("li");
  li.className = "flex items-center justify-between bg-[#15101C] p-5 rounded-2xl";

  // HTML yapısını şablon olarak içine yerleştiriyoruz
  li.innerHTML = `
    <span class="text-sm text-[#9E78CF]">${newTodo}</span>
    <div class="flex gap-3 items-center">
      <button class="check-btn text-[#9E78CF] hover:text-green-300 cursor-pointer transition-colors delay-100">
        <i class="fa-solid fa-check text-sm"></i>
      </button>
      <button class="delete-btn text-[#9E78CF] hover:text-red-400 cursor-pointer transition-colors delay-100">
        <i class="fa-solid fa-trash text-sm transition-colors delay-100"></i>
      </button>
    </div>
  `;

  // Listeye ekle
  todoList.appendChild(li);
  updateTodoCount();
}

function addCompletedTodoToUI(todoText) {
  const li = document.createElement("li");
  li.className = "flex items-center justify-between bg-[#15101C] p-5 rounded-2xl";

  li.innerHTML = `
    <span class="text-sm text-green-300 line-through">${todoText}</span>
    <button class="text-green-300 hover:text-[#9E78CF] cursor-pointer transition-colors delay-100">
      <i class="fa-solid fa-angle-up"></i>
    </button>
  `;

  completedTodoList.appendChild(li);
  updateCompletedCount();
}

function handleTodoClick(e) {
  const li = e.target.closest("li");
  if (!li) return;

  const todoText = li.querySelector("span").textContent;

  // Check butonu tıklandı
  if (e.target.classList.contains("fa-check")) {
    li.remove();
    removeTodoFromStorage(todoText);
    addCompletedTodoToUI(todoText);
    addCompletedTodoToStorage(todoText);
    updateTodoCount();
    showAlert("blue-300", "Todo completed!");
  }

  // Delete butonu tıklandı
  if (e.target.classList.contains("fa-trash")) {
    li.remove();
    removeTodoFromStorage(todoText);
    updateTodoCount();
    showAlert("red-400", "Todo deleted.");
  }
}

function handleCompletedClick(e) {
  const li = e.target.closest("li");
  if (!li) return;

  const todoText = li.querySelector("span").textContent;

  // Uncomplete butonu tıklandı
  if (e.target.classList.contains("fa-angle-up")) {
    li.remove();
    removeCompletedTodoFromStorage(todoText);
    addTodoToUI(todoText);
    addTodoToStorage(todoText);
    updateCompletedCount();
    showAlert("pink-400", "Todo moved back to list.");
  }
}

function removeTodoFromUI(e) {
  // Check butonu veya delete butonu tıklandı mı kontrol et
  if (e.target.classList.contains("fa-trash")) {
    // <i> tag'ine tıklandıysa, parent <button> ve sonra parent <li>'yi bul
    const li = e.target.parentElement.parentElement.parentElement;
    const todoText = li.querySelector("span").textContent;

    // UI'dan sil
    li.remove();

    // Storage'dan sil
    removeTodoFromStorage(todoText);
  }
}

function addTodoToStorage(newTodo) {
  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function removeTodoFromStorage(todoText) {
  checkTodosFromStorage();
  todos = todos.filter((todo) => todo !== todoText);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addCompletedTodoToStorage(todoText) {
  completedTodos.push(todoText);
  localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
}

function removeCompletedTodoFromStorage(todoText) {
  checkCompletedTodosFromStorage();
  completedTodos = completedTodos.filter((todo) => todo !== todoText);
  localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
}

function checkTodosFromStorage() {
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
}

function checkCompletedTodosFromStorage() {
  if (localStorage.getItem("completedTodos") === null) {
    completedTodos = [];
  } else {
    completedTodos = JSON.parse(localStorage.getItem("completedTodos"));
  }
}

function showAlert(color, message) {
  const div = document.createElement("div");
  div.className = `w-80 flex justify-center min-h-12 border border-${color} text-sm rounded-xl px-4 py-3 text-${color} text-center bg-[#0D0714] alert-enter pointer-events-auto`;
  div.textContent = message;
  alertContainer.appendChild(div);

  setTimeout(() => {
    div.classList.remove("alert-enter");
    div.classList.add("alert-exit");

    setTimeout(() => {
      div.remove();
    }, 200); // Animasyon süresi kadar bekle
  }, 2000); // 2 saniye sonra çıkış animasyonu başlat
}

function updateTodoCount() {
  todoCount.textContent = todoList.children.length;
}

function updateCompletedCount() {
  completedCount.textContent = completedTodoList.children.length;
}
