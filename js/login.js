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