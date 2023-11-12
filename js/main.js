function initPage() {
  loadTemplate("summary", "mainContent");
  
}




async function loadTemplate(templateName, targetElementId) {
  let targetElement = document.getElementById(targetElementId);

  try {
    let response = await fetch(`/template/${templateName}_template.html`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.text();
    targetElement.innerHTML = data;

    // Nur wenn das Board-Template geladen wird, laden Sie die Tasks
    // if (templateName === "board") {
    //   await loadTasks();
    // }
  } catch (error) {
    console.error("Ein Fehler ist aufgetreten:", error);
  }
}






function displayContentTemplates(templateName) {
  document.getElementById("desktopTemplate").style.display = "block";
  loadTemplate(templateName, "mainContent");
}


function showSummary() {
  loadTemplate("summary", "mainContent");
}


function showBoard() {
  loadTemplate("board", "mainContent")
    .then(() => {
      loadTasks();
    })
    .catch((error) => {
      console.error("Fehler beim Laden des Board-Templates:", error);
    });
}


function showAddTasks() {
  displayContentTemplates("addTask");
}

function showContacts() {
  displayContentTemplates("contacts");
}

let newTasksBoard = [];
let taskIdCounter = 0;

async function addNewTaskBoard() {
  const taskId = "task" + taskIdCounter++;
  const newTask = {
    id: taskId,
    title: "Contacts Form & Imprint",
    description: "Create a contact form and imprint page",
    status: "todo",
  };

  newTasksBoard.push(newTask);
  await saveTask(newTask); // Speichern des neuen Tasks

  // Anzeigen der neuen Aufgabe im entsprechenden Bereich
  const columnElement = document.getElementById(newTask.status);
  if (columnElement) {
    displayTask(newTask, columnElement);
  }
}


function displayTask(task, columnElement) {
  const taskHtml = `
    <div class="task-small-box" id="${task.id}" draggable="true" ondragstart="startDragging('${task.id}')">
      <div class="task-small-box-content">
        <div class="category">
          <div class="label-small-box">
            <span>Technical Task</span>
          </div>
        </div>
        <div>
          <h1>${task.title}</h1>
          <p>${task.description}</p>
        </div>
        <div class="progress-subtasks">
            <div class="progress" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0"
                  aria-valuemax="100" style="height: 8px">
              <div class="progress-bar" style="width: 50%"></div>                                    
            </div>
            <div class="counter-subtasks">1/2 Subtasks</div>
        </div>
        <div class="profilBadges-priority">
              <div class="profil-Badges">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="15.5" fill="#1FD7C1" stroke="white" stroke-width="2" />
                          <text x="16" y="16" alignment-baseline="central" text-anchor="middle" fill="white">
                              AM
                          </text>
                    </svg>
              </div>
              <div class="priority-icons">
                  <img src="/img/prio-icon-small-task.svg" alt="">
              </div>
        </div>

      </div>
    </div>`;

  columnElement.innerHTML += taskHtml;
  
}

async function saveTask(task) {
  const index = newTasksBoard.findIndex((t) => t.id === task.id);
  if (index > -1) {
    newTasksBoard[index] = task;
  } else {
    newTasksBoard.push(task);
  }
  await setItem("tasks", newTasksBoard);
}


async function loadTasks() {
  console.log("loadTasks() aufgerufen");

  try {
    let tasksFromStorage = await getItem("tasks");
    console.log("Tasks aus Storage:", tasksFromStorage);

    if (typeof tasksFromStorage === "string") {
      tasksFromStorage = JSON.parse(tasksFromStorage);
    }

    console.log("Verarbeitete Tasks:", tasksFromStorage);

    if (Array.isArray(tasksFromStorage)) {
      newTasksBoard = tasksFromStorage;
      newTasksBoard.forEach((task) => {
        console.log("Lade Task:", task);
        const columnElement = document.getElementById(task.status);
        if (columnElement) {
          displayTask(task, columnElement);
        } else {
          console.log("Kann Spalte für Task nicht finden:", task);
        }
      });
    }
  } catch (error) {
    console.error("Fehler beim Laden der Tasks:", error);
  }
}




let draggedItemId = null;

function startDragging(id) {
  draggedItemId = id;
}

function allowDrop(event) {
  event.preventDefault();
}

function moveTo(columnId) {
  if (draggedItemId) {
    const item = document.getElementById(draggedItemId);
    document.getElementById(columnId).appendChild(item);

    const task = newTasksBoard.find((t) => t.id === draggedItemId);
    if (task) {
      task.status = columnId;
      saveTask(task);
    }

    draggedItemId = null;
  }
}

function highlight(columnId) {
  document.getElementById(columnId).style.background = "#f0f0f0";
}

function removeHighlight(columnId) {
  document.getElementById(columnId).style.background = "";
}