// DRAG AND DROP

/**
 * Initiates the dragging process for a task.
 * @param {string} id - The ID of the task being dragged.
 */
function startDragging(id) {
  draggedItemId = id;
  const item = document.getElementById(draggedItemId);
  item.addEventListener("dragend", clearHighlights);
}

/**
 * Allows a dragged item to be dropped on a droppable element.
 * @param {Event} event - The drag event.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Moves a dragged task to a specified column.
 * @param {string} columnId - The ID of the column where the task is dropped.
 */
function moveTo(columnId) {
  if (draggedItemId) {
    const item = document.getElementById(draggedItemId);
    document.getElementById(columnId).appendChild(item);

    const task = tasks.find(
      (t) => t.id.toString() === draggedItemId.toString()
    );
    if (task) {
      task.status = columnId;
      saveTasksToStorage();
    }
    draggedItemId = null;
    clearHighlights();
  }
}

/**
 * Highlights a column to indicate it's a valid drop target.
 * @param {string} columnId - The ID of the column to be highlighted.
 */
function highlight(columnId) {
  document.getElementById(columnId).style.background = "#f0f0f0";
}

/**
 * Removes highlight from a column.
 * @param {string} columnId - The ID of the column to remove highlight from.
 */
function removeHighlight(columnId) {
  document.getElementById(columnId).style.background = "";
}

/**
 * Clears highlights from all columns.
 */
function clearHighlights() {
  ["todo", "inProgress", "awaitFeedback", "done"].forEach(removeHighlight);
}

/**
 * Filters tasks based on a search query.
 */
function searchTask() {
  const searchText = document.getElementById("search-Task").value.toLowerCase();
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchText) ||
      task.description.toLowerCase().includes(searchText)
  );
  renderFilteredTasks(filteredTasks);
}

/**
 * Renders tasks that match the search filter.
 * @param {Array} filteredTasks - Array of tasks that match the search criteria.
 */

function renderFilteredTasks(filteredTasks) {
  ["todo", "inProgress", "awaitFeedback", "done"].forEach((columnId) => {
    document.getElementById(columnId).innerHTML = "";
  });

  filteredTasks.forEach((task) => {
    const columnId = task.status || "todo";
    addTaskToBoard(task, columnId);
  });
}

// Event listeners for drag and drop functionality and image hover effects.
document.addEventListener("DOMContentLoaded", function () {
  ["todo", "inProgress", "awaitFeedback", "done"].forEach((columnId) => {
    const column = document.getElementById(columnId);
    if (column) {
      column.addEventListener("drop", clearHighlights);
    }
  });

  const imageElements = document.querySelectorAll(".changeableImage");
  imageElements.forEach((imageElement) => {
    imageElement.addEventListener("mouseover", function () {
      this.src = "/img/plus-icon-board-column-blue.svg";
    });

    imageElement.addEventListener("mouseout", function () {
      this.src = "/img/plus-icon-board-column.svg";
    });
  });
});



