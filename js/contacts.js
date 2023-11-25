let names = [];
let emails = [];
let phones = [];


function showCard(name, email, phone, index) {
    let initials = getInitials(name);
    document.getElementById('card').innerHTML = ``;
    document.getElementById('card').innerHTML = `
      <div class="card">
        <div>
        <p class="initial-2">${initials}</p>
        </div>
        <div style="line-height: 0.1;">
          <h3 class="name">${name}</h3>
          <div class="del">
            <div class="edit-delete">
              <img style="cursor: default;" class="edit-del" src="/img/edit.png">
              <p onclick="editContact()" class="edit-del">Edit</p>
            </div>
            <div class="edit-delete">
              <img style="cursor: default;" class="edit-del" src="/img/delete.png">
              <p class="edit-del" onclick="deleteContact(${index})">Delete</p>
            </div>
          </div>
        </div>
      </div>
      <div class="information">
        <p>Kontaktinformationen</p>
      </div>
      <div class="info">
        <p class="info-1">E-Mail</p>
        <a class="info-2" href="mailto:${email}">${email}</a>
        <p class="info-1">Telefon</p>
        <a class="info-2" href="tel:${phone}">${phone}</a>
      </div>
    `;

    saveContactsToLocalStorage();
}


function advanceCard(name, email) {
    let firstLetter = getFirstLetter(name);
    let advanceCardContainer = document.getElementById('advanceCard');
    let existingLetterContainer = document.querySelector(`.letter-container[data-letter='${firstLetter}']`);

    if (!existingLetterContainer) {
        existingLetterContainer = document.createElement('div');
        existingLetterContainer.className = 'letter-container';
        existingLetterContainer.dataset.letter = firstLetter;

        existingLetterContainer.innerHTML = `
            <div>
                <p class="initial-letter">${firstLetter}</p>
                <div class="line"></div>
            </div>
        `;

        advanceCardContainer.appendChild(existingLetterContainer);
    }

    let newAdvanceCard = document.createElement('div');
    newAdvanceCard.innerHTML = `
      <div id="contact" showCard('${name}', '${email}');" class="contact">
        <div>
          <p class="initial">${getInitials(name)}</p>
        </div>
        <div class="initial-text">
          <p>${name}</p>
          <p>${email}</p>
        </div>
      </div>
    `;

    existingLetterContainer.appendChild(newAdvanceCard);

    newAdvanceCard.querySelector('.contact').addEventListener('click', function () {
        handleContactClick(this, name, email);
    });

    deleteContact();
}


function getFirstLetter(name) {
    if (name && name.trim() !== '') {
        return name.trim()[0].toUpperCase();
    }
    return 'A';
}


function handleContactClick(clickedContact, name, email) {
    let allContactElements = document.getElementsByClassName('contact');
    for (let element of allContactElements) {
        element.classList.remove('clicked');
    }

    clickedContact.classList.add('clicked');

    let index = names.indexOf(name);
    clickedContact.dataset.index = index;

    showCard(name, email, phones[index]);
}


function getInitials(name) {
    if (name && name.trim() !== '') {
        let splitName = name.split(' ');
        let initials = '';
        for (let i = 0; i < splitName.length; i++) {
            initials += splitName[i][0].toUpperCase();
        }
        return initials;
    }
    return '';
}


function newContact() {
    let openDiv = document.getElementById('newContact');
    openDiv.style.display = 'flex';
    openDiv.innerHTML = `
    <div class="div-container">
        <div class="new-card">
            <img src="/img/icon2.png">
            <h1 class="new-text">Add contact</h1>
            <p class="new-text-2">Tasks are better with a team</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="88" height="3" viewBox="0 0 3 3" fill="none"
                style="width: 88px; height: 3px;">
                <path d="M2 2V61" stroke="#29ABE2" stroke-width="88" stroke-linecap="round" />
            </svg>
        </div>
        <div class=" div-input">
            <div class="picture-div">
                <div class="picture">
                    <img style="width: 42px; height: 42px;" src="/img/person (1).png">
                </div>
            </div>
            <div class="close">
                <img onclick="closeNewContact()" src="/img/close.png">
            </div>
            <form onsubmit="createContact(event)">
             <div class="div-input-fields">
                <div class="input-fields">
                    <input class="input" required type="text" placeholder="Name">
                    <img src="/img/person.png" alt="icon" style="width: 24; height: 24;">
                </div>
                <div class="input-fields">
                    <input class="input" required type="email" placeholder="Email">
                    <img src="/img/mail.png" alt="icon" class="icon-1">
                </div>
                <div class="input-fields">
                    <input class="input" required type="phone" placeholder="Phone">
                    <img src="/img/call.png" alt="icon" class="icon-2">
                </div>
                <div class="buttons">
                    <button onclick="closeNewContact()" class="cancel-btn">Cancel <img src="/img/cencel.png" alt=""></button>
                    <button style="position: relative; right: 40px;" class="create-btn">Create contact <img src="/img/check.png" alt=""></button>
                </div>
             </div>
            </form>
        </div>
    </div>
  `;

    saveContactsToLocalStorage();

}


