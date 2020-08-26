const movieCards = document.querySelectorAll(".movie-card");

movieCards.forEach(card => {
    card.addEventListener("click", e => {
        if(e.target.tagName === "I" || e.target.tagName === "SPAN") {
            const watchlistId = e.target.closest(".remove-icon").dataset.watchlistid;
            const favoriteId = e.target.closest(".remove-icon").dataset.favoriteid;
            if (watchlistId) {
                console.log(`You removed movie id: ${watchlistId} from your watchlist`);
            }
            if (favoriteId) {
                console.log(`You removed movie id: ${favoriteId} from your favorites`)
            }
        } 
    })
});