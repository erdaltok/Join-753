// Die Funktion initialisiert die Seite, fügt eine Animationsklasse zum Body hinzu, lädt Benutzerdaten und ruft die Funktion "show" auf.
function load() {
    let logo = document.getElementById('logo');
    document.body.classList.add('animate');
    loadUsers();
    show();
}

// Die Funktion verzögert die Anzeige eines HTML-Elements mit der ID "animation" um 1000 Millisekunden.
function show() {
    setTimeout(function () {
        let element = document.getElementById("animation");
        if (element) {
            element.style.display = "flex";
        }
    }, 1000);
}

// Die Funktion leitet den Benutzer auf die Seite "summary.html" weiter.
function guestLogin() {
    window.location.href = "summary.html";
}


// Die Funktion liest die E-Mail- und Passwort-Eingaben aus, sucht nach einem entsprechenden Benutzer in der "users"-Liste und zeigt eine Fehlermeldung an, wenn der Benutzer nicht gefunden wird. Bei erfolgreicher Anmeldung wird die Funktion "guestLogin" aufgerufen.
function login() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let user = users.find(u => u.email === email && u.password === password);

    let errorContainer = document.getElementById('error-message');
    errorContainer.style.display = 'flex';

    console.log(user);

    if (user) {
        console.log('User found');
        guestLogin();
    } else {
        console.log('User not found');
        errorContainer.innerHTML = 'User not found';
    }
}