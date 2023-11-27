// DRAG AND DROP !!!! PRÜFEN Hintergrund nach dem Absetzen des Tasks in neuer Spalte, bleibt. Muss aber weg... schaue ich später nochmal + Backend fehlt

let draggedItemId = null;

function startDragging(id) {
  draggedItemId = id;
}

function allowDrop(event) {
  event.preventDefault();
}

function moveTo(columnId) {
  if (draggedItemId) {
    const item = document.getElementById(draggedItemId);
    document.getElementById(columnId).appendChild(item);

    const task = tasks.find((t) => t.id === draggedItemId);
    if (task) {
      task.status = columnId;
      saveTask(task);
    }

    draggedItemId = null;
  }
}

function highlight(columnId) {
  document.getElementById(columnId).style.background = "#f0f0f0";
}

function removeHighlight(columnId) {
  document.getElementById(columnId).style.background = "";
}
