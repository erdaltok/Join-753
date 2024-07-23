let users = [];

/** 
 * Initializes the application by loading user data.
 */
async function init() {
    loadUsers();
}

/**
 * Loads user data from local storage.
 * Attempts to parse the data and assign it to the users array.
 * Logs an error to the console if loading fails.
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Registers a new user and updates the user data in the local storage.
 * Validates password and confirm password fields.
 * Displays a success message and redirects the user to the index page.
 */
async function register() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    if (password.value !== confirmPassword.value) { alert('Passwörter stimmen nicht überein'); return; }
    document.getElementById('msg_box').innerHTML = 'You Signed Up successfully';
    document.getElementById('msg_box').style.display = 'flex';
    document.getElementById('register_btn').disabled = true;
    users.push({ name: name.value, email: email.value, password: password.value, });
    await setItem('users', JSON.stringify(users));
    resetForm();
    setTimeout(function () { window.location.href = './index.html';}, 3000);
}


/**
 * Resets the input fields of the registration form and activates the registration button.
 * Clears the values of the name, email, password, and confirm password fields.
 * Enables the register button.
 */
function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirm_password').value = '';
    document.getElementById('register_btn').disabled = false;
}
