function changeColor() {
  let contactDiv = document.getElementById("contact");
  contactDiv.classList.add("clicked");
}

function showCard() {
  document.getElementById('card').innerHTML = ``;
  document.getElementById('card').innerHTML = `
    <div class="card">
      <div>
        <p class="initial-2">BS</p>
      </div>
        <div style="line-height: 0.1;">
           <h3 class="name">Alex Mustermann</h3>
          <div class="del">
            <div class="edit-delete">
                <img class="edit-del" src="/img/edit.png">
                <p class="edit-del">Edit</p>
            </div>
            <div class="edit-delete">
                <img class="edit-del" src="/img/delete.png">
                <p class="edit-del">Delete</p>
            </div>
          </div>
        </div>
    </div>
    <div class="information">
     <p>Contact Information</p>
    </div>
    <div class="info">
     <p class="info-1">Email</p>
     <a class="info-2" href="mailto:alex@gmail.com">alex@gmail.com</a>
     <p class="info-1">Phone</p>
     <a class="info-2" href="tel:01511234567">0151/1234567</a>
    </div>
    `;
}

function newContact() {
  let openDiv = document.getElementById('newContact');
  openDiv.style.display = 'flex';
}

function close() {
  let openDiv = document.getElementById('newContact');
  openDiv.style.display = 'none';
}