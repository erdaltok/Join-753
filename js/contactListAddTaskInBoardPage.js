// CONTACT-LIST IN ADD TASK ON BOARD PAGE
function toggleContactList() {
  const contactInput = document.getElementById("idTitleSelectContactsAddTask");
  // const contactInput = document.querySelector(".inputTitleAddTask");

  const contactList = document.querySelector(".listSelectableContacts");
  const addedContactsContainer = document.getElementById("addedContactsProfilBadges");
  // const addedContactsContainer = document.querySelector(".addedContactsProfilBadges");

  if (contactList.style.display === "block") {
    contactList.style.display = "none";
    contactInput.style.background =
      "url(/img/arrow_drop_down.svg) no-repeat scroll right";
    addedContactsContainer.style.display = "block";
  } else {
    contactList.style.display = "block";
    contactInput.style.background =
      "url(/img/arrow_drop_up.svg) no-repeat scroll right";
    addedContactsContainer.style.display = "none";
  }
}


window.addEventListener("click", function (event) {
  const contactInput = document.getElementById("idTitleSelectContactsAddTask");
  // const contactInput = document.querySelectorAll(".inputTitleAddTask");
  const contactList = document.querySelector(".listSelectableContacts");

  if (contactInput && contactList) {
    if (
      !contactInput.contains(event.target) &&
      !contactList.contains(event.target)
    ) {
      contactList.style.display = "none";
      contactInput.style.background =
        "url(/img/arrow_drop_down.svg) no-repeat scroll right";
      document.getElementById("addedContactsProfilBadges").style.display = "block";
      // document.querySelectorAll(addedContactsProfilBadges).style.display = "block";
    }
  }
});




// function toggleContactList() {
//   const contactInput = document.querySelector("#idTitleSelectContactsAddTask");
//   const contactList = document.querySelector("#listSelectableContacts");
//   const addedContactsContainer = document.querySelector(
//     ".addedContactsProfilBadges"
//   );

//   if (contactList.style.display === "block") {
//     contactList.style.display = "none";
//     contactInput.style.background =
//       "url(/img/arrow_drop_down.svg) no-repeat scroll right";
//     addedContactsContainer.style.display = "block";
//   } else {
//     contactList.style.display = "block";
//     contactInput.style.background =
//       "url(/img/arrow_drop_up.svg) no-repeat scroll right";
//     addedContactsContainer.style.display = "none";
//   }
// }


// document.addEventListener("click", function (event) {
//   const contactInput = document.querySelector("#idTitleSelectContactsAddTask");
//   const contactList = document.querySelector("#listSelectableContacts");
//   const addedContactsContainer = document.querySelector(".addedContactsProfilBadges");

//   if (contactList && contactInput !== event.target && !contactList.contains(event.target)) {
//     contactList.style.display = "none";
//     contactInput.style.background = "url(/img/arrow_drop_down.svg) no-repeat scroll right";
//     addedContactsContainer.style.display = "block";
//   }
// });




// function toggleContactList() {
//   // Kontaktlisten und Input- und Container-Elemente
//   const contactLists = document.querySelectorAll(".listSelectableContacts");
//   const contactInputs = document.querySelectorAll(".inputTitleAddTask");
//   const addedContactsContainers = document.querySelectorAll(
//     ".addedContactsProfilBadges"
//   );

//   
//   contactLists.forEach((contactList, index) => {
//     const contactInput = contactInputs[index];
//     const addedContactsContainer = addedContactsContainers[index];

//     
//     if (contactList.style.display === "block") {
//       contactList.style.display = "none";
//       contactInput.style.background =
//         "url(/img/arrow_drop_down.svg) no-repeat scroll right";
//       if (addedContactsContainer) {
//         addedContactsContainer.style.display = "block";
//       }
//     } else {
//       contactList.style.display = "block";
//       contactInput.style.background =
//         "url(/img/arrow_drop_up.svg) no-repeat scroll right";
//       if (addedContactsContainer) {
//         addedContactsContainer.style.display = "none";
//       }
//     }
//   });
// }

