function init() {
    let logo = document.getElementById('logo');
    document.body.classList.add('animate');

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
    window.location.href = "index.html";
}

function login() {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let users = users.find(u => u.email == email.value && u.password == password.value);
    console.log(user);
    if(user) {
        console.log('user gefunden')
    }
}

const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get('msg');
if (msg) {
    msg_box.innerHTML = msg;
} else {
    //display:none;
}