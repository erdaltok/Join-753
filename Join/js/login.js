// Die Funktion initialisiert die Seite, fügt eine Animationsklasse zum Body hinzu, lädt Benutzerdaten und ruft die Funktion "show" auf.
function load() {
    let logo = document.getElementById('logo');
    document.body.classList.add('animate');
    loadUsers();
    show();
}

// The function delays the display of an HTML element with the ID "animation" by 1000 milliseconds.
function show() {
    setTimeout(function () {
        let element = document.getElementById("animation");
        if (element) {
            element.style.display = "flex";
        }
    }, 1000);
}

// The function redirects the user to the page "summary.html".
function guestLogin() {
    window.location.href = "summary.html";
}

// The function reads the email and password entries, searches for a corresponding user in the "users" list and displays an error message if the user is not found. If the login is successful, the "guestLogin" function is called.
function login() {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let user = users.find((u) => u.email === email && u.password === password);
  let errorContainer = document.getElementById("error-message");
  errorContainer.style.display = "flex";

  if (user) {
    console.log("User found");
    errorContainer.style.display = "none";

    localStorage.setItem("userName", user.name);
    let initials = user.name.split(" ").map((n) => n[0]).join("");
    localStorage.setItem("userInitials", initials);
    guestLogin();
  } else {
    console.log("User not found");
    errorContainer.innerHTML = "User not found";
    setTimeout(function () {
      errorContainer.style.display = "none";
    }, 2000);
  }
  emptyInputs();
}

function guestLogin1() {
    // Predefined guest user credentials
    const guestEmail = 'Guest@gmail.com';
    const guestPassword = 'Guest';

    // Simulate filling in email and password fields with predefined guest credentials
    document.getElementById('email').value = guestEmail;
    document.getElementById('password').value = guestPassword;
    // Call the login function to authenticate with the predefined guest credentials
    login();
    emptyInputs();
}

function emptyInputs(){
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
}


       
   

