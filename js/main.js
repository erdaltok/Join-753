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

