const optionsButton = document.querySelector(".options-button");
const optionsContainer = document.querySelector(".search-options");
const movieCards = document.querySelectorAll(".movie-card");

movieCards.forEach(card => {
    card.addEventListener("click", async () => {
        fetch("http://localhost:5000/movies/24")
        .then(res => res.json())
        .then(data => console.log(data))
    })
})

optionsButton.addEventListener("click", () => {
    optionsContainer.classList.toggle("hideOptions");
});