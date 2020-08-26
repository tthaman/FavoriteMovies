const optionsButton = document.querySelector(".options-button");
const optionsContainer = document.querySelector(".search-options");

optionsButton.addEventListener("click", () => {
    optionsContainer.classList.toggle("hideOptions");
});