let contactsLocal = []; //Stores all contacts from storage
let selectedContact = ""; //Contains the email of selected contact
let names = [];// List of names
let emails = [];//List of Emails
let phones = [];//List of Phone numbers
let letterColors = {};//List of Colors
/**
 * Reloads the current page.
 */
function reload() {
    location.reload();
}
// Funktion zum Erstellen einer neuen Kontaktkarte und Hinzufügen zum AdvanceCard-Bereich.
/**
 * Creates or updates an advance card for a contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function advanceCard(name, email, phone) {
     // Get the first letter of the name
    const firstLetter = name.charAt(0).toUpperCase();
    // Get the container for advance cards
    const advanceCardContainer = document.getElementById('advanceCard');
    // Find or create the container for cards with the same first letter
    let existingLetterContainer = document.querySelector(`.letter-container[data-letter='${firstLetter}']`);
    if (!existingLetterContainer) {
        existingLetterContainer = createLetterContainer(firstLetter);
        advanceCardContainer.appendChild(existingLetterContainer); }
        // Create a new advance card for the contact
    const newAdvanceCard = createNewAdvanceCard(name, email, firstLetter);
    // Append the new advance card to the appropriate letter container
    if (!existingLetterContainer.contains(newAdvanceCard)) {
        existingLetterContainer.appendChild(newAdvanceCard); } 
         // Add event listener to handle contact click
    newAdvanceCard.querySelector('.contact').addEventListener('click', function () {
        handleContactClick(this, name, email, phone);
    });
}
/**
 * Creates a container element for cards associated with a specific letter.
 * @param {string} letter - The letter associated with the container.
 * @returns {HTMLElement} The created letter container element.
 */
function createLetterContainer(letter) {
     // Create the container element
    const letterContainer = document.createElement('div');
    letterContainer.className = 'letter-container';
    letterContainer.dataset.letter = letter;
    letterContainer.innerHTML = `
        <div>
            <p class="initial-letter">${letter}</p>
            <div class="line"></div>
        </div>
    `;
    return letterContainer;
}

/**
 * Creates a new advance card for a contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} firstLetter - The first letter of the contact's name.
 * @returns {HTMLElement} The created advance card element.
 */
function createNewAdvanceCard(name, email, firstLetter) {
    const initials = name.split(" ").map(word => word.charAt(0)).join("").toUpperCase();
    const initialColor = getLetterColor(firstLetter);
    const isSelected = selectedContact === email;
    const clickedClass = isSelected ? 'clicked' : '';
    const newAdvanceCard = document.createElement('div');
    newAdvanceCard.innerHTML = ` <div id="contact" class="contact ${clickedClass}">
            <div>  <p style="background-color: ${initialColor};" class="initial">${initials}</p></div>
            <div class="initial-text">
                <p>${makeNameFirstLetterUppercase(name)}</p>
                <p>${email}</p>
            </div>
        </div>`;
    if (isSelected) {  showCard(name, email, phones); } return newAdvanceCard;// Show the card if it is selected
}
/**
 * Capitalizes the first letter of each word in a given name.
 * @param {string} name - The name to capitalize.
 * @returns {string} The name with the first letter of each word capitalized.
 */
