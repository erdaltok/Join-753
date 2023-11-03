function initPage() {
  loadTemplate("summary", "mainContent");
}

async function loadTemplate(templateName, targetElementId) {
  let targetElement = document.getElementById(targetElementId);

  try {
    let response = await fetch(`/template/${templateName}_template.html`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.text();
    targetElement.innerHTML = data;
  } catch (error) {
    console.error("Ein Fehler ist aufgetreten:", error);
  }
}

function displayContentTemplates(templateName) {
  document.getElementById("desktopTemplate").style.display = "block";
  loadTemplate(templateName, "mainContent");
}

function showSummary() {
  displayContentTemplates("summary");
}

function showBoard() {
  displayContentTemplates("board");
}

function showAddTasks() {
  displayContentTemplates("addTask");
}

function showContacts() {
  displayContentTemplates("contacts");
}



// let tasks = [
//   {
//     id: 0,
//     title: "Task 1",
//     category: "todo",
//   },
//   {
//     id: 1,
//     title: "Task 2",
//     category: "inProgress",
//   },
//   {
//     id: 2,
//     title: "Task 3",
//     category: "awaitFeedback",
//   },
//   {
//     id: 3,
//     title: "Task 4",
//     category: "done",
//   },
// ];

// let currentDraggedElement;

// function updateHTML() {
//   const categories = ["todo", "inProgress", "awaitFeedback", "done"];
//   categories.forEach((category) => {
//     let filteredTasks = tasks.filter((task) => task.category === category);
//     document.getElementById(category).innerHTML = "";
//     filteredTasks.forEach((task) => {
//       document.getElementById(category).innerHTML += generateTaskHTML(task);
//     });
//   });
// }

// function startDragging(id) {
//   // Finden Sie die Aufgabe, die verschoben wird, und setzen Sie currentDraggedElement auf das Task-Objekt
//   currentDraggedElement = tasks.find((task) => task.id === id);
// }

// function generateTaskHTML(task) {
//   // Verwenden Sie die Aufgaben-ID, um die startDragging-Funktion aufzurufen
//   return `<div draggable="true" ondragstart="startDragging(${task.id})" class="task">${task.title}</div>`;
// }


// function allowDrop(ev) {
//   ev.preventDefault();
// }

// function moveTo(category, ev) {
//   ev.preventDefault();
//   if (currentDraggedElement) {
//     // Setzen Sie die Kategorie der aktuellen gezogenen Aufgabe
//     currentDraggedElement.category = category;
//     updateHTML();
//   } else {
//     console.error("Kein gültiges gezogenes Element gefunden");
//   }
// }

// function highlight(id) {
//   document.getElementById(id).classList.add("highlight");
// }

// function removeHighlight(id) {
//   document.getElementById(id).classList.remove("highlight");
// }

// // Initial update on page load
// document.addEventListener("DOMContentLoaded", updateHTML);








