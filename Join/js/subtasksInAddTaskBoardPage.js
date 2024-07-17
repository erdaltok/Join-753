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
  if (!span.getAttribute("contenteditable") || span.getAttribute("contenteditable") === "false") {
    // Set the initial value in the dataset attribute
    span.dataset.originalText = span.textContent.trim();
    // Enable editing mode
    span.setAttribute("contenteditable", "true");
    span.focus();
    editDeleteDiv.style.display = "none";
    confirmEditDiv.style.display = "flex";
  }
}

  


function confirmEditSubtask(event) {
  const liElement = event.target.closest("li");
  if (!liElement) return;
  const span = liElement.querySelector("span");
  const editedText = span.textContent.trim(); // Get the edited text
  // Find the index of the edited text in the subtasks array
  const originalText = span.dataset.originalText;
  const index = subtasks.indexOf(originalText);
  if (index !== -1) {
    // Update the subtask text in the subtasks array
    subtasks[index] = editedText;
  }

  // Hide editing UI
  span.setAttribute("contenteditable", "false");
  liElement.querySelector(".editDeleteSubtask").style.display = "flex";
  liElement.querySelector(".confirmEditSubtask").style.display = "none";
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
  listElement.innerHTML = subtasks.map(createSubtaskHtml).join("");
}


/**
 * Deletes a subtask from the list based on the event triggered by the user.
 * @param {Event} event - The event object triggered by the user action.
 * @returns {void}
 */

function deleteSubtask(event) {
   // Find the closest list item element containing the subtask
  const liElement = event.target.closest("li");
   // If no list item element is found, return without further action
  if (!liElement) return;
   // Find the span element within the list item
  const span = liElement.querySelector("span");
  // Extract the text content of the span element and trim any leading/trailing whitespace
  const editedText = span.textContent.trim();
   // Find the index of the subtask text within the `subtasks` array
  const index = subtasks.indexOf(editedText);
  // If the subtask is found in the array, remove it
  if (index !== -1) {
    subtasks.splice(index, 1);
  }
// Remove the list item element from the DOM
  liElement.remove();
   // Update the subtask list display
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
