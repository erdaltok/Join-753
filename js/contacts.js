let contactsLocal = []; //Stores all contacts from storage
let selectedContact = ""; //Contains the email of selected contact


let names = [];
let emails = [];
let phones = [];
let letterColors = {};




function reload() {
    location.reload();
}


// Funktion zum Erstellen einer neuen Kontaktkarte und Hinzufügen zum AdvanceCard-Bereich.
function advanceCard(name, email, phone) {
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

    if(selectedContact == email)
    {
        newAdvanceCard.innerHTML = `
        <div id="contact" class="contact clicked">
            <div>
            <p style="background-color: ${initialColor};" class="initial">${initials}</p>
            </div>
            <div class="initial-text">
            <p>${name}</p>
            <p>${email}</p>
            </div>
        </div>
        `;
        showCard(name, email, phone);
    }
    else
    {
        newAdvanceCard.innerHTML = `
        <div id="contact" class="contact">
            <div>
            <p style="background-color: ${initialColor};" class="initial">${initials}</p>
            </div>
            <div class="initial-text">
            <p>${name}</p>
            <p>${email}</p>
            </div>
        </div>
        `;
    }
    
    
    if (!existingLetterContainer.contains(newAdvanceCard)) {
        existingLetterContainer.appendChild(newAdvanceCard);
    }
    
    newAdvanceCard.querySelector('.contact').addEventListener('click', function () {
        handleContactClick(this, name, email,phone);
    });
}

function makeNameFirstLeterUppercase(name)
{
    let splitName = name.split(" ");
    let stringName = "";
    for (i=0; i< splitName.length; i++)
    {
        splitName[i] = splitName[i][0].toUpperCase() + splitName[i].slice(1);
        if(i>0)
        {
            stringName = stringName + " " + splitName[i];
        }
        else
        {
            stringName = stringName + splitName[i];
        }
    }
    return stringName;
}

function drawContactsList()
{
    document.getElementById('card').innerHTML = '';
    document.getElementById('advanceCard').innerHTML = '';
    for (let i = 0; i < contactsLocal.length; i++) {
        advanceCard(contactsLocal[i].nameKey, contactsLocal[i].emailKey, contactsLocal[i].phoneKey);
    }
}


function hideContactViewMobil(){
    document.getElementById("card").style.display = "none";
    document.getElementById("contact-view").style.display = "none";
    
}
function hideContactView(){
    document.getElementById("card").style.display = "none";
    
}


// Funktion zum Anzeigen der ausgewählten Kontaktinformationen in der Detailansichtskarte.
function showCard(name, email, phone) {
   
    let initials = getInitials(name);
    let firstLetter = getFirstLetter(name);
    let letterColor = getLetterColor(firstLetter);
    document.getElementById('card').innerHTML = ``;
    document.getElementById('card').innerHTML = `
    <div class="card">
    <img class="cardBackArrow" src="/Join/img/Vector.png" onclick="hideContactView()">
        <div>
        <img class="cardBackArrowMobil" src="/Join/img/Vector.png" onclick="hideContactViewMobil()">
        <div class="initialDiv" >
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
      </div>
    `;

    //saveContactsToLocalStorage();
     document.getElementById("card").style.display = "block";
     document.getElementById("contact-view").style.display = "block";

}


// Funktion zum Abrufen der Hintergrundfarbe basierend auf dem Buchstaben
function getLetterColor(letter) 
{ 
    const colorMap = {'A':'blue','Ä':'cyan','B':'green','C':'red','D':'purple','E':'orange','F':'pink','G':'cyan','H':'brown','I':'teal','J':'yellow','K':'maroon','L':'navy','M':'olive','N':'lime','O':'indigo','Ö':'darkorange','P':'magenta','Q':'tan','R':'slategray','S':'lightcoral','T':'peru','U':'darkorange','Ü':'mediumseagreen','V':'orangered','W':'goldenrod','X':'steelblue','Y':'darkviolet','Z':'gray',}; 
    return colorMap[letter.toUpperCase()] || 'gray'; 
}


// Funktion zum Extrahieren des ersten Buchstabens aus einem Namen für die Kategorisierung.
function getFirstLetter(name) {
    if (name && name.trim() !== '') {
        return name.trim()[0].toUpperCase();
    }
    return 'A';
}


// Funktion zum Aktualisieren des ausgewählten Kontakts und Anzeigen der Detailansicht.
function handleContactClick(clickedContact, name, email, phone) {
    let allContactElements = document.getElementsByClassName('contact');
    for (let element of allContactElements) {
        element.classList.remove('clicked');
    }

    clickedContact.classList.add('clicked');
    selectedContact = email;
    console.log(selectedContact);

    showCard(name, email, phone);
}