function makeNameFirstLetterUppercase(name) {
    return name.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

/**
 * Draws the contacts list by populating the advance card container with contacts.
 */
function drawContactsList(){ 
    // Clear existing content in the card and advanceCard containers
    document.getElementById('card').innerHTML = '';
    document.getElementById('advanceCard').innerHTML = '';
    // Iterate over the local contacts array and create advance cards for each contact
    for (let i = 0; i < contactsLocal.length; i++) {
        advanceCard(contactsLocal[i].nameKey, contactsLocal[i].emailKey, contactsLocal[i].phoneKey);
    }
}

/**
 * Hides the contact view on mobile devices by setting the display property of the card and contact-view elements to "none".
 */
function hideContactViewMobil(){
    document.getElementById("card").style.display = "none";
    document.getElementById("contact-view").style.display = "none";
    
}
/**
 * Hides the contact view by setting the display property of the card element to "none".
 */
function hideContactView(){
    document.getElementById("card").style.display = "none"; 
}
// Funktion zum Anzeigen der ausgewählten Kontaktinformationen in der Detailansichtskarte.
/**
 * Displays the contact card with the provided name, email, and phone number.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function showCard(name, email, phone) {
    let initials = getInitials(name);  // Get initials, first letter, and letter color
    let firstLetter = getFirstLetter(name);
    let letterColor = getLetterColor(firstLetter);
    document.getElementById('card').innerHTML = ``;
    document.getElementById('card').innerHTML = ` <div class="card">
    <img class="cardBackArrow" src="/Join/img/Vector.png" onclick="hideContactView()">
        <div>
        <img class="cardBackArrowMobil" src="/Join/img/Vector.png" onclick="hideContactViewMobil()">
        <div class="initialDiv" style="padding: 10px;" >
        <p  style="background-color: ${letterColor};" class="initial-2">${initials}</p>
        </div>
        <div class = name-div>
          <p class="name">${name}</p>
          <div class="del">
            <div onclick="editContact('${name}','${email}','${phone}')" class="edit-delete">
              <img class="edit-del" src="/Join/img/edit.png">
              <p onclick="editContact()" class="edit-del">Edit</p>
            </div>
            <div onclick="deleteContact('${email}')" class="edit-delete">
            <img class="edit-del" src="/Join/img/delete.png">     
              <p class="edit-del">Delete</p>
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
      </div>`;
     document.getElementById("card").style.display = "block"; // Display the contact card
     document.getElementById("contact-view").style.display = "block";
}
// Funktion zum Abrufen der Hintergrundfarbe basierend auf dem Buchstaben
/**
 * Gets the color associated with the given letter.
 * @param {string} letter - The letter for which to retrieve the color.
 * @returns {string} The color associated with the letter. If no color is found for the letter, returns 'gray'.
 */
function getLetterColor(letter) { 
    // Map of letters to colors
   const colorMap = {'A':'blue','Ä':'cyan','B':'green','C':'red','D':'purple','E':'orange','F':'pink','G':'cyan','H':'brown','I':'teal','J':'yellow','K':'maroon','L':'navy','M':'olive','N':'lime','O':'indigo','Ö':'darkorange','P':'magenta','Q':'tan','R':'slategray','S':'lightcoral','T':'peru','U':'darkorange','Ü':'mediumseagreen','V':'orangered','W':'goldenrod','X':'steelblue','Y':'darkviolet','Z':'gray',}; 
    // Retrieve the color for the given letter. If no color is found, return 'gray'.
   return colorMap[letter.toUpperCase()] || 'gray'; 
}
// Funktion zum Extrahieren des ersten Buchstabens aus einem Namen für die Kategorisierung.
/**
 * Gets the first letter of the provided name.
 * @param {string} name - The name from which to extract the first letter.
 * @returns {string} The first letter of the name, converted to uppercase. If the name is empty or consists of whitespace only, returns 'A'.
 */
function getFirstLetter(name) {
     // Check if the name is not empty or consists of whitespace only
    if (name && name.trim() !== '') {
          // Return the first letter of the name, converted to uppercase
        return name.trim()[0].toUpperCase();
    }
    // If the name is empty or consists of whitespace only, return 'A'
    return 'A';
}
// Funktion zum Aktualisieren des ausgewählten Kontakts und Anzeigen der Detailansicht.
function handleContactClick(clickedContact, name, email, phone) {
    let allContactElements = document.getElementsByClassName('contact');
    for (let element of allContactElements) {
        element.classList.remove('clicked');}
    clickedContact.classList.add('clicked');
    selectedContact = email;
    
    showCard(name, email, phone);
}

// Funktion zum Extrahieren der Initialen aus einem Namen.
function getInitials(name) {
    if (name && name.trim() !== '') {
        let splitName = name.split(' ');
        let initials = '';
        for (let i = 0; i < splitName.length; i++) 
        {
            if(i < 3) { initials += splitName[i][0].toUpperCase();}
            else{break;}
        }
        return initials;
    }return '';
}
// Funktion zum Öffnen des Formulars zum Hinzufügen eines neuen Kontakts.
function newContact() {
    let openDiv = document.getElementById('newContact');
    openDiv.style.display = 'flex';
    openDiv.innerHTML = `
    <div class="div-container">
        <div class="new-card">
            <img id="newContactJoinImage" src="/Join/img/icon2.png">
            <h1 class="new-text">Add contact</h1>
            <p class="new-text-2">Tasks are better with a team</p>
            <img id="separatorAddContact" src="/Join/img/separator.svg" alt="">
            <svg xmlns="http://www.w3.org/2000/svg" width="88" height="3" viewBox="0 0 3 3" fill="none"
                style="width: 88px; height: 3px;">
                <path d="M2 2V61" stroke="" stroke-width="" stroke-linecap="round" />
            </svg>
        </div>
        <div class=" div-input">
            <div class="picture-div">
                <div class="picture">
                    <img style="width: 42px; height: 42px;" src="/Join/img/person (1).png">
                </div>
            </div>
            <div class="close">
            <img id="closeButton" onclick="closeNewContact()" src="/Join/img/close.png">
            </div>
            <form onsubmit="createContact(event)">
             <div class="div-input-fields">
                <div class="input-fields">
                <input class="input" type="text" pattern="[a-zA-Z ]*" name="newName" required placeholder="Max Mustermann">
                    <img src="/Join/img/person.png" alt="icon" style="width: 24; height: 24;">
                </div>
                <div class="input-fields">
                    <input class="input" required type="email" name="newEmail" placeholder="max.mustermann@gmail.com">
                    <img src="/Join/img/mail.png" alt="icon" class="icon-1">
                </div>
                <div class="input-fields">
                <input class="input" type="number" pattern="\d*" oninput="this.value = this.value.replace(/\D/g,'')" required required name="newPhone" placeholder="Phone number">
                    <img src="/Join/img/call.png" alt="icon" class="icon-2">
                </div>
                <div class="buttons">
                    <button onclick="closeNewContact()" class="cancel-btn">Cancel &#10006;</button>
                    <button style="position: relative; right: 40px;" class="create-btn">Create contact <img src="/Join/img/check.png" alt=""></button>
                </div>
             </div>
            </form>
        </div>
    </div>
  `;
    updateCloseButtonImage();
    window.addEventListener('resize', updateCloseButtonImage);
}
// Funktion zum Schließen des Formulars zum Hinzufügen eines neuen Kontakts.
function closeNewContact() {
    let openDiv = document.getElementById('newContact');
    openDiv.style.display = 'none';
}
/**
 * Updates the close button image based on the window width.
 */
function updateCloseButtonImage() {
  let closeButton = document.getElementById("closeButton");
  if (closeButton) {
    if (window.innerWidth <= 1250) {
      closeButton.src = "/Join/img/close-white.png";
    } else {
      closeButton.src = "/Join/img/close.png";
    }
  }
}
updateCloseButtonImage();
window.addEventListener('resize', updateCloseButtonImage);

// Funktion zum Erstellen eines neuen Kontakts basierend auf den Formulareingaben.
async function createContact(event) {
    event.preventDefault();
    let nameInput = document.querySelector('.input-fields input[name="newName"]').value;
    let emailInput = document.querySelector('.input-fields input[name="newEmail"]').value;
    let phoneInput = document.querySelector('.input-fields input[name="newPhone"]').value;
    let contacts = [];
    contacts = {nameKey: makeNameFirstLetterUppercase(nameInput), emailKey: emailInput, phoneKey: phoneInput};
    
    for (let i = 0; i < contactsLocal.length; i++)  { if(contactsLocal[i].emailKey == emailInput)
        { alert('This email is already used!'); return;} 
    }
    contactsLocal.push(contacts);
    contactsLocal.sort((a, b) => {if (a.nameKey < b.nameKey) return -1;
        if (a.nameKey > b.nameKey) return 1; return 0;
    });
    
    saveContactsToStorage();
    selectedContact = emailInput;
    drawContactsList();
    closeNewContact();
    created();
}
/**
 * Saves the contacts stored in the local variable `contactsLocal` to the storage.
 * @async
 * @returns {Promise<void>} A Promise that resolves when the contacts are successfully saved to storage.
 */
async function saveContactsToStorage() {
    await setItem('contacts', JSON.stringify(contactsLocal));
    console.log("Contacts succesfully saved to storage!");
}
/**
 * Loads contacts from storage into the local variable `contactsLocal`.
 * @async
 * @returns {Promise<void>} A Promise that resolves when contacts are successfully loaded from storage.
 */
async function loadContactsFromStorage() {
    try { const loadedContacts = await getItem("contacts");
      if (!loadedContacts) {  contactsLocal = []; return; }
      contactsLocal = Array.isArray(loadedContacts) ? loadedContacts : JSON.parse(loadedContacts);
    } catch (error) {
      console.error("Fehler beim Laden der Contacts:", error);
    }
    
    drawContactsList();
  }
// Funktion zum Laden der Kontakte aus dem lokalen Speicher, alphabetisch sortieren und Anzeigen im AdvanceCard-Bereich.
function loadContacts() {
    if (localStorage.getItem('contacts')) {
        let storedContacts = JSON.parse(localStorage.getItem('contacts'));
        names = storedContacts.names || [];
        emails = storedContacts.emails || [];
        phones = storedContacts.phones || [];
        let contactArray = names.map((name, index) => ({ name, email: emails[index], phone: phones[index] }));// Erstellt ein Array von Objekten, jedes enthält Name, Email und Telefonnummer.
        contactArray.sort((a, b) => a.name.localeCompare(b.name)); // Sortiert das Array alphabetisch nach dem Namen.
        document.getElementById('advanceCard').innerHTML = '';
        for (let i = 0; i < contactArray.length; i++) {  // Iteriert durch das sortierte Array und erstelle die AdvanceCard für jeden Kontakt.
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
function deleteContact(email) 
{
    for(i=0 ; i < contactsLocal.length; i++ )
    {
        if(contactsLocal[i].emailKey == email)
        {
            break;
        }  
    }
    contactsLocal.splice(i, 1);
    selectedContact = "";
    
    saveContactsToStorage();
    drawContactsList();
}
// Funktion zum Aktualisieren der Kontaktanzeige.
function updateContactDisplay() {
    document.getElementById('card').innerHTML = '';
    loadContacts();
}
// Funktion zum Öffnen des Formulars zum Bearbeiten eines Kontakts.
function editContact(namep, emailp, phonep) {
    let selectedContact = document.querySelector('.contact.clicked');
    if (selectedContact) {
        let index = selectedContact.dataset.index;
        let name = names[index];
        let initials = getInitials(namep);
        let firstLetter = getFirstLetter(namep);
        let initialColor = getLetterColor(firstLetter);
        let openDiv = document.getElementById('editContact');
        openDiv.style.display = 'flex';
        openDiv.innerHTML = createEditContactHTML(namep, emailp, phonep, initials, initialColor);
    }
    updateCloseButtonImage();
    window.addEventListener('resize', updateCloseButtonImage);
}

/**
 * Creates HTML content for editing a contact.
 * @param {string} namep - The name of the contact.
 * @param {string} emailp - The email of the contact.
 * @param {string} phonep - The phone number of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} initialColor - The background color for the initials.
 * @returns {string} The HTML content for editing the contact.
 */
function createEditContactHTML(namep, emailp, phonep, initials, initialColor) {
    return `
        <div class="div-container">
            <div class="new-card"><img src="/Join/img/icon2.png"> <h1 class="new-text">Edit contact</h1>
                <p class="new-text-2">Tasks are better with a team</p><svg xmlns="http://www.w3.org/2000/svg" width="88" height="3" viewBox="0 0 3 3" fill="none"
                    style="width: 88px; height: 3px;"> <path d="M2 2V61" stroke="" stroke-width="" stroke-linecap="round" />
                </svg>
            </div>
            <div class=" div-input">
                <div class="picture-div">
                    <div class="picture" style="background-color: ${initialColor};">
                        <p style="color: white; font-size: 47px; font-weight: 400; line-height: 42px;">${initials}</p>
                    </div>
                </div>
                <div class="close">
                    <img id="closeButton" onclick="closeEditContact()" src="/Join/img/close.png">
                </div>
                <form onsubmit="saveEditedContact(event,'${namep}','${emailp}','${phonep}')">
                    <div class="div-input-fields">
                        <div class="input-fields">
                            <input class="input" required type="text" placeholder="Name" value="${namep}">
                            <img src="/Join/img/person.png" alt="icon" style="width: 24; height: 24;">
                        </div>
                        <div class="input-fields">
                            <input class="input" required type="email" placeholder="Email" value="${emailp}">
                            <img src="/Join/img/mail.png" alt="icon" class="icon-1">
                        </div>
                        <div class="input-fields">
                            <input oninput="this.value = this.value.replace(/[^0-9]/g, '');" class="input" required type="number"  placeholder="Phone" value="${phonep}">
                            <img src="/Join/img/call.png" alt="icon" class="icon-2">
                        </div>
                        <div class="buttons">
                            <button type="button" onclick="closeEditContact()" class="cancel-btn">Discard &#10006;</button>
                            <button style="position: relative; right: 40px;" class="create-btn" type="submit">Save <img src="/Join/img/check.png" alt=""></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
}
// Funktion zum Speichern der bearbeiteten Kontaktdaten.
function saveEditedContact(event, oldname, oldemail, oldphone) {  event.preventDefault();
    let newName = document.querySelector('.input-fields input[placeholder="Name"]').value;
    let newEmail = document.querySelector('.input-fields input[placeholder="Email"]').value;
    let newPhone = document.querySelector('.input-fields input[placeholder="Phone"]').value;
    let existingContactIndex = findContactIndexByEmail(oldemail);
    if (existingContactIndex > -1) {
        contactsLocal.splice(existingContactIndex, 1); }
    if (emailAlreadyExists(newEmail)) {
        alert('This email is already used!');
        restoreOldContactValues(oldname, oldemail, oldphone);
        return; }
    saveNewContact(newName, newEmail, newPhone);
    closeEditContact();
    drawContactsList();
}
/**
 * Finds the index of a contact in the contactsLocal array by email.
 * @param {string} email - The email address of the contact to find.
 * @returns {number} - The index of the contact if found, otherwise -1.
 */
function findContactIndexByEmail(email) {
    for (let i = 0; i < contactsLocal.length; i++) {
        if (contactsLocal[i].emailKey === email) {
            return i;
        }
    }
    return -1;
}
/**
 * Checks if an email already exists in the contactsLocal array.
 * @param {string} email - The email address to check.
 * @returns {boolean} - True if the email already exists, otherwise false.
 */
function emailAlreadyExists(email) {
    return contactsLocal.some(contact => contact.emailKey === email);
}
/**
 * Restores the old contact values to the input fields and adds the old contact back to the contactsLocal array.
 * @param {string} oldname - The old name of the contact.
 * @param {string} oldemail - The old email of the contact.
 * @param {string} oldphone - The old phone number of the contact.
 */
function restoreOldContactValues(oldname, oldemail, oldphone) { // Set the input field values to the old values
    document.querySelector('.input-fields input[placeholder="Name"]').value = oldname;
    document.querySelector('.input-fields input[placeholder="Email"]').value = oldemail;
    document.querySelector('.input-fields input[placeholder="Phone"]').value = oldphone;

    let oldContact = { nameKey: oldname, emailKey: oldemail, phoneKey: oldphone };  // Create an object representing the old contact
    contactsLocal.push(oldContact); // Add the old contact back to the contactsLocal array
    selectedContact = oldemail; // Update the selectedContact to the old email
}
/**
 * Saves a new contact to the contactsLocal array.
 * @param {string} newName - The name of the new contact.
 * @param {string} newEmail - The email of the new contact.
 * @param {string} newPhone - The phone number of the new contact.
 */
function saveNewContact(newName, newEmail, newPhone) {  
    let formattedName = makeNameFirstLetterUppercase(newName); // Format the name to have the first letter uppercase
    let newContact = { nameKey: formattedName, emailKey: newEmail, phoneKey: newPhone }; // Create a new contact object
    contactsLocal.push(newContact); // Add the new contact to the contactsLocal array
    selectedContact = newEmail; // Update the selectedContact to the new email
     // Sort the contactsLocal array by name
    contactsLocal.sort((a, b) => {
        if (a.nameKey < b.nameKey) return -1;
        if (a.nameKey > b.nameKey) return 1;
        return 0;
    });
}
/**
 * Capitalizes the first letter of a string.* @param {string} name - The input string.
 * @returns {string} - The input string with the first letter capitalized.*/
function makeNameFirstLetterUppercase(name) {
     // Capitalize the first letter of the input string and concatenate it with the rest of the string
    return name.charAt(0).toUpperCase() + name.slice(1);}
// Funktion zum Schließen des Formulars zum Bearbeiten eines Kontakts.
function closeEditContact() {
    let openDiv = document.getElementById('editContact');
    openDiv.style.display = 'none';}
// Funktion zum zeigen einer Erfolgsmeldung, die nach 2 Sekunden automatisch ausgeblendet wird.
function created() {
    let msgBox = document.getElementById('msgBox');
    msgBox.innerHTML = 'Contact successfully created';
    msgBox.style.display = 'flex';
    setTimeout(function () {
        msgBox.style.display = 'none';
    }, 2000);} 