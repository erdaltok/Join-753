let users = [
    {'name':'Denis', 'email':'denis@test.de', 'password':'test123'}
];

function addUser() {
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    users.push({name:name.value, email:email.value, password:password.value});

    window.location.href = 'login.html?msg=You Signed Up successfully';
}