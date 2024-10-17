
document.addEventListener('DOMContentLoaded', () => {
    const gameForm = document.getElementById('game-form');
    const gameList = document.getElementById('game-list');
    const ratingFilter = document.getElementById('rating-filter');
    const releaseYearFilter = document.getElementById('release-year-filter');

    const apiKey = 'bdaadfbc69b6442fb0a533ec2d7ccf87';

    gameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const gameTitle = document.getElementById('game-title').value;
        const gameGenre = document.getElementById('game-genre').value;

        fetchGameData(gameTitle, gameGenre);
    });

    function fetchGameData(title, genre) {
        let apiUrl = `https://api.rawg.io/api/games?key=${apiKey}&search=${title}`;
        if (genre) {
            apiUrl += `&genres=${genre.toLowerCase()}`;
        }

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                applyFilters(data.results);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function applyFilters(games) {
        const filteredGames = games.filter(game => {
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

        renderGames(filteredGames);
    }

    function renderGames(games) {
        gameList.innerHTML = '';

        if (games.length === 0) {
            gameList.innerHTML = `<p class="text-center">No games found</p>`;
            return;
        }

        games.forEach((game, index) => {
            const gameCard = `
                <div class="col">
                    <div class="card h-60">
                        <img src="${game.background_image}" class="card-img-top" alt="${game.name}">
                        <div class="card-body">
                            <h5 class="card-title">${game.name}</h5>
                            <p class="card-text">Genre: ${game.genres.map(genre => genre.name).join(', ')}</p>
                            <p class="card-text">Rating: ★${'★'.repeat(Math.floor(game.rating))} (${game.rating}/5)</p>
                            <p class="card-text">Release Year: ${game.released ? game.released.substring(0, 4) : 'N/A'}</p>
                            
                            <div class="user-rating">
                                <input type="number" id="user-rating-${index}" class="form-control mb-2" placeholder="Your Rating (1-5)" min="1" max="5">
                                <button class="btn btn-primary" onclick="submitUserRating(${index})">Submit Rating</button>
                            </div>

                            <p id="user-rating-display-${index}" class="user-rating-display"></p>
                            
<<<<<<< Updated upstream
                            <button class="btn btn-danger">Delete</button>
=======
                            <button class="btn btn-danger">Details</button>
>>>>>>> Stashed changes
                        </div>
                    </div>
                </div>
            `;
            gameList.innerHTML += gameCard;
        });
    }

    window.submitUserRating = (index) => {
        const userRatingInput = document.getElementById(`user-rating-${index}`);
        const userRatingDisplay = document.getElementById(`user-rating-display-${index}`);
        const userRatingValue = parseInt(userRatingInput.value);

        if (userRatingValue >= 1 && userRatingValue <= 5) {
            userRatingDisplay.innerHTML = `Your Rating: ★${'★'.repeat(userRatingValue)} (${userRatingValue}/5)`;
        } else {
<<<<<<< Updated upstream
            userRatingDisplay.innerHTML = `<p class="text-danger">Please input a valid rating.</p>`;
=======
            userRatingDisplay.innerHTML = `<p class="text-danger">Please enter a valid rating between 1 and 5.</p>`;
>>>>>>> Stashed changes
        }
    };
});


