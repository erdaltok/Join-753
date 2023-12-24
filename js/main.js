let tasks = [];
let selectedContacts = [];
let subtasks = [];
let totalSubtasks = 0;
let completedSubtasks = 0;
let currentTaskId = null;
let fromAddTask = false;


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
  console.log("Aktuelle Tasks:", tasks); // Zum Testen

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
  console.log("Event-Listener hinzugefügt"); // Zum Testen
}

function addNewTaskBoard() {
  let popup = document.querySelector(".addTaskFormPopUp");
  if (popup) {
    popup.style.display = "block";
    let popUpContent = popup.querySelector(".addTaskPopUp");
    if (popUpContent) {
      popUpContent.classList.add("slide-in");
      popUpContent.classList.remove("slide-out");
    }
    resetCssClassesForNewTask();
  }
}

function closeAddTaskForm() {
  let popup = document.querySelector(".addTaskFormPopUp");
  if (popup) {
    let popUpContent = popup.querySelector(".addTaskPopUp");
    if (popUpContent) {      
      popUpContent.classList.remove("slide-in");
      popUpContent.classList.add("slide-out");

      popUpContent.addEventListener(
        "animationend",
        function () {
          popup.style.display = "none";
        },
        { once: true }
      ); 
    }
  }
  renderTasks();
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

function getAssignedContactsBadges() {
  return selectedContacts.map((contact) => {
    const name = contact.querySelector(".contact-name").textContent;
    const initials = getInitials(name);
    const firstLetter = getFirstLetter(name);
    const initialColor = getLetterColor(firstLetter);
    return {
      badgeHtml: `<div class="initial" style="background-color: ${initialColor};">${initials}</div>`,
      name,
    };
  });
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

function handleFormSubmit(event) {
  event.preventDefault(); 
  createTask(); 
}

function handleFormSubmitFromAddTask(event)
{
  event.preventDefault();
  fromAddTask = true;
  createTask();
  fromAddTask = false;
}


function updateExistingTask(
  formData,
  priorityImage,
  assignedContactsData,
  priority,
  subtasks
) {
  const currentTaskIndex = tasks.findIndex(
    (task) => task.id.toString() === currentTaskId
  );
  if (currentTaskIndex !== -1) {
    tasks[currentTaskIndex] = {
      ...tasks[currentTaskIndex],
      ...formData,
      priorityImage,
      priority,
      assignedContactsBadges: assignedContactsData,
      subtasks,
    };
  }
}

function createNewTask(
  formData,
  priorityImage,
  assignedContactsData,
  priority,
  subtasks
) {
  const newTask = {
    id: Date.now(),
    ...formData,
    priorityImage,
    priority,
    assignedContactsBadges: assignedContactsData,
    subtasks,
    status: "todo",
  };
  tasks.push(newTask);
  addTaskToBoard(newTask, newTask.status || "todo");
}

function finalizeTaskCreation() {
  saveTasksToStorage();
  if (fromAddTask === false) {
    closeAddTaskForm();
  }
  newTaskAddedMessage();
  resetTaskForm();
}

function createTask() {
  if (!isCategorySelected()) {
    return;
  }

  const formData = getFormData();
  const priorityImage = getActivePriorityImage();
  const assignedContactsData = getAssignedContactsBadges();
  const priority = getActivePriority();
  const subtasks = getSubtasks();

  if (currentTaskId) {
    updateExistingTask(formData,priorityImage,assignedContactsData,priority,subtasks);
  } else {
    createNewTask(formData,priorityImage,assignedContactsData,priority,subtasks);
  }

  finalizeTaskCreation();
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
  document.getElementById("inputFieldSubtaskId").value = "";

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

function resetCssClassesForNewTask() {
  updateClass("editTitle", "titlePositionLittle");
  updateClass("editLeftAndRight", "formLeftAndRightFlex");
  updateClass("editHideDivider", "dividerLittle");
  updateClass("editLeft", "addTaskLeftLittle");
  updateClass("editDate", "titleDateAddTaskBoard");
  updateClass("editRight", "addTaskRightLittle");
  updateClass("editPopUp", "addTaskPopUp");
  updateClass("editFooter", "formFooter");
}

function updateClass(oldClass, newClass) {
  const elements = document.querySelectorAll(`.${oldClass}`);
  elements.forEach((element) => {
    element.classList.remove(oldClass);
    element.classList.add(newClass);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const clearButton = document.querySelector(".footerButtonClear");
  if (clearButton) {
    clearButton.addEventListener("click", function () {
      resetTaskForm();
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const clearButtons = document.querySelectorAll(".footerButtonClear");

  clearButtons.forEach((button) => {
    button.addEventListener("mouseover", function () {
      const icon = this.querySelector(".clearIconFooter");
      if (icon) {
        icon.src = "/img/clear-icon-footer-board-addTask-blue.svg";
      }
    });

    button.addEventListener("mouseout", function () {
      const icon = this.querySelector(".clearIconFooter");
      if (icon) {
        icon.src = "/img/clear-icon-footer-board-addTask.svg";
      }
    });
  });
});


document.addEventListener("DOMContentLoaded", initPage);