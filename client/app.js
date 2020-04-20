// Selectors

const home = document.getElementById('home');
const navLoginBtn = document.getElementById('nav-login-btn');
const navRegisterBtn = document.getElementById('nav-register-btn');
const navLogoutBtn = document.getElementById('nav-logout-btn');
const navGreeting = document.getElementById('greeting');

const welcome = document.getElementById('welcome');

const formContainer = document.getElementById('form-container');
const form = document.getElementById('form');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const alertMessage = document.getElementById('alert');

const todosContent = document.getElementById('todos-content');
const activeTodos = document.getElementById('active-todos');
const finishedTodos = document.getElementById('finished-todos');
const allTodos = document.getElementById('all-todos');
const inputTodo = document.getElementById('input-todo');
const submitTodo = document.getElementById('submit-todo');
const todosHook = document.getElementById('todos-hook');

// Global varibles

const url = 'http://127.0.0.1:3000/';
let globalUsername = '';
let globalTodos = [];

// event listeners

home.addEventListener('click', homeRoute);
navLoginBtn.addEventListener('click', loginRoute);
navRegisterBtn.addEventListener('click', registerRoute);
navLogoutBtn.addEventListener('click', homeRoute);
loginBtn.addEventListener('click', loginUser);
registerBtn.addEventListener('click', registerUser);
activeTodos.addEventListener('click', filterActiveTodos);
finishedTodos.addEventListener('click', filterFinishedTodos);
allTodos.addEventListener('click', filterAllTodos);
submitTodo.addEventListener('click', addTodo);
inputTodo.addEventListener('keypress', addTodoAfterEnter);
todosHook.addEventListener('click', updateOrDeleteTodo);

// functions

function homeRoute() {
  routes('home');
}

function loginRoute() {
  routes('login');
}

function registerRoute() {
  routes('register');
}

// Routing function
function routes(str) {
  switch (str) {
    case 'login':
      hideWarning();
      welcome.classList.add('hidden');
      formContainer.classList.remove('hidden');
      registerBtn.classList.add('hidden');
      loginBtn.classList.remove('hidden');
      break;
    case 'register':
      hideWarning();
      welcome.classList.add('hidden');
      formContainer.classList.remove('hidden');
      loginBtn.classList.add('hidden');
      registerBtn.classList.remove('hidden');
      break;
    case 'home':
      hideWarning();
      welcome.classList.remove('hidden');
      formContainer.classList.add('hidden');
      todosContent.classList.add('hidden');
      navLogoutBtn.classList.add('hidden');
      navRegisterBtn.classList.remove('hidden');
      navLoginBtn.classList.remove('hidden');
      navGreeting.classList.add('hidden');
      form.reset();
      break;
    case 'todos':
      hideWarning();
      formContainer.classList.add('hidden');
      navLoginBtn.classList.add('hidden');
      navRegisterBtn.classList.add('hidden');
      navLogoutBtn.classList.remove('hidden');
      todosContent.classList.remove('hidden');
      home.classList.remove('home');
      navGreeting.innerHTML = `Hello, ${globalUsername}`;
      navGreeting.classList.remove('hidden');
      home.removeEventListener('click', homeRoute);

      displayTodos();

      break;
  }
}

function loginUser(ev) {
  ev.preventDefault();
  getUser('login');
}

function registerUser(ev) {
  ev.preventDefault();
  getUser('register');
}

