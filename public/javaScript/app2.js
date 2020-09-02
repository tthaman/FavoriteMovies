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
    const url = 'http://localhost:5000/saved/watchlist';
    postData(url, movieId);
    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          body: JSON.stringify({movieId: movieId}) // body data type must match "Content-Type" header
        });
        console.log(response)
        return response.json(); // parses JSON response into native JavaScript objects
      }
});