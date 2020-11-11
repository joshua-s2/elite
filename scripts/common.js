// menu concerns
const menuButton = document.getElementById("menu-button");
const menuWrapper = document.getElementById("menu-wrapper");
const topStrip = document.getElementById("top-strip");

menuButton.onclick = function(e) {
  menuWrapper.classList.toggle("visible");
  topStrip.classList.toggle("inverse");
}
