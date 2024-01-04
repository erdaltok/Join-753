// CONTACT-LIST IN ADD TASK ON BOARD PAGE
function toggleContactList() {
  const contactInput = document.getElementById("idTitleSelectContactsAddTask");
  const contactList = document.querySelector(".listSelectableContacts");
  const addedContactsContainer = document.getElementById("addedContactsProfilBadges");
<<<<<<< HEAD
  const hideRequired = document.querySelector(".requiredFooter");
=======
  // const hideRequired = document.querySelector(".requiredFooter");
>>>>>>> f17084f5985f5787d12ce115d6fe38469550ade5

  if (contactList.style.display === "block") {
    contactList.style.display = "none";
    contactInput.style.background =
      "url(/img/arrow_drop_down.svg) no-repeat scroll right";
    addedContactsContainer.style.display = "block";
<<<<<<< HEAD
    hideRequired.style.display = "none"
=======
    // hideRequired.style.display = "none"
>>>>>>> f17084f5985f5787d12ce115d6fe38469550ade5
  } else {
    contactList.style.display = "block";
    contactInput.style.background =
      "url(/img/arrow_drop_up.svg) no-repeat scroll right";
    addedContactsContainer.style.display = "none";
<<<<<<< HEAD
    hideRequired.style.display = "none";
=======
    // hideRequired.style.display = "none";
>>>>>>> f17084f5985f5787d12ce115d6fe38469550ade5
  }
}


window.addEventListener("click", function (event) {
  const contactInput = document.getElementById("idTitleSelectContactsAddTask");
  const contactList = document.querySelector(".listSelectableContacts");
<<<<<<< HEAD
  const hideRequired = document.querySelector(".requiredFooter");
=======
  // const hideRequired = document.querySelector(".requiredFooter");
>>>>>>> f17084f5985f5787d12ce115d6fe38469550ade5


  if (contactInput && contactList) {
    if (
      !contactInput.contains(event.target) &&
      !contactList.contains(event.target)
    ) {
      contactList.style.display = "none";
      contactInput.style.background =
        "url(/img/arrow_drop_down.svg) no-repeat scroll right";
      document.getElementById("addedContactsProfilBadges").style.display = "flex";
<<<<<<< HEAD
      hideRequired.style.display = "block";
=======
      // hideRequired.style.display = "block";
>>>>>>> f17084f5985f5787d12ce115d6fe38469550ade5
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
  if (addedContactsContainer) {
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
}

// function updateAddedContactsDisplay() {
//   // Überprüfen, ob das Element existiert, bevor es aktualisiert wird
//   const addedContactsContainer = document.querySelector(
//     ".addedContactsProfilBadges"
//   );
//   if (!addedContactsContainer) {
//     console.error("Element .addedContactsProfilBadges wurde nicht gefunden.");
//     return;
//   }

//   addedContactsContainer.innerHTML = "";
//   selectedContacts.forEach((contact) => {
//     const name = contact.querySelector(".contact-name").textContent;
//     const firstLetter = getFirstLetter(name);
//     const initialColor = getLetterColor(firstLetter);
//     const initials = getInitials(name);
//     const badgeElement = document.createElement("div");
//     badgeElement.className = "initial";
//     badgeElement.style.backgroundColor = initialColor;
//     badgeElement.textContent = initials;
//     addedContactsContainer.appendChild(badgeElement);
//   });

//   addedContactsContainer.style.display =
//     selectedContacts.length > 0 ? "flex" : "none";
// }





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
  if (listSelectableContacts) {
    const ulElement = listSelectableContacts.querySelector("ul");
    const contacts = JSON.parse(localStorage.getItem("contacts")) || {
      names: [],
      emails: [],
      phones: [],
    }
  

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

// // Hilfsfunktion 
// document.addEventListener("click", function (event) {
//   console.log("Angeklicktes Element:", event.target);
// });




function searchContacts() {
  const searchText = document
    .getElementById("idTitleSelectContactsAddTask")
    .value.toLowerCase();
  const contacts = JSON.parse(localStorage.getItem("contacts")) || {
    names: [],
    emails: [],
    phones: [],
  };

  const filteredContacts = contacts.names.filter((name) =>
    name.toLowerCase().includes(searchText)
  );

  renderFilteredContacts(filteredContacts);
}

function renderFilteredContacts(filteredContactNames) {
  const listSelectableContacts = document.getElementById(
    "listSelectableContacts"
  );
  const ulElement = listSelectableContacts.querySelector("ul");
  ulElement.innerHTML = "";

  filteredContactNames.forEach((name) => {
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

document.addEventListener("DOMContentLoaded", function () {
  loadContactsForForm();

  const searchInput = document.getElementById("idTitleSelectContactsAddTask");
  if (searchInput) {
    searchInput.addEventListener("input", searchContacts);
  }
});

