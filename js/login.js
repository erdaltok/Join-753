function load() {
    let logo = document.getElementById('logo');
    document.body.classList.add('animate');
    loadUsers();
    show();
}

function show() {
    setTimeout(function () {
        let element = document.getElementById("animation");
        if (element) {
            element.style.display = "flex";
        }
    }, 1000);
}

function guestLogin() {
    window.location.href = "summary.html";
}



function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let users = users.find(u => u.name == name.value && u.email == email.value && u.password == password.value);
    console.log(users);
    if (users) {
        console.log('user gefunden')
    }
}