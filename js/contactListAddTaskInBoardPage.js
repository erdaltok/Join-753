// CONTACT-LIST IN ADD TASK ON BOARD PAGE
function toggleContactList() {
  const contactInput = document.getElementById("idTitleSelectContactsAddTask");
  const contactList = document.querySelector(".listSelectableContacts");
  const addedContactsContainer = document.getElementById("addedContactsProfilBadges");
  // const hideRequired = document.querySelector(".requiredFooter");

  if (contactList.style.display === "block") {
    contactList.style.display = "none";
    contactInput.style.background =
      "url(/img/arrow_drop_down.svg) no-repeat scroll right";
    addedContactsContainer.style.display = "block";
    hideRequired.style.display = "none"
  } else {
    contactList.style.display = "block";
    contactInput.style.background =
      "url(/img/arrow_drop_up.svg) no-repeat scroll right";
    addedContactsContainer.style.display = "none";
    // hideRequired.style.display = "none";
  }
}


window.addEventListener("click", function (event) {
  const contactInput = document.getElementById("idTitleSelectContactsAddTask");
  const contactList = document.querySelector(".listSelectableContacts");
  // const hideRequired = document.querySelector(".requiredFooter");


  if (contactInput && contactList) {
    if (
      !contactInput.contains(event.target) &&
      !contactList.contains(event.target)
    ) {
      contactList.style.display = "none";
      contactInput.style.background =
        "url(/img/arrow_drop_down.svg) no-repeat scroll right";
      document.getElementById("addedContactsProfilBadges").style.display = "flex";
      // hideRequired.style.display = "block";
    }
  }
});


function addContactToTask(event) {
  const contactLine = event.currentTarget;

  if (contactLine.classList.contains("selected")) {
    removeContactFromTask(contactLine);
  } else {
    addedContactToTask(contactLine);
  }
  updateAddedContactsDisplay();
}

function addedContactToTask(contactLine) {
  contactLine.style.backgroundColor = "#091931";
  contactLine.querySelector(".contact-name").style.color = "white";
  const imgElement = contactLine.querySelector("img");
  imgElement.src = "/img/check-button-checked-white.svg";
  contactLine.classList.add("selected");

  selectedContacts.push(contactLine);
}

function removeContactFromTask(contactLine) {
  contactLine.style.backgroundColor = "";
  contactLine.querySelector(".contact-name").style.color = "";
  const imgElement = contactLine.querySelector("img");
  imgElement.src = "/img/check-button-default.svg";
  contactLine.classList.remove("selected");

  selectedContacts = selectedContacts.filter(
    (contact) => contact !== contactLine
  );
}

function updateAddedContactsDisplay() {
  const addedContactsContainer = document.querySelector(
    ".addedContactsProfilBadges"
  );
  addedContactsContainer.innerHTML = "";
  selectedContacts.forEach((contact) => {
    const name = contact.querySelector(".contact-name").textContent;
    const firstLetter = getFirstLetter(name);
    const initialColor = getLetterColor(firstLetter);
    const initials = getInitials(name);
    const badgeElement = document.createElement("div");
    badgeElement.className = "initial";
    badgeElement.style.backgroundColor = initialColor;
    badgeElement.textContent = initials;
    addedContactsContainer.appendChild(badgeElement);
  });

  addedContactsContainer.style.display =
    selectedContacts.length > 0 ? "flex" : "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const contactLines = document.querySelectorAll(".contact-line");
  contactLines.forEach((line) => {
    line.addEventListener("click", addContactToTask);
  });
});

function loadContactsForForm() {
  const listSelectableContacts = document.getElementById(
    "listSelectableContacts"
  );
  const ulElement = listSelectableContacts.querySelector("ul");
  const contacts = JSON.parse(localStorage.getItem("contacts")) || {
    names: [],
    emails: [],
    phones: [],
  };
  ulElement.innerHTML = "";

  contacts.names.forEach((name) => {
    const initials = getInitials(name);
    const firstLetter = getFirstLetter(name);
    const initialColor = getLetterColor(firstLetter);
    const liElement = document.createElement("li");
    liElement.className = "contact-line";
    liElement.innerHTML = loadContactsForFormHtmlTemplate(
      name,
      initials,
      initialColor
    );
    ulElement.appendChild(liElement);
  });
  addEventListenersToContactLines();
}


function addEventListenersToContactLines() {
  const contactLines = document.querySelectorAll(".contact-line");
  contactLines.forEach((line) => {
    line.addEventListener("click", addContactToTask);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  loadContactsForForm();
});



