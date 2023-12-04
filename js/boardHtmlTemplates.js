// HTML TEMPLATES
function createTaskHtml(task, backgroundColor) {
  const assignedContactsSVGs = Array.isArray(task.assignedContactsSVGs)
    ? extractSVGsFromAssignedContacts(task.assignedContactsSVGs)
    : [];

  const priorityImageHtml = task.priorityImage
    ? `<img src="${task.priorityImage}" alt="Priority Image">`
    : "";

  const assignedContactsHtml = assignedContactsSVGs.join("");

  const subtasks = task.subtasks || [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.completed
  ).length;
  // Berechnen des Fortschritts für Subtasks
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const html = `
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
    return html;
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

function showBigTaskPopupHtmlTemplate(task, subtasksHtml) {
    const assignedContactsHtml =
      task.assignedContactsSVGs.length > 0
        ? `${task.assignedContactsSVGs.join("")}`
            : "<p>No contacts assigned</p>";
    
  return `
    <div class="BigTaskFormPopUp" id="BigTaskFormPopUp">
        <div class="popupFlex">
            <form class="BigTaskPopUp">
                <div class="BigTaskContent">
                    <div class="category">
                        <div class="label-big-box">
                            <span>${task.category}</span>
                            <img src="/img/close-icon-subtasks.svg" onclick="closeBigTaskBox()">
                        </div>
                    </div>

                    <div class="titleAndDescriptionBigBox">
                        <h1>${task.title}</h1>
                        <p>${task.description}</p>
                    </div>

                    <div class="dueDate">
                        <span>Due date:</span>
                        <p>${formatDueDate(task.dueDate)}</p>
                    </div>

                    <div class="priorityBigBox">
                        <span>Priority:</span>
                        <div class="selectedPriorityBigBox">
                            <p>${task.priority}</p>
                            <img src="${task.priorityImage}" alt="">
                        </div>
                    </div>

                    <div class="assignedBigBox">
                        <span>Assigned To:</span>
                        <div class="listSelectableContactsBigBox">
                            <ul>
                              <li class="contact-line-BigBox">
                                ${assignedContactsHtml}
                                   

                              </li>
                            </ul>
                        </div>
                    </div>

                    <div class="subtasksBigBox">
                        <span>Subtasks:</span>
                        <div class="addedSubstaskList">
                            ${subtasksHtml}
                        </div>
                    </div>
                    
                    <div class="footerBigBox">
                        <div class="deleteBigBoxFooter" onclick="deleteBigTaskBox()">
                            <img src="/img/delete-icon-subtasks.svg">
                            <span>Delete</span>
                        </div>
                        <img src="/img/divider-icon-subtasks.svg" alt="">
                        <div class="editBigBoxFooter">
                            <img src="/img/edit-pen-icon-subtasks.svg">
                            <span>Edit</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
  `;
}


function loadContactsForFormHtmlTemplate(name, initials) {
  return `
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15.5" fill="#1FD7C1" stroke="white" />
      <text x="16" y="16" alignment-baseline="central" text-anchor="middle" fill="white">${initials}</text>
    </svg>
    <span class="contact-name">${name}</span>
    <img src="/img/check-button-default.svg" alt="">
  `;
}
