const divTasks = document.querySelector('.task')
const addForm = document.querySelector('.addForm')
const inputTask = document.querySelector('.addtask')

//busca tarefas no banco
const fetchTasks = async () => {

  const response =  await fetch('http://localhost:3333/tasks');

  //pega o json da response
  const tasks = await response.json()
  return tasks

}

//adciona tarefa
const addTask = async (event) => {
  event.preventDefault();

  const task = { title: inputTask.value}

  await fetch('http://localhost:3333/tasks',{
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(task),
  });

  loadTasks()
  inputTask.value = '';

}

//exclui tarefa
const deleteTask = async (id) => {
  await fetch(`http://localhost:3333/tasks/${id}`,{method: 'delete'});

  loadTasks()
}

//formata data
const formatDate = (dateUTC) => {

  const options = {dateStyle: 'long', timeStyle: 'short'}
  const date = new Date(dateUTC).toLocaleString('pt-br',options);

  return date
}

// funçao para facilitar a criação de elementos html
const createElement = (tag, innerText = '', innerHTML = '') => {
  const element = document.createElement(tag)

  if(innerText){
    element.innerText =innerText
  }
  if(innerHTML){
    element.innerHTML = innerHTML
  }

  return element;
}

// cria tarefa 
const createTask = (task) => {

  //desestruturação, tira alguma coisa de dentro da taks
  const {title, id, created_at, status}= task 

  const newTask = createElement('div')
  newTask.classList.add('newtask')
  
  const taskTitle = createElement('div')
  taskTitle.classList.add('taskTitle')
  const checkbox = createElement('input')
  checkbox.setAttribute('type', 'checkbox')
  checkbox.setAttribute('name', 'task1')
  checkbox.setAttribute('id', 'task1')
  
  const label = createElement('label', title)
  label.setAttribute('for', 'task1')
  const data = createElement('span', formatDate(created_at))

  //botões
  const btnEditar = createElement('button', '', '<img src="./img/editar.svg" alt="">')
  const btnExcluir = createElement('button', '', '<img src="./img/excluir.svg" alt="">')
  btnEditar.classList.add('btn-action')
  btnExcluir.classList.add('btn-action')
  btnExcluir.addEventListener('click',() => deleteTask(id))
 
  newTask.appendChild(taskTitle)
  taskTitle.appendChild(checkbox)
  taskTitle.appendChild(label)
  taskTitle.appendChild(data)
 
  newTask.appendChild(btnEditar)
  newTask.appendChild(btnExcluir)

  return newTask
  
}


const loadTasks = async() => {
  const tasks = await fetchTasks()

  divTasks.innerHTML = ''

  tasks.forEach((task) => {
    const newTask = createTask(task)
    divTasks.appendChild(newTask)
  });
}

addForm.addEventListener('submit', addTask)

loadTasks()