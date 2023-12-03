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
