// POPUP BIG TASK IN BOARD

/**
 * Displays the big task box for a specific task.
 * @param {string} taskId - The ID of the task to display.
 */
function showBigTaskBox(taskId) {
  currentTaskId = taskId;

  const task = tasks.find((t) => t.id.toString() === taskId);
  if (!task) return;

  const subtasksHtml = createSubtasksHtml(task.subtasks, taskId);
  const bigTaskBoxHtml = showBigTaskPopupHtmlTemplate(task, subtasksHtml);

  const bigTaskBoxContainer = document.getElementById("bigTaskBoxContainer");
  if (bigTaskBoxContainer) {
    bigTaskBoxContainer.innerHTML = bigTaskBoxHtml;
    animatePopupOpen();
    editBigBoxTask();    
  }
}

/**
 * Closes the big task box and performs necessary updates and resets.
 */
function closeBigTaskBox() {
  animatePopupClose(() => {
    saveTasksToStorage();
    renderTasks();
    resetSelectedContacts();
    resetTaskForm(); 
    initPage();
  });
}

/**
 * Event listener for closing the big task box when clicking outside of it.
 */
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    const bigTaskFormPopUp = document.querySelector(".BigTaskFormPopUp");
    const bigTaskPopUp = document.querySelector(".BigTaskPopUp");
    if (bigTaskFormPopUp && bigTaskPopUp) {
      let isClickInsideBigTaskPopUp = bigTaskPopUp.contains(event.target);
      if (
        !isClickInsideBigTaskPopUp &&
        bigTaskFormPopUp.contains(event.target)
      ) {
        closeBigTaskBox();
      }
    }
  });
});

/**
 * Deletes a task from the task list and updates the display.
 */
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

/**
 * Toggles the completion status of a subtask.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask in the task's subtask array.
 */
function toggleSubtaskStatus(taskId, subtaskIndex) {
  const task = tasks.find((t) => t.id.toString() === taskId);
  if (!task || !task.subtasks[subtaskIndex]) return;

  task.subtasks[subtaskIndex].completed =
    !task.subtasks[subtaskIndex].completed;

  const subtaskElement = document.querySelector(
    `.subtaskBigBoxContent[data-index="${subtaskIndex}"]`
  );
  if (subtaskElement) {
    const imgElement = subtaskElement.querySelector("img");
    imgElement.src = task.subtasks[subtaskIndex].completed
      ? "/img/check-button-checked.svg"
      : "/img/check-button-default.svg";
  }
  saveTasksToStorage();
}

/**
 * Generates HTML for displaying assigned contacts in the big task box.
 * @returns {string} - HTML string of assigned contacts.
 */
function getAssignedContactsSVGs() {
  return selectedContacts.map((contact) => {
    const svgHTML = contact.querySelector("svg").outerHTML;
    const contactName = contact.querySelector(".contact-name").textContent;
    return `<li class="contact-line-BigBox">${svgHTML}<span class="contact-name">${contactName}</span></li>`;
  });
}

/**
 * Animates the opening of the big task box.
 */
function animatePopupOpen() {
  const bigTaskBoxContainer = document.getElementById("bigTaskBoxContainer");
  if (bigTaskBoxContainer) {
    const bigTaskPopUp = bigTaskBoxContainer.querySelector(".BigTaskPopUp");
    if (bigTaskPopUp) {
      bigTaskPopUp.classList.add("slide-in");
    }
    bigTaskBoxContainer.style.display = "block";
  }
}

/**
 * Animates the closing of the big task box and executes a callback function after closing.
 * @param {Function} callback - The function to execute after closing the popup.
 */
function animatePopupClose(callback) {
  const bigTaskBox = document.getElementById("BigTaskFormPopUp");
  if (bigTaskBox) {
    const bigTaskPopUp = bigTaskBox.querySelector(".BigTaskPopUp");
    if (bigTaskPopUp) {
      bigTaskPopUp.classList.remove("slide-in");
      bigTaskPopUp.classList.add("slide-out");

      bigTaskPopUp.addEventListener(
        "animationend",
        function () {
          bigTaskBox.style.display = "none";
          if (callback && typeof callback === "function") {
            callback();
          }
        },
        { once: true }
      );
    }
  }
}

/**
 * Sets up event listeners for clear buttons in the task form.
 */
function setupClearButtonListeners() {
  const clearButtons = document.querySelectorAll(".footerButtonClear");
  clearButtons.forEach((button) => {
    button.addEventListener("click", function () {
      resetTaskForm();
    });

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
}

/**
 * Event listener for input events on the document. Triggers contact search when the specific input field is used.
 */
document.addEventListener("input", function (event) {
  if (event.target && event.target.id === "idTitleSelectContactsAddTask") {
    searchContacts();
  }
});


document.addEventListener("DOMContentLoaded", initPage);