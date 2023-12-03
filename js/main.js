let tasks = [];
let selectedContacts = [];
let subtasks = [];
let totalSubtasks = 0;
let completedSubtasks = 0;
let currentTaskId = null;


async function initPage() {
  await loadTasksFromStorage();
  updateTaskCounts();
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
  ["todo", "inProgress", "awaitFeedback", "done"].forEach((columnId) => {
    document.getElementById(columnId).innerHTML = "";
  });

  tasks.forEach((task) => {
    const columnId = task.status || "todo";
    addTaskToBoard(task, columnId);
  });

  document.querySelectorAll(".task-small-box").forEach((box) => {
    box.addEventListener("click", function () {
      const taskId = this.id;
      showBigTaskBox(taskId);
    });
  });
 
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

function getActivePriority() {
  const activeButton = document.querySelector(".prioButtons.active");
  return activeButton ? activeButton.getAttribute("data-priority") : "Standard";
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

// Verhindert das Standard-Submit-Verhalten und ruft dann die Funktion zum Erstellen eines Tasks auf
function handleFormSubmit(event) {
  event.preventDefault(); 
  createTask(); 
}

function createTask() {
  if (!isCategorySelected()) {
    return;
  }

  const formData = getFormData();
  console.log("Form Data:", formData); // Zum testen bzw. debuggen
  const priorityImage = getActivePriorityImage();
  const assignedContactsSVGs = getAssignedContactsSVGs();

  const priority = getActivePriority();
  const subtasks = getSubtasks();
  const newTask = {
    id: Date.now(),
    ...formData,
    priorityImage,
    priority,
    assignedContactsSVGs,
    subtasks,
    status: "todo",
  };

  tasks.push(newTask);
  closeAddTaskForm();
  addTaskToBoard(newTask, newTask.status || "todo");
  saveTasksToStorage();
}


function addTaskToBoard(task, columnId) {
  const column = document.getElementById(columnId);
  const taskHtml = createTaskHtml(
    task,
    getCategoryBackgroundColor(task.category)
  );
  column.insertAdjacentHTML("beforeend", taskHtml);
}

function formatDueDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Monate sind 0-basiert
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}


// CONDITIONS FOR A TASK, TO BE CREATED


function isCategorySelected() {
  const categorySelect = document.getElementById("idSelectCategoryAddTask");
  const selectedCategory = categorySelect.value;
  const warningDiv = categorySelect.nextElementSibling;

  if (
    selectedCategory === "Technical Task" ||
    selectedCategory === "User Story"
  ) {
    categorySelect.style.borderColor = ""; 
    warningDiv.style.display = "none";
    return true;
  } else {
    categorySelect.style.borderColor = "red";
    warningDiv.style.display = "block";
    return false;
  }
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
function createSubtasksHtml(subtasks, taskId) {
  // Nehmen Sie taskId als Argument
  return subtasks
    .map(
      (subtask, index) => `
    <div class="subtaskBigBoxContent" data-index="${index}" onclick="toggleSubtaskStatus('${taskId}', ${index})">
      <img src="/img/${
        subtask.completed ? "check-button-checked-bigTask" : "check-button-default"
      }.svg" alt="">
      <span>${subtask.text}</span>
    </div>
  `
    )
    .join("");
}


function toggleSubtaskStatus(taskId, subtaskIndex) {
  const task = tasks.find((t) => t.id.toString() === taskId);
  if (!task || !task.subtasks[subtaskIndex]) return;

  // Toggle des Status
  task.subtasks[subtaskIndex].completed =
    !task.subtasks[subtaskIndex].completed;

  // Aktualisieren des Bildes für den angeklickten Subtask
  const subtaskElement = document.querySelector(
    `.subtaskBigBoxContent[data-index="${subtaskIndex}"]`
  );
  if (subtaskElement) {
    const imgElement = subtaskElement.querySelector("img");
    imgElement.src = task.subtasks[subtaskIndex].completed
      ? "/img/check-button-checked.svg"
      : "/img/check-button-default.svg";
  }
  // Speichern der Änderungen (falls erforderlich)
  saveTasksToStorage();  
}



function showBigTaskBox(taskId) {
  const task = tasks.find((t) => t.id.toString() === taskId);
  if (!task) return;

  task.assignedContactsSVGs = task.assignedContactsSVGs || [];
  task.subtasks = task.subtasks || [];

  const subtasksHtml = createSubtasksHtml(task.subtasks, taskId); // Übergeben Sie taskId hier
  const bigTaskBoxHtml = showBigTaskPopupHtmlTemplate(task, subtasksHtml);
  const bigTaskBoxContainer = document.getElementById("bigTaskBoxContainer");
  if (bigTaskBoxContainer) {
    bigTaskBoxContainer.innerHTML = bigTaskBoxHtml;
    document.getElementById("BigTaskFormPopUp").style.display = "block";
  }
}


function closeBigTaskBox() {
  document.getElementById("BigTaskFormPopUp").style.display = "none";
  location.reload();
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

