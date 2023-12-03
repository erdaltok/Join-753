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
  newTaskAddedMessage();
  resetTaskForm();
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

// CONDITIONS CATEGORY FOR A TASK, TO BE CREATED
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

function searchTask() {
  const searchText = document.getElementById("search-Task").value.toLowerCase();
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchText) ||
      task.description.toLowerCase().includes(searchText)
  );

  renderFilteredTasks(filteredTasks);
}

function renderFilteredTasks(filteredTasks) {
  ["todo", "inProgress", "awaitFeedback", "done"].forEach((columnId) => {
    document.getElementById(columnId).innerHTML = "";
  });

  filteredTasks.forEach((task) => {
    const columnId = task.status || "todo";
    addTaskToBoard(task, columnId);
  });
}

function newTaskAddedMessage() {
  let messageBox = document.getElementById("addNewTaskMessage");
  messageBox.innerHTML = `
        <span>Task added to board</span>
        <img src="/img/board-icon-tasl-added-message.svg" alt="" style="margin-left: 10px;">
    `;
  messageBox.style.display = "flex";

  setTimeout(function () {
    messageBox.style.display = "none";
  }, 2000);
}

function resetTaskForm() {
  document.getElementById("idTitleInputAddTask").value = "";
  document.getElementById("idDescriptionAddTask").value = "";
  document.getElementById("idTitleSelectContactsAddTask").value = "";
  document.getElementById("idTitleDateAddTask").value = "";
  document.getElementById("idSelectCategoryAddTask").value = "";
  document.getElementById("addedSubstaskList").innerHTML = "";

  resetAllButtons();
  selectedContacts = []; 
  updateAddedContactsDisplay();
}

function updateAddedContactsDisplay() {
  const addedContactsContainer = document.getElementById(
    "addedContactsProfilBadges"
  );
  if (addedContactsContainer) {
    addedContactsContainer.innerHTML = ""; 
  }
}

document.addEventListener("DOMContentLoaded", initPage);

