// POPUP BIG TASK IN BOARD
function createSubtasksHtml(subtasks, taskId) {
  return subtasks
    .map(
      (subtask, index) => `
    <div class="subtaskBigBoxContent" data-index="${index}" onclick="toggleSubtaskStatus('${taskId}', ${index})">
      <img src="/img/${
        subtask.completed
          ? "check-button-checked-bigTask"
          : "check-button-default"
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

function showBigTaskBox(taskId) {
  console.log("showBigTaskBox, taskId:", taskId);
  currentTaskId = taskId;
  const task = tasks.find((t) => t.id.toString() === taskId);
  if (!task) return;

  task.assignedContactsSVGs = task.assignedContactsSVGs || [];
  task.subtasks = task.subtasks || [];

  const subtasksHtml = createSubtasksHtml(task.subtasks, taskId); 
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
  console.log("deleteBigTaskBox, currentTaskId:", currentTaskId);
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
