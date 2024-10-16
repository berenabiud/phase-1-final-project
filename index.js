document.addEventListener('DOMContentLoaded', () => {
    // These lines select specific HTML elements by their IDs and assign them to constants for easy reference later in the code.
    const gameForm = document.getElementById('game-form');
    const gameList = document.getElementById('game-list');
    const ratingFilter = document.getElementById('rating-filter');
    const releaseYearFilter = document.getElementById('release-year-filter');

    
    const apiKey = 'bdaadfbc69b6442fb0a533ec2d7ccf87';//this is an api key that alllows me to access the games from from the aoi

    //this line listens to the events
    gameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const gameTitle = document.getElementById('game-title').value;
        const gameGenre = document.getElementById('game-genre').value;

        // Fetch and render game data from RAWG API
        fetchGameData(gameTitle, gameGenre);//Calls the fetchGameData function passing the game title and game genre as parameters
    });

    // Function to fetch game data from RAWG API
    function fetchGameData(title, genre) {
        const apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${title}`;
        if (genre) {
            apiUrl += `&genres=${genre.toLowerCase()}`;
        }

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                applyFilters(data.results);
            })
            .catch(error => {
                console.error('Error fetching data:', error);//fetches any error during the fetch process
            });
    }

    // Function to apply filters for rating and release year
    function applyFilters(games) {
        const filteredGames = games.filter(game => {//Uses the filter method to create a new array with games that match the criteria.
            const selectedRating = ratingFilter.value;
            const selectedYear = releaseYearFilter.value;
            
            let matchesRating = true;
            if (selectedRating) {
                matchesRating = Math.floor(game.rating) >= parseInt(selectedRating);
            }

            let matchesYear = true;
            if (selectedYear && game.released) {
                matchesYear = game.released.startsWith(selectedYear);
            }

            return matchesRating && matchesYear;
        });

        renderGames(filteredGames);//Calls the renderGames function to display the filtered games
    }

    function renderGames(games) {// takes an array of games and render them on display
        // Clear any previous results
        gameList.innerHTML = '';

        if (games.length === 0) {
            gameList.innerHTML = `<p class="text-center">No games found</p>`;
            return;
        }

        games.forEach(game => {
            const gameCard = `
                <div class="col">
                    <div class="card h-100">
                        <img src="${game.background_image}" class="card-img-top" alt="${game.name}">
                        <div class="card-body">
                            <h5 class="card-title">${game.name}</h5>
                            <p class="card-text">Genre: ${game.genres.map(genre => genre.name).join(', ')}</p>
                            <p class="card-text">Rating: ★${'★'.repeat(Math.floor(game.rating))} (${game.rating}/5)</p>
                            <p class="card-text">Release Year: ${game.released ? game.released.substring(0, 4) : 'N/A'}</p>
                            <button class="btn btn-primary">Details</button>
                        </div>
                    </div>
                </div>
            `;
            gameList.innerHTML += gameCard;
        });
    }
});
