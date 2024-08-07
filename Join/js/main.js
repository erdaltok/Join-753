let tasks = [];
let selectedContacts = [];
let subtasks = [];
let totalSubtasks = 0;
let completedSubtasks = 0;
let currentTaskId = null;
let fromAddTask = false;
let newTaskStatus = "todo";

/** 
 * Initializes the page by loading tasks from storage, rendering them, and updating task counts.
 */
async function initPage() {
  try {
    await loadTasksFromStorage();
    renderTasks();
    updateTaskCounts();
    
  } catch (error) {
    console.error("Fehler beim Initialisieren der Seite:", error);
  }
}
/** 
 * Saves the current state of tasks to storage.
 */
async function saveTasksToStorage() {
  await setItem("tasks", tasks);
}
/** 
 * Loads tasks from storage and updates the task list.
 */
async function loadTasksFromStorage() {
  try {
    const loadedTasks = await getItem("tasks");
    if (!loadedTasks) {
      tasks = [];
      return; }
    tasks = Array.isArray(loadedTasks) ? loadedTasks : JSON.parse(loadedTasks);
    renderTasks(); 
  } catch (error) {
    console.error("Fehler beim Laden der Tasks:", error);
  }
}
/** 
 * Renders all tasks on the board by iterating through each task status category.
 */
function renderTasks() {
  if (!document.getElementById("todo")) {
    return;
  }
  clearColumns();
  renderTaskBoxes();
  attachTaskBoxListeners();
  // Adding event listener to move task to another category
  document.querySelectorAll(".moveTaskToAnotherCategory").forEach((box) => {
    box.addEventListener("click", handleMoveTaskToAnotherCategory);
  });
}

/** 
 * Renders all tasks on the board by iterating through each task status category.
 */
function clearColumns() {
  ["todo", "inProgress", "awaitFeedback", "done"].forEach((columnId) => {
    const column = document.getElementById(columnId);
    if (column) {
      column.innerHTML = "";
    }
  });
}

/** 
 * Renders all tasks on the board.
 */
function renderTaskBoxes() {
  tasks.forEach((task) => {
    const columnId = task.status || "todo";
    addTaskToBoard(task, columnId);
  });
}
/** 
 * Attach eventlisteners.
 */
function attachTaskBoxListeners() {
  document.querySelectorAll(".task-small-box").forEach((box) => {
    box.addEventListener("click", function (event) {
      event.stopPropagation();
      const taskId = this.id;
      // Handle task box click logic here
      // For now, we can log the taskId
      showBigTaskBox(taskId);      
    });
  });
}

// Function to render task options for different categories
function renderTaskOptions(tasks, index, trueID, renderFunction) {
  renderFunction(tasks, index, trueID);
}

// Function to handle click event for moving task to different category
function handleMoveTaskToAnotherCategory(event) {
  event.stopPropagation();
  const trueID = this.id.slice(4);
  let index = tasks.findIndex(task => task.id == trueID);
  if (index === -1) { console.log("Task not found!"); return; }
  renderTaskOptions(tasks, index, trueID, renderToDoTaskOptions);
  renderTaskOptions(tasks, index, trueID, renderInProgressTaskOptions);
  renderTaskOptions(tasks, index, trueID, renderAwaitFeedbackTaskOptions);
  renderTaskOptions(tasks, index, trueID, renderDoneTaskOptions);
  document.querySelectorAll(".moveToDivs").forEach((box) => {
    box.addEventListener("click", handleMoveToDivs);
  });
}

// Function to handle click event for moving task to a specific category
function handleMoveToDivs(event) {
  event.stopPropagation();
  event.preventDefault();
  let trueID = this.id.slice(2);
  let index = tasks.findIndex(task => task.id == trueID);
  if (index === -1) {
    console.log("Task not found!");
    return;
  }
  updateTaskStatus(this.id, tasks[index]);
  renderTasks();
}

/** 
 * Retrieves the image source for the active priority button.
 * @returns {string} The source of the image for the active priority button.
 */
function getActivePriorityImage() {
  const priorityButtons = document.querySelectorAll(".prioButtons");
  for (const button of priorityButtons) {
    if (isButtonActive(button)) {
      return getDefaultImageSrc(button.id);
    }
  }
  return "";
}

/** 
 * Gets the active priority level from the selected priority button.
 * @returns {string} The priority level of the active button.
 */
function getActivePriority() {
  const activeButton = document.querySelector(".prioButtons.active");
  return activeButton ? activeButton.getAttribute("data-priority") : "Standard";
}
/** 
 * Generates HTML badges for assigned contacts.
 * @returns {Array} An array of HTML strings representing contact badges.
 */
function getAssignedContactsBadges() {
  return selectedContacts.map((contact) => {
    const name = contact.querySelector(".contact-name").textContent;
    const initials = getInitials(name);
    const firstLetter = getFirstLetter(name);
    const initialColor = getLetterColor(firstLetter);
    return { badgeHtml: `<div class="initial" style="background-color: ${initialColor};">${initials}</div>`, name, };
  });
}
/** 
 * Collects subtasks from the subtask list element.
 * @returns {Array} An array of subtask objects.
 */
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

