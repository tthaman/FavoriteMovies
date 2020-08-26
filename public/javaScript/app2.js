const favoritesButton = document.querySelector("#favorites");
const watchListButton = document.querySelector("#watchList");

favoritesButton.addEventListener("click", e => {
    e.preventDefault();
    const movieId = e.currentTarget.dataset.movieid;
    console.log(`Added movie ID: ${movieId} to your favorites`);

});

watchListButton.addEventListener("click", e => {
    e.preventDefault();
    const movieId = e.currentTarget.dataset.movieid;
    console.log(`Added movie ID: ${movieId} to the watchlist`);

});