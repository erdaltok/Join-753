let tasks = [];
let selectedContacts = [];
let subtasks = [];
let totalSubtasks = 0;
let completedSubtasks = 0;

async function initPage() { 
  await loadTasksFromStorage();
  
}


// ADD TASK IN BOARD PAGE

async function saveTasksToStorage() {
  await setItem("tasks", tasks);
}

async function loadTasksFromStorage() {
  try {
    const loadedTasks = await getItem("tasks");
    if (!loadedTasks) {
      tasks = [];
      return;
    }
    tasks = Array.isArray(loadedTasks) ? loadedTasks : JSON.parse(loadedTasks);
    renderTasks(); // Funktion zum Rendern der Tasks
  } catch (error) {
    console.error("Fehler beim Laden der Tasks:", error);
  }
}

function renderTasks() {
  console.log(document.getElementById("todo")); // Sollte das Element ausgeben, nicht null
  tasks.forEach((task) => {
    addTaskToBoard(task);
  });
}

function getCategoryBackgroundColor(category) {
  switch (category) {
    case "Technical Task":
      return "#1FD7C1"; // Hintergrundfarbe für Technical Task
    case "User Story":
      return "#0038FF"; // Hintergrundfarbe für User Story
    default:
      return "#StandardFarbcode"; // Standardfarbe für andere Kategorien
  }
}

function addNewTaskBoard() {
  let popup = document.querySelector(".addTaskFormPopUp");
  popup.style.display = "block";
}

// Funktion zum Schließen des Pop-up-Formulars
function closeAddTaskForm() {
  let popup = document.querySelector(".addTaskFormPopUp");
  popup.style.display = "none";
}

function getFormData() {
  return {
    title: document.getElementById("idTitleInputAddTask").value,
    description: document.getElementById("idDescriptionAddTask").value,
    assignedTo: document.getElementById("idTitleSelectContactsAddTask").value,
    dueDate: document.getElementById("idTitleDateAddTask").value,
    category: document.getElementById("idSelectCategoryAddTask").value,
    subtask: document.getElementById("addedSubstaskList").value,
  };
}

function getActivePriorityImage() {
  const priorityButtons = document.querySelectorAll(".prioButtons");
  for (const button of priorityButtons) {
    if (isButtonActive(button)) {
      return getDefaultImageSrc(button.id);
    }
  }
  return "";
}

function getAssignedContactsSVGs() {
  return selectedContacts.map(
    (contact) => contact.querySelector("svg").outerHTML
  );
}

function getSubtasks() {
  const subtaskListElement = document.getElementById("addedSubstaskList");
  const subtaskElements = subtaskListElement.querySelectorAll("li");
  const subtasks = Array.from(subtaskElements).map((subtaskElement) => {
    return {
      text: subtaskElement.querySelector("span").textContent.trim(),
      completed: false, 
    };
  });

  return subtasks;
}

function createTask() {
  const formData = getFormData();
  const priorityImage = getActivePriorityImage();
  const assignedContactsSVGs = getAssignedContactsSVGs();

  const subtasks = getSubtasks(); 
  const newTask = {
    id: Date.now(),
    ...formData,
    priorityImage,
    assignedContactsSVGs,
    subtasks, 
  };

  tasks.push(newTask);
  closeAddTaskForm();
  addTaskToBoard(newTask);
  saveTasksToStorage();
}

function addTaskToBoard(task) {
  const todoColumn = document.getElementById("todo");
  const backgroundColor = getCategoryBackgroundColor(task.category);
  todoColumn.innerHTML += createTaskHtml(task, backgroundColor);
}

// CONTACT-LIST IN ADD TASK ON BOARD PAGE
function toggleContactList() {
  const contactInput = document.getElementById("idTitleSelectContactsAddTask");
  const contactList = document.querySelector(".listSelectableContacts");
  const addedContactsContainer = document.getElementById(
    "addedContactsProfilBadges"
  );

  if (contactList.style.display === "block") {
    contactList.style.display = "none";
    contactInput.style.background = "url(/img/arrow_drop_down.svg) no-repeat scroll right";
    addedContactsContainer.style.display = "block";
  } else {
    contactList.style.display = "block";
    contactInput.style.background = "url(/img/arrow_drop_up.svg) no-repeat scroll right";
    addedContactsContainer.style.display = "none";
  }
}

window.addEventListener("click", function (event) {
  const contactInput = document.getElementById("idTitleSelectContactsAddTask");
  const contactList = document.querySelector(".listSelectableContacts");

  if (contactInput && contactList) {
    if (
      !contactInput.contains(event.target) &&
      !contactList.contains(event.target)
    ) {
      contactList.style.display = "none";
      contactInput.style.background = "url(/img/arrow_drop_down.svg) no-repeat scroll right";
      document.getElementById("addedContactsProfilBadges").style.display = "block";
    }
  }
});

