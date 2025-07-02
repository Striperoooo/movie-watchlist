const mainEl = document.querySelector("main")


async function getMovies() {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
    watchlist = watchlist.slice().reverse()

    const moviePromises = watchlist.map(async id => {
        const res = await fetch(`https://www.omdbapi.com/?apikey=362af8a8&i=${id}`)
        return await res.json()
    })

    const movies = await Promise.all(moviePromises)
    displayWatchlist(movies)
}

function displayWatchlist(movies) {
    mainEl.innerHTML = ""
    if (movies.length === 0) {
        mainEl.innerHTML = `
            <div class="intro-watchlist">
            <h2>Your watchlist is looking a little empty... </h2>
            <a href="index.html" class="add-watchlist-btn align-icon">
                <span class="icon-cirlce">
                    <i class="fa-solid fa-plus"></i>
                </span>
                Let’s add some movies!
            </a>
        </div>
        `
        return
    }

    movies.forEach(movie => {
        const { Title, Year, Poster, Runtime, Genre, Plot, imdbRating, imdbID } = movie
        mainEl.innerHTML += `
            <div class="movie-grid-container">
                <div class="poster-wrapper grid-one">
                    <img class="poster-img" src="${Poster}" alt="Poster for ${Title}" onerror="this.onerror=null;this.src='images/poster-placeholder1.png';this.alt='No poster available for ${Title}';">
                </div>
                <div class="movie-container grid-two">
                    <div class="title-wrapper">
                        <h2 class="movie-title">${Title}</h2>
                        <span class="rating-wrapper">
                            <i class="fa-solid fa-star"></i>
                            ${imdbRating}
                        </span>
                    </div>
                    <div class="details-wrapper">
                        <span class="length">${Runtime}</span>
                        <span class="genre">${Genre}</span>
                        <button class="remove-watchlist-btn btn-style" data-imdbid=${imdbID}>
                            <span class="icon-cirlce">
                                <i class="fa-solid fa-minus"></i>
                            </span>
                            Remove
                        </button>
                    </div>
                    <p class="movie-description">${Plot}</p>
                </div>
            </div>
        `
    })
    document.querySelectorAll(".remove-watchlist-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const imdbID = this.getAttribute('data-imdbid')
            removeFromWatchlist(imdbID)
        })
    })

}

function removeFromWatchlist(imdbID) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || []
    watchlist = watchlist.filter(id => id !== imdbID)
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
    getMovies() // re-fetch and re-render
}

getMovies()