/** * Adds a task to a specific column on the board.
 * @param {Object} task The task object to be added.
 * @param {string} columnId The ID of the column where the task should be added.
 */
function addTaskToBoard(task, columnId) {
  const column = document.getElementById(columnId);
  if (column) {
    const taskHtml = createTaskHtml(
      task,
      getCategoryBackgroundColor(task.category)
    );
    column.insertAdjacentHTML("beforeend", taskHtml);
  }  
}

/** 
 * Formats a date string to a more readable format.
 * @param {string} dateString The date string to format.
 * @returns {string} Formatted date string.
 */
function formatDueDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/** 
 * Checks if a category is selected in the task form.
 * @returns {boolean} True if a category is selected, false otherwise.
 */
function isCategorySelected() {
  const categorySelect = document.getElementById("idSelectCategoryAddTask");
  const selectedCategory = categorySelect.value;
  const warningDiv = categorySelect.nextElementSibling;
  if ( selectedCategory === "Technical Task" ||
    selectedCategory === "User Story") {
    categorySelect.style.borderColor = ""; 
    warningDiv.style.display = "none";
    return true;} else {
    categorySelect.style.borderColor = "red";
    warningDiv.style.display = "block";
    return false;
  }
}

/** 
 * Gets the background color associated with a task category.
 * @param {string} category The category of the task.
 * @returns {string} The background color for the given category.
 */
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
/** 
 * Changes the style of a selected priority button.
 * @param {HTMLElement} selectedButton The button element to change the style of.
 */
function changeButtonStyle(selectedButton) {
  if (isButtonActive(selectedButton)) {
    resetButtonStyle(selectedButton);
  } else {
    resetAllButtons();
    SelectedButtonStyle(selectedButton);
  }
}

/** 
 * Checks if a button is currently active.
 * @param {HTMLElement} button The button to check.
 * @returns {boolean} True if the button is active, false otherwise.
 */
function isButtonActive(button) {
  const isActive = button.classList.contains("active");
  return isActive;
}

/** 
 * Resets the style of a priority button to its default state.
 * @param {HTMLElement} button The button to reset.
 */
function resetButtonStyle(button) {
  button.classList.remove("active");
  button.style.backgroundColor = "white";
  button.style.color = "black";
  const originalImgSrc = getDefaultImageSrc(button.id);
  button.querySelector("img").src = originalImgSrc;
}

/** * Resets the style of all priority buttons to their default state.*/
function resetAllButtons() {
  document.querySelectorAll(".prioButtons").forEach(resetButtonStyle);
}

/** 
 * Applies the selected style to a priority button.
 * @param {HTMLElement} button The button to apply the style to.
 */
function SelectedButtonStyle(button) {
  button.classList.add("active");
  button.style.backgroundColor = button.getAttribute("data-color");
  button.style.color = button.getAttribute("data-text-color");
  button.querySelector("img").src = button.getAttribute("data-img-src");
}
/** 
 * Gets the default image source for a given priority button ID.
 * @param {string} buttonId The ID of the priority button.
 * @returns {string} The default image source for the button.
 */
function getDefaultImageSrc(buttonId) {
  switch (buttonId) {
    case "urgentButton":
      return "/Join/img/Urgent.png";
    case "mediumButton":
      return "/Join/img/Medium.png";
    case "lowButton":
      return "/Join/img/Low.png";
    default:
      return "";
  }
}
/**
 * * Updates the display of added contacts in the task form.
 * */
function updateAddedContactsDisplay() {
  const addedContactsContainer = document.getElementById(
    "addedContactsProfilBadges"
  );
  if (addedContactsContainer) {
    addedContactsContainer.innerHTML = ""; 
  }
}
/**
 * Resets the selected contacts to their default state.
 * */
function resetSelectedContacts() {
  selectedContacts.forEach((contactLine) => {
    contactLine.style.backgroundColor = "";
    contactLine.querySelector(".contact-name").style.color = "";
    const imgElement = contactLine.querySelector("img");
    imgElement.src = "/Join/img/check-button-default.svg";
    contactLine.classList.remove("selected");
  });

  selectedContacts = [];
  loadContactsForForm();
}
/** 
 * Sets up event listeners for the clear button in the task form.
 * */
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
        icon.src = "/Join/img/clear-icon-footer-board-addTask-blue.svg";
      } });
    button.addEventListener("mouseout", function () {
      const icon = this.querySelector(".clearIconFooter");
      if (icon) { icon.src = "/Join/img/clear-icon-footer-board-addTask.svg"; }
    });
  });  
});
/**
 * Updates the status of a task based on its ID prefix and saves the changes to storage.
 * @param {string} id - The ID of the task to update.
 * @param {Array} tasks - The array of tasks to update.
 */
