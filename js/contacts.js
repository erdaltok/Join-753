let names = [];
let emails = [];
let phones = [];
let letterColors = {};


function reload() {
    location.reload();
}


// Funktion zum Erstellen einer neuen Kontaktkarte und Hinzufügen zum AdvanceCard-Bereich.
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
    let initials = getInitials(name);
    let initialColor = getLetterColor(firstLetter);

    newAdvanceCard.innerHTML = `
    <div id="contact" onclick="showCard('${name}', '${email}')" class="contact">
        <div>
          <p style="background-color: ${initialColor};" class="initial">${getInitials(name)}</p>
        </div>
        <div class="initial-text">
          <p>${name}</p>
          <p>${email}</p>
        </div>
      </div>
    `;
    
    if (!existingLetterContainer.contains(newAdvanceCard)) {
        existingLetterContainer.appendChild(newAdvanceCard);
    }
    
    newAdvanceCard.querySelector('.contact').addEventListener('click', function () {
        handleContactClick(this, name, email);
    });
}


// Funktion zum Anzeigen der ausgewählten Kontaktinformationen in der Detailansichtskarte.
function showCard(name, email, phone, index) {
    let initials = getInitials(name);
    let firstLetter = getFirstLetter(name);
    let letterColor = getLetterColor(firstLetter);
    document.getElementById('card').innerHTML = ``;
    document.getElementById('card').innerHTML = `
    <div class="card">
        <div>
        <p  style="background-color: ${letterColor};" class="initial-2">${initials}</p>
        </div>
        <div class = name-div>
          <p class="name">${name}</p>
          <div class="del">
            <div onclick="editContact()" class="edit-delete">
              <img class="edit-del" src="/img/edit.png">
              <p onclick="editContact()" class="edit-del">Edit</p>
            </div>
            <div onclick="deleteContact(${index})" class="edit-delete">
            <img class="edit-del" src="/img/delete.png">     
              <p class="edit-del" onclick="deleteContact(${index})">Delete</p>
            </div>
          </div>
        </div>
      </div>
      <div class="information">
        <p>Contact Information</p>
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


// Funktion zum Abrufen der Hintergrundfarbe basierend auf dem Buchstaben
function getLetterColor(letter) { const colorMap = {'A':'blue','Ä':'cyan','B':'green','C':'red','D':'purple','E':'orange','F':'pink','G':'cyan','H':'brown','I':'teal','J':'yellow','K':'maroon','L':'navy','M':'olive','N':'lime','O':'indigo','Ö':'darkorange','P':'magenta','Q':'tan','R':'slategray','S':'lightcoral','T':'peru','U':'darkorange','Ü':'mediumseagreen','V':'orangered','W':'goldenrod','X':'steelblue','Y':'darkviolet','Z':'gray',}; 
return colorMap[letter.toUpperCase()] || 'gray'; }


// Funktion zum Extrahieren des ersten Buchstabens aus einem Namen für die Kategorisierung.
function getFirstLetter(name) {
    if (name && name.trim() !== '') {
        return name.trim()[0].toUpperCase();
    }
    return 'A';
}


// Funktion zum Aktualisieren des ausgewählten Kontakts und Anzeigen der Detailansicht.
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


// Funktion zum Extrahieren der Initialen aus einem Namen.
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


// Funktion zum Öffnen des Formulars zum Hinzufügen eines neuen Kontakts.
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
            <img id="closeButton" onclick="closeNewContact()" src="/img/close.png">
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
                    <button onclick="closeNewContact()" class="cancel-btn">Cancel &#10006;</button>
                    <button style="position: relative; right: 40px;" class="create-btn">Create contact <img src="/img/check.png" alt=""></button>
                </div>
             </div>
            </form>
        </div>
    </div>
  `;

    saveContactsToLocalStorage();
    updateCloseButtonImage();
    window.addEventListener('resize', updateCloseButtonImage);
}


// Funktion zum Schließen des Formulars zum Hinzufügen eines neuen Kontakts.
function closeNewContact() {
    let openDiv = document.getElementById('newContact');
    openDiv.style.display = 'none';
}


function updateCloseButtonImage() {
    let closeButton = document.getElementById('closeButton');
    if (window.innerWidth <= 1250) {
        closeButton.src = '/img/close-white.png';
    } else {
        closeButton.src = '/img/close.png';
    }
}

updateCloseButtonImage();
window.addEventListener('resize', updateCloseButtonImage);