function addContactToTask(event) {
  const contactLine = event.currentTarget;

  if (contactLine.classList.contains("selected")) {
    removeContactFromTask(contactLine);
  } else {
    addedContactToTask(contactLine);
  }
  updateAddedContactsDisplay();
}

function addedContactToTask(contactLine) {
  contactLine.style.backgroundColor = "#091931";
  contactLine.querySelector(".contact-name").style.color = "white";
  const imgElement = contactLine.querySelector("img");
  imgElement.src = "/img/check-button-checked-white.svg";
  contactLine.classList.add("selected");

  selectedContacts.push(contactLine);
}

function removeContactFromTask(contactLine) {
  contactLine.style.backgroundColor = ""; 
  contactLine.querySelector(".contact-name").style.color = "";
  const imgElement = contactLine.querySelector("img");
  imgElement.src = "/img/check-button-default.svg"; 
  contactLine.classList.remove("selected");

  selectedContacts = selectedContacts.filter(
    (contact) => contact !== contactLine
  );
}

function updateAddedContactsDisplay() {
  const addedContactsContainer = document.getElementById(
    "addedContactsProfilBadges"
  );

  addedContactsContainer.innerHTML = "";
  selectedContacts.forEach((contact) => {
    const svgElement = contact.querySelector("svg").cloneNode(true);
    addedContactsContainer.appendChild(svgElement);
  });

  addedContactsContainer.style.display =
    selectedContacts.length > 0 ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const contactLines = document.querySelectorAll(".contact-line");
  contactLines.forEach((line) => {
    line.addEventListener("click", addContactToTask);
  });
});

function changeButtonStyle(selectedButton) {
  if (isButtonActive(selectedButton)) {
    resetButtonStyle(selectedButton);
  } else {
    resetAllButtons();
    SelectedButtonStyle(selectedButton);
  }
}

function isButtonActive(button) {
  const isActive = button.classList.contains("active");
  console.log("isButtonActive:", button.id, isActive);
  return isActive;
}

function resetButtonStyle(button) {
  button.classList.remove("active");
  button.style.backgroundColor = "white";
  button.style.color = "black";
  const originalImgSrc = getDefaultImageSrc(button.id);
  button.querySelector("img").src = originalImgSrc;
}

function resetAllButtons() {
  document.querySelectorAll(".prioButtons").forEach(resetButtonStyle);
}

function SelectedButtonStyle(button) {
  button.classList.add("active");
  button.style.backgroundColor = button.getAttribute("data-color");
  button.style.color = button.getAttribute("data-text-color");
  button.querySelector("img").src = button.getAttribute("data-img-src");
}

function getDefaultImageSrc(buttonId) {
  console.log("getDefaultImageSrc aufgerufen für:", buttonId); // Zusätzlicher Log
  switch (buttonId) {
    case "urgentButton":
      return "/img/Urgent.png";
    case "mediumButton":
      return "/img/Medium.png";
    case "lowButton":
      return "/img/Low.png";
    default:
      return "";
  }
}

// SUBTASKS IN ADD TASK BOARD PAGE

function openSubtasks() {
  const subtaskImage = document.querySelector(".subtaskImage");
  if (subtaskImage) {
    subtaskImage.style.display = "none";
  }

  const closeCheckSubtaskDiv = document.querySelector(".closeCheckSubstask");
  if (closeCheckSubtaskDiv) {
    closeCheckSubtaskDiv.style.display = "flex";
  }
}

function closeSubtasks() {
  const subtaskImage = document.querySelector(".subtaskImage");
  if (subtaskImage) {
    subtaskImage.style.display = "block";
  }

  const closeCheckSubtaskDiv = document.querySelector(".closeCheckSubstask");
  if (closeCheckSubtaskDiv) {
    closeCheckSubtaskDiv.style.display = "none";
  }
}

function editSubtask(event) {
  const liElement = event.target.closest("li");
  const span = liElement.querySelector("span");
  const editDeleteDiv = liElement.querySelector(".editDeleteSubtask");
  const confirmEditDiv = liElement.querySelector(".confirmEditSubtask");

  if (
    !span.getAttribute("contenteditable") ||
    span.getAttribute("contenteditable") === "false"
  ) {
    span.setAttribute("contenteditable", "true");
    span.focus();
    editDeleteDiv.style.display = "none";
    confirmEditDiv.style.display = "flex";
  }
}

function confirmEditSubtask(event) {
  const liElement = event.target.closest("li");
  const span = liElement.querySelector("span");
  const editDeleteDiv = liElement.querySelector(".editDeleteSubtask");
  const confirmEditDiv = liElement.querySelector(".confirmEditSubtask");

  span.setAttribute("contenteditable", "false");
  editDeleteDiv.style.display = "flex";
  confirmEditDiv.style.display = "none";

  // Hier Code hinzufügen, um die Änderungen zu speichern für später mit Backend
}

function addNewSubtask() {
  const inputField = document.getElementById("inputFieldSubtaskId");
  const subtaskText = inputField.value.trim();

  if (subtaskText) {
    subtasks.push(subtaskText);

    updateSubtaskList();
    totalSubtasks = subtasks.length;
    updateProgressBar();
    inputField.value = "";
    toggleSubtaskDisplay();
  }
}

