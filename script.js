const modalOverlay = document.getElementById("modalOverlay");

document.getElementById("btnAbrirModal").addEventListener("click", () => {
  modalOverlay.classList.add("active");
});

document.getElementById("modalClose").addEventListener("click", () => {
  modalOverlay.classList.remove("active");
});