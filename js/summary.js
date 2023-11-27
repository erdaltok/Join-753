// SUMMARY PAGE

function changeImageOnHover(element, newSrc, originalSrc) {
  element.addEventListener("mouseover", function () {
    this.querySelector("img").src = newSrc;
  });
  element.addEventListener("mouseout", function () {
    this.querySelector("img").src = originalSrc;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const leftBox = document.querySelector(".left-box");
  const rightBox = document.querySelector(".right-box");

  if (leftBox) {
    changeImageOnHover(
      leftBox,
      "/img/pen-icon-whiteBg.svg",
      "/img/pen-icon.svg"
    );
  }

  if (rightBox) {
    changeImageOnHover(
      rightBox,
      "/img/checkmark-icon-whiteBg.svg",
      "/img/checkmark-icon.svg"
    );
  }
});
