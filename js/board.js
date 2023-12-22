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

["todo", "inProgress", "awaitFeedback", "done"].forEach((columnId) => {
  const column = document.getElementById(columnId);
  column.addEventListener("drop", clearHighlights);
});





