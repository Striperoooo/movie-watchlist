


const searchForm = document.querySelector('.search-form')

searchForm.addEventListener('submit', handleSearchInput)

function handleSearchInput(e) {
    e.preventDefault()

    const searchInput = document.querySelector('.search-form input')
    const searchTerm = searchInput.value.trim()

    // Call handleSearchResult
    handleSearchResult(searchTerm)
}