// Funktion zum Extrahieren der Initialen aus einem Namen.
function getInitials(name) {
    if (name && name.trim() !== '') {
        let splitName = name.split(' ');
        let initials = '';
        for (let i = 0; i < splitName.length; i++) 
        {
            if(i < 3)
            {
                initials += splitName[i][0].toUpperCase();
            }
            else
            {
                break;
            }
            
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
                <input class="input" type="tel" pattern="[0-9]*" oninput="this.value = this.value.replace(/\D/g,'')" required required name="newPhone" placeholder="Phone number">
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

    //saveContactsToLocalStorage();
    updateCloseButtonImage();
    window.addEventListener('resize', updateCloseButtonImage);
}


// Funktion zum Schließen des Formulars zum Hinzufügen eines neuen Kontakts.
function closeNewContact() {
    let openDiv = document.getElementById('newContact');
    openDiv.style.display = 'none';
}


// function updateCloseButtonImage() {
//     let closeButton = document.getElementById('closeButton');
//     if (window.innerWidth <= 1250) {
//         closeButton.src = '/Join/img/close-white.png';
//     } else {
//         closeButton.src = '/Join/img/close.png';
//     }
// }

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
async function createContact(event) 
{
    event.preventDefault();

    let nameInput = document.querySelector('.input-fields input[name="newName"]').value;
    let emailInput = document.querySelector('.input-fields input[name="newEmail"]').value;
    let phoneInput = document.querySelector('.input-fields input[name="newPhone"]').value;

    let contacts = [];

    contacts = {
        nameKey: makeNameFirstLeterUppercase(nameInput),
        emailKey: emailInput,
        phoneKey: phoneInput
    };

    console.log(contacts);

    for (let i = 0; i < contactsLocal.length; i++) 
    {
        if(contactsLocal[i].emailKey == emailInput)
        {
            alert('This email is already used!');
            return;
        }
        
    }

    contactsLocal.push(contacts);

    contactsLocal.sort((a, b) => {
        if (a.nameKey < b.nameKey)
          return -1;
        if (a.nameKey > b.nameKey)
          return 1;
        return 0;
    });


    console.log("1");
    console.log(contactsLocal);
    saveContactsToStorage();

    selectedContact = emailInput;

    //saveContactsToLocalStorage();
    
    drawContactsList();
    closeNewContact();
    
    //loadContactsFromStorage();
    created();
    //hideContactView1();
    
}


async function saveContactsToStorage() 
{
    await setItem('contacts', JSON.stringify(contactsLocal));
    console.log("Contacts succesfully saved to storage!");
}

async function loadContactsFromStorage() 
{
    try {
      const loadedContacts = await getItem("contacts");
      if (!loadedContacts) {
        contactsLocal = [];
        return;
      }
      contactsLocal = Array.isArray(loadedContacts) ? loadedContacts : JSON.parse(loadedContacts);
      //renderTasks(); 
    } catch (error) {
      console.error("Fehler beim Laden der Contacts:", error);
    }

    console.log("Contacts loaded succesfully");

    drawContactsList();
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

    console.log("2");
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
        openDiv.innerHTML = `
            <div class="div-container">
                <div class="new-card">
                    <img src="/Join/img/icon2.png">
                    <h1 class="new-text">Edit contact</h1>
                    <p class="new-text-2">Tasks are better with a team</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="88" height="3" viewBox="0 0 3 3" fill="none"
                        style="width: 88px; height: 3px;">
                        <path d="M2 2V61" stroke="" stroke-width="" stroke-linecap="round" />
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
                                <input class="input" required type="tel" placeholder="Phone" value="${phonep}">
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
    updateCloseButtonImage();
    window.addEventListener('resize', updateCloseButtonImage);
}





// Funktion zum Speichern der bearbeiteten Kontaktdaten.
function saveEditedContact(event, oldname, oldemail, oldphone) {

    let contacts = [];

    event.preventDefault();
    let newName = document.querySelector('.input-fields input[placeholder="Name"]').value;
    let newEmail = document.querySelector('.input-fields input[placeholder="Email"]').value;
    let newPhone = document.querySelector('.input-fields input[placeholder="Phone"]').value;

    console.log(newName);
    console.log(newEmail);
    console.log(newPhone);

    for(i=0 ; i < contactsLocal.length; i++ )
    {
        if(contactsLocal[i].emailKey == oldemail)
        {
            break;
        }  
    }

    contactsLocal.splice(i, 1);

    for(let i = 0; i < contactsLocal.length; i++) 
    {
        if(contactsLocal[i].emailKey == newEmail)
        {
            alert('This email is already used!');
            document.querySelector('.input-fields input[placeholder="Name"]').value = oldname;
            document.querySelector('.input-fields input[placeholder="Email"]').value = oldemail;
            document.querySelector('.input-fields input[placeholder="Phone"]').value = oldphone;

            

            contacts = {
                nameKey: oldname,
                emailKey: oldemail,
                phoneKey: oldphone
            };

            contactsLocal.push(contacts);
            selectedContact = oldemail;

            return;
        }
        
    }

    contacts = {
        nameKey: makeNameFirstLeterUppercase(newName),
        emailKey: newEmail,
        phoneKey: newPhone
    };

    contactsLocal.push(contacts);

    selectedContact = newEmail;

    contactsLocal.sort((a, b) => {
        if (a.nameKey < b.nameKey)
          return -1;
        if (a.nameKey > b.nameKey)
          return 1;
        return 0;
    });

    console.log("3");
    console.log(contactsLocal);
    saveContactsToStorage();
    //updateContactDisplay();
    closeEditContact();
    //hideContactView()
    //loadContactsFromStorage();
    drawContactsList();
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