function closeNewContact() {
    let openDiv = document.getElementById('newContact');
    openDiv.style.display = 'none';
}


function createContact(event) {
    event.preventDefault();
    let nameInput = document.querySelector('.input-fields input[placeholder="Name"]');
    let emailInput = document.querySelector('.input-fields input[placeholder="Email"]');
    let phoneInput = document.querySelector('.input-fields input[placeholder="Phone"]');

    let name = nameInput.value;
    let email = emailInput.value;
    let phone = phoneInput.value;

    names.push(name);
    emails.push(email);
    phones.push(phone);

    saveContactsToLocalStorage();
    showCard(name, email, phone);
    advanceCard(name, email);
    closeNewContact();
}

document.addEventListener('DOMContentLoaded', function () {
    loadContacts();
});


function loadContacts() {
    if (localStorage.getItem('contacts')) {
        let storedContacts = JSON.parse(localStorage.getItem('contacts'));
        names = storedContacts.names || [];
        emails = storedContacts.emails || [];
        phones = storedContacts.phones || [];

        document.getElementById('card').innerHTML = '';
        document.getElementById('advanceCard').innerHTML = '';

        for (let i = 0; i < names.length; i++) {
            showCard(names[i], emails[i], phones[i], i);
            advanceCard(names[i], emails[i]);
        }
    }
}


function saveContactsToLocalStorage() {
    let contacts = {
        names: names,
        emails: emails,
        phones: phones
    };
    localStorage.setItem('contacts', JSON.stringify(contacts));
}


function deleteContact() {
    let selectedContact = document.querySelector('.contact.clicked');

    if (selectedContact) {
        let index = selectedContact.dataset.index;

        names.splice(index, 1);
        emails.splice(index, 1);
        phones.splice(index, 1);

        saveContactsToLocalStorage();
        updateContactDisplay();
    }
}


function updateContactDisplay() {
    document.getElementById('card').innerHTML = '';

    loadContacts();
}


function editContact() {
    let selectedContact = document.querySelector('.contact.clicked');

    if (selectedContact) {
        let index = selectedContact.dataset.index;

        let openDiv = document.getElementById('editContact');
        openDiv.style.display = 'flex';
        openDiv.innerHTML = `
            <div class="div-container">
                <div class="new-card">
                    <img src="/img/icon2.png">
                    <h1 class="new-text">Edit contact</h1>
                    <p class="new-text-2">Tasks are better with a team</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="88" height="3" viewBox="0 0 3 3" fill="none"
                        style="width: 88px; height: 3px;">
                        <path d="M2 2V61" stroke="#29ABE2" stroke-width="88" stroke-linecap="round" />
                    </svg>
                </div>
                <div class=" div-input">
                    <div class="picture-div">
                        <div class="picture">
                            <img style="width: 42px; height: 42px;" src="/img/person (1).png">
                        </div>
                    </div>
                    <div class="close">
                        <img onclick="closeEditContact()" src="/img/close.png">
                    </div>
                    <form onsubmit="saveEditedContact(event, ${index})">
                        <div class="div-input-fields">
                            <div class="input-fields">
                                <input class="input" required type="text" placeholder="Name" value="${names[index]}">
                                <img src="/img/person.png" alt="icon" style="width: 24; height: 24;">
                            </div>
                            <div class="input-fields">
                                <input class="input" required type="email" placeholder="Email" value="${emails[index]}">
                                <img src="/img/mail.png" alt="icon" class="icon-1">
                            </div>
                            <div class="input-fields">
                                <input class="input" required type="tel" placeholder="Phone" value="${phones[index]}">
                                <img src="/img/call.png" alt="icon" class="icon-2">
                            </div>
                            <div class="buttons">
                                <button class="cancel-btn" onclick="deleteEditedContact(${index})">Delete <img src="/img/cencel.png" alt=""></button>
                                <button style="position: relative; right: 40px;" class="create-btn" type="submit">Save <img src="/img/check.png" alt=""></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
}


function saveEditedContact(event, index) {
    event.preventDefault();
    let nameInput = document.querySelector('.input-fields input[placeholder="Name"]');
    let emailInput = document.querySelector('.input-fields input[placeholder="Email"]');
    let phoneInput = document.querySelector('.input-fields input[placeholder="Phone"]');

    let newName = nameInput.value;
    let newEmail = emailInput.value;
    let newPhone = phoneInput.value;

    names[index] = newName;
    emails[index] = newEmail;
    phones[index] = newPhone;

    saveContactsToLocalStorage();
    showCard(newName, newEmail, newPhone, index);
    updateContactDisplay();
    closeEditContact();
}


function deleteEditedContact(index) {
    let selectedContact = document.querySelector('.contact.clicked');

    if (selectedContact) {

        names.splice(index, 1);
        emails.splice(index, 1);
        phones.splice(index, 1);

        saveContactsToLocalStorage();
        updateContactDisplay();
        closeEditContact();
    }
}



function closeEditContact() {
    let openDiv = document.getElementById('editContact');
    openDiv.style.display = 'none';
}