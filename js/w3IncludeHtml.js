
let isMenuOpen = false;
/**
 * Toggles the visibility of the menu style by changing its display property.
 * If the menu style is closed, it will be opened, and vice versa.
 * @returns {void}
 */
function menuStyle() {
  // Find the div element representing the menu style
  let openDiv = document.getElementById('style');
 // If the menu is closed, open it by setting its display property to 'flex'
  if (!isMenuOpen) {
    openDiv.style.display = 'flex';
    isMenuOpen = true;
  }
  // If the menu is already open, keep it open by setting its display property to 'flex'
  else {
    openDiv.style.display = 'flex';
    isMenuOpen = true;
  }
}
/**
 * Event listener that handles clicks outside the menu style and menu button to close the menu style.
 * @param {Event} event - The click event object.
 * @returns {void}
 */

document.addEventListener('click', function (event) {
   // Find the div element representing the menu style
  let openDiv = document.getElementById('style');
  // Find the menu button element
  let menuButton = document.querySelector('.header-userprofil');
  // Check if the click event target is not within the menu style or menu button
  // and the menu is currently open
  if (!openDiv.contains(event.target) && !menuButton.contains(event.target) && isMenuOpen) {
     // If so, hide the menu style and set the menu state to closed
    openDiv.style.display = 'none';
    isMenuOpen = false;
  }
  
});

/**
 * Initializes the application by including HTML content.
 * @async
 * @returns {Promise<void>} A Promise that resolves when the initialization is complete.
 */
async function init(currentPage) {
   // Include HTML content asynchronously
  await includeHTML()
   document.getElementById(currentPage).style.backgroundColor = 'rgba(9, 25, 49, 1)';
  
}
/**
 * Includes HTML content from external files into elements with the 'w3-include-html' attribute.
 * @async
 * @returns {Promise<void>} A Promise that resolves when all HTML content is successfully included.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    // If the fetch is successful, set the element's innerHTML to the fetched HTML content
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
       // If the fetch fails, display "Page not found" inside the element
      element.innerHTML = "Page not found";
    }
  }
}