function toggleSubtaskDisplay() {
  const closeCheckSubstask = document.querySelector(".closeCheckSubstask");
  const subtaskImage = document.querySelector(".subtaskImage");

  if (closeCheckSubstask && subtaskImage) {
    closeCheckSubstask.style.display = "none";
    subtaskImage.style.display = "block";
  }
}

function updateSubtaskList() {
  const listElement = document.getElementById("addedSubstaskList");
  listElement.innerHTML = "";

  subtasks.forEach((subtask) => {
    listElement.innerHTML += createSubtaskHtml(subtask);
  });
}

function deleteSubtask(event) {
  const liElement = event.target.closest("li");
  if (!liElement) return;

  const subtaskText = liElement.querySelector("span").textContent.trim();
  const index = subtasks.indexOf(subtaskText);
  if (index > -1) {
    subtasks.splice(index, 1);
  }

  liElement.remove();
  updateSubtaskList();
}

function updateProgressBar() {
  // Berechnen des Fortschritts
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Aktualisieren der Progress-Bar und des Zählers
  document.querySelectorAll(".progress-bar").forEach((bar) => {
    bar.style.setProperty("--width", progress);
  });
  document.querySelectorAll(".counter-subtasks").forEach((counter) => {
    counter.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
  });
}



// DRAG AND DROP !!!! PRÜFEN Hintergrund nach dem Absetzen des Tasks in neuer Spalte, bleibt. Muss aber weg... schaue ich später nochmal + Backend fehlt

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

    const task = tasks.find((t) => t.id === draggedItemId);
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

// SUMMARY PAGE

function changeImageOnHover(element, newSrc, originalSrc) {
  element.addEventListener("mouseover", function () {
    this.querySelector("img").src = newSrc;
  });
  element.addEventListener("mouseout", function () {
    this.querySelector("img").src = originalSrc;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const leftBox = document.querySelector(".left-box");
  const rightBox = document.querySelector(".right-box");

  if (leftBox) {
    changeImageOnHover(
      leftBox,
      "/img/pen-icon-whiteBg.svg",
      "/img/pen-icon.svg"
    );
  }

  if (rightBox) {
    changeImageOnHover(
      rightBox,
      "/img/checkmark-icon-whiteBg.svg",
      "/img/checkmark-icon.svg"
    );
  }
});

// HTML TEMPLATES

function createTaskHtml(task, backgroundColor) {
  // Überprüfen, ob assignedContactsSVGs ein Array ist und es initialisieren, falls es undefined ist
  const assignedContactsSVGs = Array.isArray(task.assignedContactsSVGs)
    ? task.assignedContactsSVGs
    : [];

  const priorityImageHtml = task.priorityImage
    ? `<img src="${task.priorityImage}" alt="Priority Image">`
    : "";

  // Verwenden von assignedContactsSVGs, das jetzt sicher ein Array ist
  const assignedContactsHtml = assignedContactsSVGs.join("");

  const subtasks = task.subtasks || []; // Fallback auf leeres Array, falls undefined
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.completed
  ).length;
  // Berechnen des Fortschritts für diese spezifische Task
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

 
  

  return `
    <div class="task-small-box" id="${task.id}" draggable="true" ondragstart="startDragging('${task.id}')">
        <div class="task-small-box-content">
            <div class="category">
                <div class="label-small-box" style="background-color: ${backgroundColor};">
                    <span>${task.category}</span>
                </div>
            </div>
            <div>
                <h1>${task.title}</h1>
                <p>${task.description}</p>

              
            </div>
            <div class="progress-subtasks">
                <div class="progress-bar" style="--width: ${progress}"></div>
                <div class="counter-subtasks">${completedSubtasks}/${totalSubtasks} Subtasks</div>
            </div>
            <div class="profilBadges-priority">
               <div class="profil-badges">
                    ${assignedContactsHtml}
                </div>
                <div class="priority-icons">
                    ${priorityImageHtml}
                </div>
            </div>
        </div>
    </div>
  `;
}

function createSubtaskHtml(subtaskText) {
  return `
        <li>
            <span>${subtaskText}
                <div class="editDeleteSubtask">
                    <img src="/img/edit-pen-icon-subtasks.svg" onclick="editSubtask(event)">
                    <img src="/img/divider-icon-subtasks.svg">
                    <img src="/img/delete-icon-subtasks.svg" onclick="deleteSubtask(event)" >
                </div>
                <div class="confirmEditSubtask" style="display: none;">
                    <img src="/img/delete-icon-subtasks.svg" onclick="deleteSubtask(event)" >
                    <img src="/img/divider-icon-subtasks.svg">
                    <img src="/img/check-icon-subtasks.svg" onclick="confirmEditSubtask(event)">
                </div>
            </span>
        </li>
    `;
}



document.addEventListener("DOMContentLoaded", initPage);