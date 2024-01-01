
/**
 * Opens the form to add a new task with a specified status.
 * @param {string} status - The initial status of the new task (default: "todo").
 */
function addNewTaskBoard(status = "todo") {
  newTaskStatus = status;
  let popup = document.querySelector(".addTaskFormPopUp");
  if (popup) {
    const importAddTaskForm = document.getElementById("importAddTaskForm");
    if (importAddTaskForm) {
      importAddTaskForm.innerHTML = generateAddTaskFormHtml();
      loadContactsForForm();
      setupClearButtonListeners();
    }
    popup.style.display = "block";
    let popUpContent = popup.querySelector(".addTaskPopUp");
    if (popUpContent) {
      popUpContent.classList.add("slide-in");
      popUpContent.classList.remove("slide-out");
    }
  }
}

/**
 * Closes the form for adding a new task and updates the task board.
 */
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
  saveTasksToStorage();
  renderTasks();
  resetTaskForm();
  resetSelectedContacts();
}

document.addEventListener("click", function (event) {
  const clickedElement = event.target;
  const popupFlex = document.querySelector(".popupFlex");
  if (
    popupFlex &&
    popupFlex.contains(clickedElement) &&
    !clickedElement.closest(".addTaskPopUp")
  ) {
    closeAddTaskForm();
  }
});

/**
 * Collects form data to create or update a task.
 * @returns {object} - The data collected from the form.
 */
function getFormData() {
  return {
    title: document.getElementById("idTitleInputAddTask").value,
    description: document.getElementById("idDescriptionAddTask").value,
    dueDate: document.getElementById("idTitleDateAddTask").value,
    category: document.getElementById("idSelectCategoryAddTask").value,
    subtasks: getSubtasks(),
    priority: getActivePriority(),
    priorityImage: getActivePriorityImage(),
  };
}

/**
 * Creates a new task or updates an existing one based on the form data.
 */
function createNewTaskOrUpdateExistingTask() {
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
  updateAddedContactsDisplay();
  resetTaskForm();
}

/**
 * Creates a new task with the provided data and adds it to the task board.
 * @param {object} formData - Data for the new task.
 * @param {string} priorityImage - URL of the priority image.
 * @param {Array} assignedContactsData - Array of assigned contacts.
 * @param {string} priority - Priority level of the task.
 * @param {Array} subtasks - Array of subtasks.
 */
function createNewTask(formData, priorityImage, assignedContactsData, priority, subtasks) {
  const newTask = {
    id: Date.now(),
    ...formData,
    priorityImage,
    priority,
    assignedContactsBadges: assignedContactsData,
    subtasks,
    status: newTaskStatus,
  };
  tasks.push(newTask);
  addTaskToBoard(newTask, newTask.status || "todo");
  resetTaskForm();
}

/**
 * Updates an existing task with new data.
 * @param {object} formData - Updated data for the task.
 * @param {string} priorityImage - URL of the priority image.
 * @param {Array} assignedContactsData - Array of assigned contacts.
 * @param {string} priority - Priority level of the task.
 * @param {Array} subtasks - Array of subtasks.
 */
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

/**
 * Finalizes the task creation process, saves tasks to storage, and resets the form.
 */
async function finalizeTaskCreation() {
  await saveTasksToStorage();
  if (fromAddTask === false) {
    closeAddTaskForm();
  }
  newTaskAddedMessage();
    resetTaskForm();
}

/**
 * Resets the task form to its default state.
 */
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
  resetSelectedContacts();
}






/**
 * Displays a message indicating a new task has been added to the board.
 */
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

/**
 * Handles the form submission for creating or updating a task.
 * @param {Event} event - The form submission event.
 */
function handleFormSubmit(event) {
  event.preventDefault();
  createNewTaskOrUpdateExistingTask();
}

/**
 * Handles the form submission specifically from the 'Add Task' section.
 * @param {Event} event - The form submission event.
 */
function handleFormSubmitFromAddTask(event) {
  event.preventDefault();
  fromAddTask = true;
  createNewTaskOrUpdateExistingTask();
  fromAddTask = false;
}

function searchContacts() {
  const searchText = document
    .getElementById("idTitleSelectContactsAddTask")
    .value.toLowerCase();
  const contacts = JSON.parse(localStorage.getItem("contacts")) || {
    names: [],
    emails: [],
    phones: [],
  };

  const filteredContacts = contacts.names.filter((name) =>
    name.toLowerCase().includes(searchText)
  );

  renderFilteredContacts(filteredContacts);
}

function renderFilteredContacts(filteredContactNames) {
  const listSelectableContacts = document.getElementById(
    "listSelectableContacts"
  );
  const ulElement = listSelectableContacts.querySelector("ul");
  ulElement.innerHTML = "";

  filteredContactNames.forEach((name) => {
    const initials = getInitials(name);
    const firstLetter = getFirstLetter(name);
    const initialColor = getLetterColor(firstLetter);
    const liElement = document.createElement("li");
    liElement.className = "contact-line";
    liElement.innerHTML = loadContactsForFormHtmlTemplate(
      name,
      initials,
      initialColor
    );
    ulElement.appendChild(liElement);
  });

  addEventListenersToContactLines();
}