// Login or register function
async function getUser(str) {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const route = 'http://127.0.0.1:3000/' + str;
  const response = await fetch(route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const result = await response.json();

  if (result.username) {
    globalUsername = result.username;
    globalTodos = result.todos;
    routes('todos');
  } else {
    displayWarning(result);
  }
}

function displayWarning(warning) {
  alertMessage.innerText = warning;
  alertMessage.classList.remove('hide-alert');
}

function hideWarning() {
  alertMessage.classList.add('hide-alert');
}

function displayTodos() {
  let result = '';
  globalTodos.forEach((todo) => {
    finished = todo.finished ? 'finished' : 'active';
    result += `
    <div class="todo">
      <div class="message ${finished}"><span>${todo.todo_message}</span></div>
      <button class="done" data-id=${todo.todo_id}>&#10004;</button>
      <button class="delete" data-id=${todo.todo_id}>x</button>
    </div>
    `;
  });
  todosHook.innerHTML = result;
}

function filterActiveTodos() {
  activeTodos.classList.add('applied-filter');
  finishedTodos.classList.remove('applied-filter');
  allTodos.classList.remove('applied-filter');
  const todos = document.getElementsByClassName('todo');
  Array.from(todos).forEach((todo) => {
    todo.classList.remove('hidden');
    if (todo.firstElementChild.classList.contains('finished')) {
      todo.classList.add('hidden');
    }
  });
}

function filterFinishedTodos() {
  activeTodos.classList.remove('applied-filter');
  finishedTodos.classList.add('applied-filter');
  allTodos.classList.remove('applied-filter');
  const todos = document.getElementsByClassName('todo');
  Array.from(todos).forEach((todo) => {
    todo.classList.remove('hidden');
    if (todo.firstElementChild.classList.contains('active')) {
      todo.classList.add('hidden');
    }
  });
}

function filterAllTodos() {
  activeTodos.classList.remove('applied-filter');
  finishedTodos.classList.remove('applied-filter');
  allTodos.classList.add('applied-filter');
  const todos = document.getElementsByClassName('todo');
  Array.from(todos).forEach((todo) => {
    todo.classList.remove('hidden');
  });
}

async function addTodo() {
  const todo_message = inputTodo.value;
  if (todo_message.length === 0) {
    return;
  }
  const urlToFetch = url + 'todos/' + globalUsername;
  const response = await fetch(urlToFetch, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      todo_message,
      finished: false,
    }),
  });
  const result = await response.json();
  if (result === 'Server error') {
    displayWarning('There was a server error');
  } else {
    hideWarning();
    const div = document.createElement('div');
    div.classList.add('todo');
    div.innerHTML = `
      <div class="message active"><span>${todo_message}</span></div>
      <button class="done" data-id=${result}>&#10004;</button>
      <button class="delete" data-id=${result}>x</button>
    `;
    todosHook.appendChild(div);
    inputTodo.value = '';
  }
}

// Add todo after hiting enter
function addTodoAfterEnter(ev) {
  if (ev.keyCode === 13) {
    addTodo();
  }
}

async function updateTodo(id, finished) {
  let urlToFetch = url + 'todos/' + id;
  let response = await fetch(urlToFetch, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      finished: finished,
    }),
  });
  let result = await response.json();
  return result;
}

async function deleteTodo(id) {
  let urlToFetch = url + 'todos/' + id;
  let response = await fetch(urlToFetch, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  let result = await response.json();
  return result;
}

// Change status of todo or delete it
function updateOrDeleteTodo(ev) {
  switch (ev.target.classList[0]) {
    case 'done':
      const doneButton = ev.target;
      const id = doneButton.dataset.id;
      let finished = true;
      if (doneButton.previousElementSibling.classList.contains('finished')) {
        finished = false;
      }
      const result = updateTodo(id, finished);
      if (result === 'Server error') {
        displayWarning('There was a server error');
      } else {
        hideWarning();
        doneButton.previousElementSibling.classList.toggle('finished');
        doneButton.previousElementSibling.classList.toggle('active');
      }
      break;
    case 'delete':
      if (ev.target.classList.contains('delete')) {
        const deleteButton = ev.target;
        const id = deleteButton.dataset.id;
        const result = deleteTodo(id);
        if (result === 'Server error') {
          displayWarning('There was a server error');
        } else {
          hideWarning();
          deleteButton.parentElement.remove();
        }
      }
      break;
  }
}
