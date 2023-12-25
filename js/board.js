// DRAG AND DROP 
function startDragging(id) {
  draggedItemId = id;
  const item = document.getElementById(draggedItemId);
  item.addEventListener("dragend", clearHighlights);
}

function allowDrop(event) {
  event.preventDefault();
}

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

function highlight(columnId) {
  document.getElementById(columnId).style.background = "#f0f0f0";
}

function removeHighlight(columnId) {
  document.getElementById(columnId).style.background = "";
}

function clearHighlights() {
  ["todo", "inProgress", "awaitFeedback", "done"].forEach(removeHighlight);
}

function searchTask() {
  const searchText = document.getElementById("search-Task").value.toLowerCase();
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchText) ||
      task.description.toLowerCase().includes(searchText)
  );

  renderFilteredTasks(filteredTasks);
}

function renderFilteredTasks(filteredTasks) {
  ["todo", "inProgress", "awaitFeedback", "done"].forEach((columnId) => {
    document.getElementById(columnId).innerHTML = "";
  });

  filteredTasks.forEach((task) => {
    const columnId = task.status || "todo";
    addTaskToBoard(task, columnId);
  });
}

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