function updateTaskStatus(id, tasks) {
   // Check the prefix of the task ID and update its status accordingly
  if (id.slice(0, 2) === "TD") {
      tasks.status = "todo";
  } else if (id.slice(0, 2) === "IP") {
      tasks.status = "inProgress";
  } else if (id.slice(0, 2) === "AF") {
      tasks.status = "awaitFeedback";
  } else if (id.slice(0, 2) === "DN") {
      tasks.status = "done";
  }
  saveTasksToStorage();
}
/**
 * Renders options for moving a task that is already marked as done.
 * @param {Array} tasks - The array of tasks.
 * @param {number} i - The index of the task to render options for.
 * @param {string} trueID - The ID of the container element where options will be rendered.
 */
function renderDoneTaskOptions(tasks, i, trueID) {
    /**
     * If the task status is "done", renders options for moving the task back to different statuses.
     * @param {string} tasks[i].status - The status of the task.
     * @param {string} tasks[i].id - The ID of the task.
     */
  if (tasks[i].status === "done") {
      document.getElementById(trueID).innerHTML =
          '<div id="TD'+tasks[i].id+'" class="moveToDivs">To Do</div>'+
          '<div id="IP'+tasks[i].id+'" class="moveToDivs">In progress</div>'+
          '<div id="AF'+tasks[i].id+'" class="moveToDivs">Await feedback</div>'+
          '<div id="CN'+tasks[i].id+'" class="moveToDivs" style="background-color:red;color:white;">Cancel</div>';
  }
}
/**
 * Renders options for moving a task that is awaiting feedback.
 * @param {Array} tasks - The array of tasks.
 * @param {number} i - The index of the task to render options for.
 * @param {string} trueID - The ID of the container element where options will be rendered.
 */
function renderAwaitFeedbackTaskOptions(tasks, i, trueID) {
  /**
     * If the task status is "awaitFeedback", renders options for moving the task to different statuses.
     * @param {string} tasks[i].status - The status of the task.
     * @param {string} tasks[i].id - The ID of the task.
     */
  if (tasks[i].status === "awaitFeedback") {
      document.getElementById(trueID).innerHTML =
          '<div id="TD'+tasks[i].id+'" class="moveToDivs">To Do</div>'+
          '<div id="IP'+tasks[i].id+'" class="moveToDivs">In Progress</div>'+
          '<div id="DN'+tasks[i].id+'" class="moveToDivs">Done</div>'+
          '<div id="CN'+tasks[i].id+'" class="moveToDivs" style="background-color:red;color:white;">Cancel</div>';
  }
}
/**
 * Renders options for moving a task that is in progress.
 * @param {Array} tasks - The array of tasks.
 * @param {number} i - The index of the task to render options for.
 * @param {string} trueID - The ID of the container element where options will be rendered.
 */
function renderInProgressTaskOptions(tasks, i, trueID) {
    /**
     * If the task status is "inProgress", renders options for moving the task to different statuses.
     * @param {string} tasks[i].status - The status of the task.
     * @param {string} tasks[i].id - The ID of the task.
     */
  if (tasks[i].status === "inProgress") {
      document.getElementById(trueID).innerHTML =
          '<div id="TD'+tasks[i].id+'" class="moveToDivs">To Do</div>'+
          '<div id="AF'+tasks[i].id+'" class="moveToDivs">Await feedback</div>'+
          '<div id="DN'+tasks[i].id+'" class="moveToDivs">Done</div>'+
          '<div id="CN'+tasks[i].id+'" class="moveToDivs" style="background-color:red;color:white;">Cancel</div>';
  }
}
/**
 * Renders options for moving a task that is in the "To Do" status.
 * @param {Array} tasks - The array of tasks.
 * @param {number} i - The index of the task to render options for.
 * @param {string} trueID - The ID of the container element where options will be rendered.
 */
function renderToDoTaskOptions(tasks, i, trueID) {
   /**
     * If the task status is "todo", renders options for moving the task to different statuses.
     * @param {string} tasks[i].status - The status of the task.
     * @param {string} tasks[i].id - The ID of the task.
     */
  if (tasks[i].status === "todo") {
      document.getElementById(trueID).innerHTML =
          '<div id="IP'+tasks[i].id+'" class="moveToDivs"><span>In progress</span></div>'+
          '<div id="AF'+tasks[i].id+'" class="moveToDivs">Await feedback</div>'+
          '<div id="DN'+tasks[i].id+'" class="moveToDivs">Done</div>'+
          '<div id="CN'+tasks[i].id+'" class="moveToDivs" style="background-color:red;color:white;">Cancel</div>';
  }
}
/**
 * Finds the index of a task in an array of tasks by its ID.
 * @param {string} id - The ID of the task to find.
 * @param {Array} tasks - The array of tasks to search within.
 * @returns {number} - The index of the task if found, otherwise -1.
 */
function findTaskIndexById(id, tasks) {
   /**
     * Iterates through the tasks array to find the index of the task with the specified ID.
     * @param {string} tasks[i].id - The ID of the current task being checked.
     */
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            return i;
        }
    }
    return -1; // Return -1 if the task with the specified id is not found
}

document.addEventListener("DOMContentLoaded", initPage);