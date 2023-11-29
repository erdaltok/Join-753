let users = [];

async function init() {
    loadUsers();
}

async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

async function register() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');

    if (password.value !== confirmPassword.value) {
        alert('Passwörter stimmen nicht überein');
        return;
    }

    document.getElementById('msg_box').innerHTML = 'You Signed Up successfully';
    document.getElementById('msg_box').style.display = 'flex';

    document.getElementById('register_btn').disabled = true;
    users.push({
        name: name.value,
        email: email.value,
        password: password.value,
    });
    await setItem('users', JSON.stringify(users));
    resetForm();

    setTimeout(function () {
        window.location.href = '/index.html';
    }, 3000);
}

function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirm_password').value = '';
    document.getElementById('register_btn').disabled = false;
}
