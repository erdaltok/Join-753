// CONTACT-LIST IN ADD TASK ON BOARD PAGE
function toggleContactList() {
  const contactInput = document.getElementById("idTitleSelectContactsAddTask");
  const contactList = document.querySelector(".listSelectableContacts");
  const addedContactsContainer = document.getElementById(
    "addedContactsProfilBadges"
  );

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
  const contactList = document.querySelector(".listSelectableContacts");

  if (contactInput && contactList) {
    if (
      !contactInput.contains(event.target) &&
      !contactList.contains(event.target)
    ) {
      contactList.style.display = "none";
      contactInput.style.background =
        "url(/img/arrow_drop_down.svg) no-repeat scroll right";
      document.getElementById("addedContactsProfilBadges").style.display =
        "block";
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
  const addedContactsContainer = document.getElementById(
    "addedContactsProfilBadges"
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