// Funktion zum Erstellen eines neuen Kontakts basierend auf den Formulareingaben.
function createContact(event) {
    event.preventDefault();
    let nameInput = document.querySelector('.input-fields input[placeholder="Name"]');
    let emailInput = document.querySelector('.input-fields input[placeholder="Email"]');
    let phoneInput = document.querySelector('.input-fields input[placeholder="Phone"]');

    let name = nameInput.value;
    let email = emailInput.value;
    let phone = phoneInput.value;

      // Überprüfe, ob der Kontakt bereits existiert.
      if (names.includes(name)) {
        alert('Der Kontakt existiert bereits.');
        return;
    }

    names.push(name);
    emails.push(email);
    phones.push(phone);

    saveContactsToLocalStorage();
    advanceCard(name, email);
    closeNewContact();
    loadContacts();
    created();
    reload();
}


// Funktion zum Laden der Kontakte aus dem lokalen Speicher, alphabetisch sortieren und Anzeigen im AdvanceCard-Bereich.
function loadContacts() {
    if (localStorage.getItem('contacts')) {
        let storedContacts = JSON.parse(localStorage.getItem('contacts'));
        names = storedContacts.names || [];
        emails = storedContacts.emails || [];
        phones = storedContacts.phones || [];

        // Erstellt ein Array von Objekten, jedes enthält Name, Email und Telefonnummer.
        let contactArray = names.map((name, index) => ({ name, email: emails[index], phone: phones[index] }));

        // Sortiert das Array alphabetisch nach dem Namen.
        contactArray.sort((a, b) => a.name.localeCompare(b.name));

        document.getElementById('advanceCard').innerHTML = '';

        // Iteriert durch das sortierte Array und erstelle die AdvanceCard für jeden Kontakt.
        for (let i = 0; i < contactArray.length; i++) {
            advanceCard(contactArray[i].name, contactArray[i].email);
        }
    } else {
        document.getElementById('advanceCard').innerHTML = 'Keine Kontakte verfügbar.';
    }
}


// Funktion zum Speichern der Kontakte im lokalen Speicher.
function saveContactsToLocalStorage() {
    let contacts = {
        names: names,
        emails: emails,
        phones: phones
    };
    localStorage.setItem('contacts', JSON.stringify(contacts));
}


// Funktion zum Löschen eines ausgewählten Kontakts.
function deleteContact() {
    let selectedContact = document.querySelector('.contact.clicked');

    if (selectedContact) {
        let index = selectedContact.dataset.index;

        // Zugriff auf den Local Storage, um die gespeicherten Kontakte zu erhalten
        let storedContacts = JSON.parse(localStorage.getItem('contacts'));

        if (storedContacts && index >= 0 && index < storedContacts.names.length) {
            // Entferne den Kontakt aus den gespeicherten Daten
            storedContacts.names.splice(index, 1);
            storedContacts.emails.splice(index, 1);
            storedContacts.phones.splice(index, 1);

            // Aktualisiere den Local Storage
            localStorage.setItem('contacts', JSON.stringify(storedContacts));

            // Aktualisiere die Anzeige
            updateContactDisplay();
        }
    }
}


// Funktion zum Aktualisieren der Kontaktanzeige.
function updateContactDisplay() {
    document.getElementById('card').innerHTML = '';

    loadContacts();
}


// Funktion zum Öffnen des Formulars zum Bearbeiten eines Kontakts.
function editContact() {
    let selectedContact = document.querySelector('.contact.clicked');

    if (selectedContact) {
        let index = selectedContact.dataset.index;
        let name = names[index];
        let initials = getInitials(name);
        let firstLetter = getFirstLetter(name);
        let initialColor = getLetterColor(firstLetter);

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
                    <div class="picture" style="background-color: ${initialColor};">
                    <p style="color: white; font-size: 47px; font-weight: 400; line-height: 42px;">${initials}</p>
                </div>
                    </div>
                    <div class="close">
                        <img id="closeButton" onclick="closeEditContact()" src="/img/close.png">
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
                                <button class="cancel-btn" onclick="deleteContact(${index})">Delete &#10006;</button>
                                <button onclick="saveEditedContact(${index}" style="position: relative; right: 40px;" class="create-btn" type="submit">Save <img src="/img/check.png" alt=""></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }
    updateCloseButtonImage();
    window.addEventListener('resize', updateCloseButtonImage);
}


// Funktion zum Speichern der bearbeiteten Kontaktdaten.
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


// Funktion zum Schließen des Formulars zum Bearbeiten eines Kontakts.
function closeEditContact() {
    let openDiv = document.getElementById('editContact');
    openDiv.style.display = 'none';
}


// Funktion zum zeigen einer Erfolgsmeldung, die nach 2 Sekunden automatisch ausgeblendet wird.
function created() {
    let msgBox = document.getElementById('msgBox');
    msgBox.innerHTML = 'Contact successfully created';
    msgBox.style.display = 'flex';

    setTimeout(function () {
        msgBox.style.display = 'none';
    }, 2000);
} 