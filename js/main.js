let tasks = [];
let selectedContacts = [];
let subtasks = [];
let totalSubtasks = 0;
let completedSubtasks = 0;
let currentTaskId = null;

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
    renderTasks(); 
  } catch (error) {
    console.error("Fehler beim Laden der Tasks:", error);
  }
}

function renderTasks() {
  const todoColumn = document.getElementById("todo");
  if (todoColumn) {
    todoColumn.innerHTML = ""; 

    tasks.forEach((task) => {
      addTaskToBoard(task);
    });

    document.querySelectorAll(".task-small-box").forEach((box) => {
      box.addEventListener("click", function () {
        const taskId = this.id; 
        showBigTaskBox(taskId);
      });
    });
  }
}


function getCategoryBackgroundColor(category) {
  switch (category) {
    case "Technical Task":
      return "#1FD7C1"; 
    case "User Story":
      return "#0038FF"; 
    default:
      return "#StandardFarbcode"; 
  }
}

function addNewTaskBoard() {
  let popup = document.querySelector(".addTaskFormPopUp");
  popup.style.display = "block";
}

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
  // Berechnen des Fortschritts !!!!!
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Aktualisieren der Progress-Bar und des Zählers !!!!!!
  document.querySelectorAll(".progress-bar").forEach((bar) => {
    bar.style.setProperty("--width", progress);
  });
  document.querySelectorAll(".counter-subtasks").forEach((counter) => {
    counter.textContent = `${completedSubtasks}/${totalSubtasks} Subtasks`;
  });
}

// POPUP BIG TASK IN BOARD
function createSubtasksHtml(subtasks) {
  if (subtasks.length === 0) {
    return "<p>Keine Subtasks</p>";
  }

  return subtasks
    .map(
      (subtask) => `
      <div class="subtaskBigBoxContent">
        <img src="/img/check-button-default.svg" alt="">
        <span>${subtask.text}</span>
      </div>
    `
    )
    .join("");
}

function showBigTaskBox(taskId) {
  currentTaskId = taskId;
  const task = tasks.find((t) => t.id.toString() === taskId);
  if (!task) return;

  task.assignedContactsSVGs = task.assignedContactsSVGs || [];
  task.subtasks = task.subtasks || [];

  const subtasksHtml = createSubtasksHtml(task.subtasks);
  const bigTaskBoxHtml = showBigTaskPopupHtmlTemplate(task, subtasksHtml);
  const bigTaskBoxContainer = document.getElementById("bigTaskBoxContainer");
  if (bigTaskBoxContainer) {
    bigTaskBoxContainer.innerHTML = bigTaskBoxHtml;
    document.getElementById("BigTaskFormPopUp").style.display = "block";
  }
}

function closeBigTaskBox() {
  document.getElementById("BigTaskFormPopUp").style.display = "none";
}


function deleteBigTaskBox() {
  if (currentTaskId === null) {
    console.error("Keine Task-ID gefunden");
    return;
  }
  tasks = tasks.filter(
    (task) => task.id.toString() !== currentTaskId.toString()
  );
  saveTasksToStorage();
  renderTasks();

  const bigTaskBox = document.getElementById("BigTaskFormPopUp");
  if (bigTaskBox) {
    bigTaskBox.style.display = "none";
  }
  currentTaskId = null; 
}



document.addEventListener("DOMContentLoaded", initPage);