// // Event-Listener für das Dokument, um die Kontaktliste zu schließen, wenn außerhalb geklickt wird
// document.addEventListener("click", function (event) {
//   const contactLists = document.querySelectorAll(".listSelectableContacts");
//   const contactInputs = document.querySelectorAll(".inputTitleAddTask");

//   contactLists.forEach((contactList, index) => {
//     const contactInput = contactInputs[index];
//     if (
//       contactList.style.display === "block" &&
//       !contactList.contains(event.target) &&
//       !contactInput.contains(event.target)
//     ) {
//       contactList.style.display = "none";
//       contactInput.style.background =
//         "url(/img/arrow_drop_down.svg) no-repeat scroll right";
//     }
//   });
// });













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
  // const addedContactsContainer = document.getElementById("addedContactsProfilBadges");
   const addedContactsContainer = document.querySelector(
     ".addedContactsProfilBadges"
   );

  addedContactsContainer.innerHTML = "";
  selectedContacts.forEach((contact) => {
    const svgElement = contact.querySelector("svg").cloneNode(true);
    addedContactsContainer.appendChild(svgElement);
  });

  addedContactsContainer.style.display =
    selectedContacts.length > 0 ? "block" : "none";
}

document.addEventListener("DOMContentLoaded", function () {
  const contactLines = document.querySelectorAll(".contact-line");
  contactLines.forEach((line) => {
    line.addEventListener("click", addContactToTask);
  });
});

function loadContactsForForm() {
  const listSelectableContacts = document.getElementById("listSelectableContacts");
  // const listSelectableContacts = document.querySelector(".listSelectableContacts");
  

  const ulElement = listSelectableContacts.querySelector("ul");
  const contacts = JSON.parse(localStorage.getItem("contacts")) || {
    names: [],
    emails: [],
    phones: [],
  };
  ulElement.innerHTML = "";

  contacts.names.forEach((name) => {
    const initials = getInitials(name);
    const liElement = document.createElement("li");
    liElement.className = "contact-line";
    liElement.innerHTML = loadContactsForFormHtmlTemplate(name, initials);
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






// function loadContactsForForm() {
//   const listSelectableContacts = document.querySelector(
//     "#listSelectableContacts"
//   );
//   const ulElement = listSelectableContacts.querySelector("ul");
//   const contacts = JSON.parse(localStorage.getItem("contacts")) || {
//     names: [],
//     emails: [],
//     phones: [],
//   };
//   ulElement.innerHTML = "";

//   contacts.names.forEach((name) => {
//     const initials = getInitials(name);
//     const liElement = document.createElement("li");
//     liElement.className = "contact-line";
//     liElement.innerHTML = loadContactsForFormHtmlTemplate(name, initials);
//     ulElement.appendChild(liElement);
//   });

//   addEventListenersToContactLines();
// }

// function addEventListenersToContactLines() {
//   const contactLines = document.querySelectorAll(
//     "#listSelectableContacts .contact-line"
//   );
//   contactLines.forEach((line) => {
//     line.addEventListener("click", addContactToTask);
//   });
// }

// document.addEventListener("DOMContentLoaded", function () {
//   loadContactsForForm();
// });

// function loadContactsForForm() {
//   const listSelectableContactsElements = document.querySelectorAll(
//     ".listSelectableContacts"
//   );
//   const contacts = JSON.parse(localStorage.getItem("contacts")) || {
//     names: [],
//     emails: [],
//     phones: [],
//   };

//   listSelectableContactsElements.forEach((listSelectableContacts) => {
//     const ulElement = listSelectableContacts.querySelector("ul");
//     ulElement.innerHTML = "";

//     contacts.names.forEach((name) => {
//       const initials = getInitials(name);
//       const liElement = document.createElement("li");
//       liElement.className = "contact-line";
//       liElement.innerHTML = loadContactsForFormHtmlTemplate(name, initials);
//       ulElement.appendChild(liElement);
//     });
//   });

//   addEventListenersToContactLines();
// }

// function addEventListenersToContactLines() {
//   const contactLines = document.querySelectorAll(
//     ".listSelectableContacts .contact-line"
//   );
//   contactLines.forEach((line) => {
//     line.addEventListener("click", addContactToTask);
//   });
// }

// document.addEventListener("DOMContentLoaded", function () {
//   loadContactsForForm();
// });
