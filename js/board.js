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

    const task = tasks.find(
      (t) => t.id.toString() === draggedItemId.toString()
    );
    if (task) {
      task.status = columnId;
      saveTasksToStorage(); 
    }

    draggedItemId = null;
  }
  // updatePlaceholders();
}

function highlight(columnId) {
  document.getElementById(columnId).style.background = "#f0f0f0";
}

function removeHighlight(columnId) {
  document.getElementById(columnId).style.background = "";
}

// function updatePlaceholders() {
//   const columns = ["todo", "inProgress", "awaitFeedback", "done"];
//   columns.forEach((columnId) => {
//     const column = document.getElementById(columnId);
//     const placeholder = document.querySelector(
//       `.placeholder-tasks-${columnId}`
//     );
//     if (column && placeholder) {
//       const taskCount = Array.from(column.children).filter((child) =>
//         child.classList.contains("task-small-box")
//       ).length;

//       placeholder.style.display = taskCount === 0 ? "flex" : "none";
//     }
//   });
// }





