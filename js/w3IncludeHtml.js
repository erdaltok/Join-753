
let isMenuOpen = false;

function menuStyle() {
  let openDiv = document.getElementById('style');
  if (!isMenuOpen) {
    openDiv.style.display = 'flex';
    isMenuOpen = true;
  }
  else {
    openDiv.style.display = 'flex';
    isMenuOpen = true;
  }
}


document.addEventListener('click', function (event) {
  let openDiv = document.getElementById('style');
  let menuButton = document.querySelector('.header-userprofil');

  if (!openDiv.contains(event.target) && !menuButton.contains(event.target) && isMenuOpen) {
    openDiv.style.display = 'none';
    isMenuOpen = false;
  }
});


async function init() {
  await includeHTML();

}

async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}
