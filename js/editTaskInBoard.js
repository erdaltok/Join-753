// Formular für edit
function toggleDisplayForEdit() {
  const container = document.getElementById("editTaskBoxContainer");
  const form = document.getElementById("editTask");
  const displayArea = document.getElementById("editTaskDisplay");
  const bigTaskBoxContainer = document.getElementById("bigTaskBoxContainer");

  if (container && form && displayArea && bigTaskBoxContainer) {
    container.style.display = "block";
    displayArea.appendChild(form);
    bigTaskBoxContainer.style.display = "none";
    // updateCssClassesForEdit();
  }
}

function showCurrentValuesFromTask(currentTask) {
  document.getElementById("idTitleInputAddTask").value = currentTask.title;
  document.getElementById("idDescriptionAddTask").value =
    currentTask.description;
  updateSelectedContactsForTask(currentTask);
  document.getElementById("idTitleDateAddTask").value = formatDueDateForInput(
    currentTask.dueDate
  );
  setActivePriorityButton(currentTask.priority);

  const categorySelect = document.getElementById("idSelectCategoryAddTask");
  if (categorySelect) {
    categorySelect.value = currentTask.category;
    subtasks = currentTask.subtasks.map((subtask) => subtask.text);
    updateSubtaskList();
  }
}

function hideUnneededItems() {
  const requiredFooter = document.querySelector(".requiredFooter");
  const clearButton = document.querySelector(".footerButtonClear");

  if (requiredFooter) requiredFooter.style.display = "none";
  if (clearButton) clearButton.style.display = "none";
}

function showEditButton() {
  const createTaskButton = document.querySelector(".footerButtonCreateTask");
  const editTaskButton = document.querySelector(".footerEditTask");

  if (createTaskButton && editTaskButton) {
    createTaskButton.style.display = "none";
    editTaskButton.style.display = "flex";
  }
}

function editBigBoxTask() {
  const editFooter = document.querySelector(".editBigBoxFooter");
  if (editFooter) {
    editFooter.addEventListener("click", function () {
      toggleDisplayForEdit();

      const currentTask = tasks.find(
        (task) => task.id.toString() === currentTaskId
      );
      if (currentTask) {
        showCurrentValuesFromTask(currentTask);
      }

      hideUnneededItems();
      showEditButton();
    });
  }
}

function commitEditTask() {
  const editTaskButton = document.querySelector(".footerEditTask");
  if (editTaskButton) {
    editTaskButton.addEventListener("click", async function () {
      await saveUpdatedTask();
      const editTaskBoxContainer = document.getElementById(
        "editTaskBoxContainer"
      );
      const bigTaskBoxContainer = document.getElementById(
        "bigTaskBoxContainer"
      );
      if (editTaskBoxContainer && bigTaskBoxContainer) {
        editTaskBoxContainer.style.display = "none";
        const currentTask = tasks.find(
          (task) => task.id.toString() === currentTaskId
        );
        if (currentTask) {
          const subtasksHtml = createSubtasksHtml(
            currentTask.subtasks,
            currentTaskId
          );
          const bigTaskBoxHtml = showBigTaskPopupHtmlTemplate(
            currentTask,
            subtasksHtml
          );
          bigTaskBoxContainer.innerHTML = bigTaskBoxHtml;
          bigTaskBoxContainer.style.display = "block";
        }
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  commitEditTask();
  editBigBoxTask();
});

async function saveUpdatedTask() {
  const currentTaskIndex = tasks.findIndex(
    (task) => task.id.toString() === currentTaskId
  );
  if (currentTaskIndex !== -1) {
    const updatedTaskData = getFormData();
    tasks[currentTaskIndex] = {
      ...tasks[currentTaskIndex],
      ...updatedTaskData,
    };

    await saveTasksToStorage();
  } else {
    console.error(
      "Task mit der ID " + currentTaskId + " wurde nicht gefunden."
    );
  }
}

function updateSelectedContactsForTask(task) {
  selectedContacts = [];

  const contactLines = document.querySelectorAll(".contact-line");
  contactLines.forEach((line) => {
    const contactName = line.querySelector(".contact-name").textContent;
    if (
      task.assignedContactsBadges.some(
        (contact) => contact.name === contactName
      )
    ) {
      addedContactToTask(line);
    } else {
      removeContactFromTask(line);
    }
  });
  updateAddedContactsDisplay();
}

function formatDueDateForInput(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function setActivePriorityButton(priority) {
  resetAllButtons();

  let buttonId;
  switch (priority) {
    case "Urgent":
      buttonId = "urgentButton";
      break;
    case "Medium":
      buttonId = "mediumButton";
      break;
    case "Low":
      buttonId = "lowButton";
      break;
    default:
      return;
  }

  const buttonToActivate = document.getElementById(buttonId);
  if (buttonToActivate) {
    SelectedButtonStyle(buttonToActivate);
  }
}

// function closeAddTaskForm() {
//     document.getElementById("editTaskBoxContainer").style.display = "none";
//     location.reload();
// }

// function updateCssClassesForEdit() {
//   updateClass("titlePositionLittle", "editTitle");
//   updateClass("formLeftAndRightFlex", "editLeftAndRight");
//   updateClass("dividerLittle", "editHideDivider");
//   updateClass("addTaskLeftLittle", "editLeft");
//   updateClass("titleDateAddTaskBoard", "editDate");
//   updateClass("addTaskRightLittle", "editRight");
//   updateClass("addTaskPopUp", "editPopUp");
//   updateClass("formFooter", "editFooter");
// }

// function updateClass(oldClass, newClass) {
//   const elements = document.querySelectorAll(`.${oldClass}`);
//   elements.forEach((element) => {
//     element.classList.remove(oldClass);
//     element.classList.add(newClass);
//   });
// }

