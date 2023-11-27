// HTML TEMPLATES

function createTaskHtml(task, backgroundColor) {
  // Überprüfen, ob assignedContactsSVGs ein Array ist und es initialisieren, falls es undefined ist
  const assignedContactsSVGs = Array.isArray(task.assignedContactsSVGs)
    ? task.assignedContactsSVGs
    : [];

  const priorityImageHtml = task.priorityImage
    ? `<img src="${task.priorityImage}" alt="Priority Image">`
    : "";

  // Verwenden von assignedContactsSVGs, das jetzt sicher ein Array ist
  const assignedContactsHtml = assignedContactsSVGs.join("");

  const subtasks = task.subtasks || []; // Fallback auf leeres Array, falls undefined
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.completed
  ).length;
  // Berechnen des Fortschritts für diese spezifische Task
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return `
    <div class="task-small-box" id="${task.id}" draggable="true" ondragstart="startDragging('${task.id}')">
        <div class="task-small-box-content">
            <div class="category">
                <div class="label-small-box" style="background-color: ${backgroundColor};">
                    <span>${task.category}</span>
                </div>
            </div>
            <div>
                <h1>${task.title}</h1>
                <p>${task.description}</p>

              
            </div>
            <div class="progress-subtasks">
                <div class="progress-bar" style="--width: ${progress}"></div>
                <div class="counter-subtasks">${completedSubtasks}/${totalSubtasks} Subtasks</div>
            </div>
            <div class="profilBadges-priority">
               <div class="profil-badges">
                    ${assignedContactsHtml}
                </div>
                <div class="priority-icons">
                    ${priorityImageHtml}
                </div>
            </div>
        </div>
    </div>
  `;
}

function createSubtaskHtml(subtaskText) {
  return `
        <li>
            <span>${subtaskText}
                <div class="editDeleteSubtask">
                    <img src="/img/edit-pen-icon-subtasks.svg" onclick="editSubtask(event)">
                    <img src="/img/divider-icon-subtasks.svg">
                    <img src="/img/delete-icon-subtasks.svg" onclick="deleteSubtask(event)" >
                </div>
                <div class="confirmEditSubtask" style="display: none;">
                    <img src="/img/delete-icon-subtasks.svg" onclick="deleteSubtask(event)" >
                    <img src="/img/divider-icon-subtasks.svg">
                    <img src="/img/check-icon-subtasks.svg" onclick="confirmEditSubtask(event)">
                </div>
            </span>
        </li>
    `;
}
