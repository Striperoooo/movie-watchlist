


const searchForm = document.querySelector(".search-form")
const mainEl = document.querySelector("main")

// document.querySelector('.input-wrapper').addEventListener('click', function () {
//     document.querySelector('.search-form input').focus()
// })

searchForm.addEventListener("submit", handleSearchInput)

function handleSearchInput(e) {
    e.preventDefault()

    const searchInput = document.querySelector(".search-form input")
    const searchTerm = searchInput.value.trim()

    // Call fetchSearchResult
    fetchSearchResult(searchTerm)

    searchInput.value = ""

}

async function fetchSearchResult(searchTerm) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=362af8a8&s=${searchTerm}`)
    const data = await response.json()
    console.log(data)

    if (data.Response && data.Search) {
        const filteredData = data.Search
            .filter(item => item.Type === "movie" || item.Type === "series")
            .slice(0, 10)

        // Create array of promise for each movie
        const detailMovies = await Promise.all(
            filteredData.map(async movie => {
                const detailRes = await fetch(`http://www.omdbapi.com/?apikey=362af8a8&i=${movie.imdbID}`)
                return await detailRes.json()
            })
        )
        console.log(detailMovies)
        displaySearchResult(detailMovies)
    }
    else if (searchTerm === "") {
        const empty = ""
        displaySearchResult(empty)
    }
    else {
        displaySearchResult()
    }
}

function displaySearchResult(detailMovies) {

    if (detailMovies) {
        mainEl.innerHTML = ""

        detailMovies.forEach(movie => {
            const { Title, Year, Poster, Runtime, Genre, Plot, imdbRating } = movie
            mainEl.innerHTML += `
            <div class="movie-grid-container">

            <div class="poster-wrapper grid-one">
                <img 
                class="poster-img" 
                src="${Poster}" 
                alt="Poster for ${Title}" 
                onerror="this.onerror=null;this.src='images/poster-placeholder1.png';this.alt='No poster available for ${Title}';"
            >
            </div>

            <div class="movie-container grid-two">

                <div class="title-wrapper">
                    <h2 class="movie-title">${Title}
                    </h2>
                    <span class="rating-wrapper">
                        <i class="fa-solid fa-star"></i>
                        ${imdbRating}
                    </span>
                </div>

                <div class="details-wrapper">
                    <span class="length">${Runtime}</span>
                    <span class="genre">${Genre}</span>
                    <button class="add-watchlist-btn">
                        <span class="icon-cirlce">
                            <i class="fa-solid fa-plus"></i>
                        </span>
                        Watchlist
                    </button>
                </div>

                <p class="movie-description">${Plot}
                </p>

            </div>
            `
        })
    }
    else if (detailMovies === "") {
        mainEl.innerHTML = `
        <div class="exploring-wrapper">
            <img src="images/explore-icon.png" alt="Movie reel icon representing explore movies">
            <p>Start exploring</p>
        </div>`
    }
    else {
        mainEl.innerHTML = `
        <h2 class="unable-search">Unable to find what you’re looking for. Please try another search.</h2>`
    }

}