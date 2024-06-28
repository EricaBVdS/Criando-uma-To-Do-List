const divTasks = document.querySelector('.task')
const divTasksOK = document.querySelector('.statusConcluida')
const addForm = document.querySelector('.addForm')
const inputTask = document.querySelector('.addtask')

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


//atualiza status
const updateTask = async ({title, id, status}) => {

  await fetch(`http://localhost:3333/tasks/${id}`, {
    method:'put',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({title, status}),
  })

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
  checkbox.setAttribute('value', status)

  checkbox.addEventListener('change', ({ target }) =>{
    if(checkbox.checked && checkbox.value == 'pendente'){
      newTask.classList.add('taskOK')
      checkbox.setAttribute('value', 'concluído')
    } else {
      newTask.classList.remove('taskOK')
      checkbox.setAttribute('value', 'pendente')
    }
    updateTask({id, title, created_at, status:target.value})
  })

  
  const label = createElement('label', title)
  label.setAttribute('for', 'task1')
  const data = createElement('span', formatDate(created_at))

  //botões
  const btnEditar = createElement('button', '', '<img src="./img/editar.svg" alt="">')
  const btnExcluir = createElement('button', '', '<img src="./img/excluir.svg" alt="">')
  btnEditar.classList.add('btn-action')
  btnExcluir.classList.add('btn-action')
  btnExcluir.addEventListener('click',() => deleteTask(id))
 
  //
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
    
    const {title, id, created_at, status} = task 
    const newTask = createTask(task)
    if (status == 'concluído') {
      newTask.classList.add('taskOK')
    } 
    return divTasks.appendChild(newTask)
    
  });
  /*
  tasks.forEach((task) => {
    const newTask = createTask(task) 
    divTasks.appendChild(newTask)

  });*/
}

addForm.addEventListener('submit', addTask)

loadTasks()