// CONTACT-LIST IN ADD TASK ON BOARD PAGE
/**
 * Toggles the visibility of the contact list and updates the appearance of the contact input field accordingly.
 */
function toggleContactList() {
  const contactInput = document.getElementById("idTitleSelectContactsAddTask");
  const contactList = document.querySelector(".listSelectableContacts");
  const addedContactsContainer = document.getElementById("addedContactsProfilBadges");

  if (contactList.style.display === "block") {
    contactList.style.display = "none";
    contactInput.style.background =
      "url(/Join/img/arrow_drop_down.svg) no-repeat scroll right";
    addedContactsContainer.style.display = "flex";
  } else {
    contactList.style.display = "block";
    contactInput.style.background =
      "url(/Join/img/arrow_drop_up.svg) no-repeat scroll right";
    addedContactsContainer.style.display = "none";    
  }
}

/**
 * Event listener to handle clicks outside the contact input and contact list.
 * If a click occurs outside these elements, it hides the contact list and updates the appearance of the contact input field.
 * @param {MouseEvent} event - The click event object.
 */
window.addEventListener("click", function (event) {
  const contactInput = document.getElementById("idTitleSelectContactsAddTask");
  const contactList = document.querySelector(".listSelectableContacts");

  if (contactInput && contactList) {
    if (
      !contactInput.contains(event.target) &&
      !contactList.contains(event.target)
    ) {
      contactList.style.display = "none";
      contactInput.style.background =
        "url(/Join/img/arrow_drop_down.svg) no-repeat scroll right";
      document.getElementById("addedContactsProfilBadges").style.display = "flex";
    }
  }
});

/**
 * Adds or removes a contact from the task based on its current selection state.
 * @param {Event} event - The event object representing the click event.
 */
function addContactToTask(event) {
  const contactLine = event.currentTarget;
  if (contactLine.classList.contains("selected")) {
    removeContactFromTask(contactLine);
  } else {
    addedContactToTask(contactLine);
  }
  updateAddedContactsDisplay();
}

/**
 * Marks a contact line as selected and adds it to the task.
 * @param {HTMLElement} contactLine - The HTML element representing the contact line.
 */
function addedContactToTask(contactLine) {
  contactLine.style.backgroundColor = "#091931";
  contactLine.querySelector(".contact-name").style.color = "white";
  const imgElement = contactLine.querySelector("img");
  imgElement.src = "/Join/img/check-button-checked-white.svg";
  contactLine.classList.add("selected");
  selectedContacts.push(contactLine);
}

/**
 * Removes a contact line from the task and deselects it.
 * @param {HTMLElement} contactLine - The HTML element representing the contact line.
 */
function removeContactFromTask(contactLine) {
  contactLine.style.backgroundColor = "";
  contactLine.querySelector(".contact-name").style.color = "";
  const imgElement = contactLine.querySelector("img");
  imgElement.src = "/Join/img/check-button-default.svg";
  contactLine.classList.remove("selected");
  selectedContacts = selectedContacts.filter(
    (contact) => contact !== contactLine
  );
}

/**
 * Updates the display of added contacts by rendering their initials as badges.
 */
function updateAddedContactsDisplay() {
  const addedContactsContainer = document.querySelector(
    ".addedContactsProfilBadges");
  if (addedContactsContainer) {
    addedContactsContainer.innerHTML = ""; 
    selectedContacts.forEach((contact) => { 
      const name = contact.querySelector(".contact-name").textContent; const firstLetter = getFirstLetter(name);
      const initialColor = getLetterColor(firstLetter); const initials = getInitials(name);
      const badgeElement = document.createElement("div");
      badgeElement.className = "initial"; badgeElement.style.backgroundColor = initialColor;
      badgeElement.textContent = initials;
      addedContactsContainer.appendChild(badgeElement);});  
    addedContactsContainer.style.display = selectedContacts.length > 0 ? "flex" : "none";
  }
}
/**
 * Adds click event listeners to each contact line, triggering the addition of the contact to a task when clicked.
 */
document.addEventListener("DOMContentLoaded", function () {
  const contactLines = document.querySelectorAll(".contact-line");
  contactLines.forEach((line) => {
    line.addEventListener("click", addContactToTask);
  });
});

/**
 * Loads contacts for the form and populates the selectable contacts list.
 * Retrieves contact data from local storage and renders each contact as a selectable option.
 */
function loadContactsForForm() {
  const listSelectableContacts = document.getElementById("listSelectableContacts");
  if (listSelectableContacts) {
    const ulElement = listSelectableContacts.querySelector("ul");
    const contacts = JSON.parse(localStorage.getItem("contacts")) || {
      names: [], emails: [],phones: [],}
    ulElement.innerHTML = "";
    contacts.names.forEach((name) => {const initials = getInitials(name);
      const firstLetter = getFirstLetter(name); const initialColor = getLetterColor(firstLetter);
      const liElement = document.createElement("li");
      liElement.className = "contact-line"; liElement.innerHTML = loadContactsForFormHtmlTemplate(
     name, initials, initialColor); ulElement.appendChild(liElement);});
    addEventListenersToContactLines();
  }
}

/**
 * Adds event listeners to each contact line element.
 * When a contact line is clicked, it triggers the `addContactToTask` function.
 */
function addEventListenersToContactLines() {
  const contactLines = document.querySelectorAll(".contact-line");
  contactLines.forEach((line) => {
    line.addEventListener("click", addContactToTask);
  });
}

/**
 * Adds an event listener to the `DOMContentLoaded` event.
 * When the DOM content is loaded, it triggers the `loadContactsForForm` function.
 */
document.addEventListener("DOMContentLoaded", function () {
  loadContactsForForm();
});

/**
 * Searches contacts based on the input text and renders filtered contacts.
 */
function searchContacts() {
  const searchText = document
    .getElementById("idTitleSelectContactsAddTask")
    .value.toLowerCase();
  const contacts = JSON.parse(localStorage.getItem("contacts")) || {
    names: [], emails: [], phones: [],};
  const filteredContacts = contacts.names.filter((name) =>
    name.toLowerCase().includes(searchText));
  renderFilteredContacts(filteredContacts);
}

/**
 * Renders filtered contact names by populating the list of selectable contacts with the provided names.
 * @param {string[]} filteredContactNames - The array of filtered contact names.
 */
function renderFilteredContacts(filteredContactNames) {
  const listSelectableContacts = document.getElementById("listSelectableContacts" );
  const ulElement = listSelectableContacts.querySelector("ul");
  ulElement.innerHTML = "";
  filteredContactNames.forEach((name) => {
    const initials = getInitials(name); const firstLetter = getFirstLetter(name);
    const initialColor = getLetterColor(firstLetter); const liElement = document.createElement("li");
    liElement.className = "contact-line";
    liElement.innerHTML = loadContactsForFormHtmlTemplate( name,  initials,  initialColor );
    ulElement.appendChild(liElement);});
  addEventListenersToContactLines();
}


