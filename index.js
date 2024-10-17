document.addEventListener('DOMContentLoaded', () => {
    const gameForm = document.getElementById('game-form');
    const gameList = document.getElementById('game-list');
    const ratingFilter = document.getElementById('rating-filter');
    const releaseYearFilter = document.getElementById('release-year-filter');
    const apiKey = 'bdaadfbc69b6442fb0a533ec2d7ccf87'; // Replace with your actual RAWG API key.

    // Event listener for the form submit
    gameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const gameTitle = document.getElementById('game-title').value;
        const gameGenre = document.getElementById('game-genre').value;
        fetchGameData(gameTitle, gameGenre);
    });

    // Function to fetch game data from RAWG API
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

    // Function to apply rating and release year filters
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

    // Function to render the games with user rating and wishlist feature
    function renderGames(games) {
        gameList.innerHTML = ''; // Clear previous results

        if (games.length === 0) {
            gameList.innerHTML = `<p class="text-center">No games found</p>`;
            return;
        }

        games.forEach(game => {
            const gameId = game.id;

            const gameCard = `
                <div class="col">
                    <div class="card h-100">
                        <img src="${game.background_image}" class="card-img-top" alt="${game.name}">
                        <div class="card-body">
                            <h5 class="card-title">${game.name}</h5>
                            <p class="card-text">Genre: ${game.genres.map(genre => genre.name).join(', ')}</p>
                            <p class="card-text">Rating: ★${'★'.repeat(Math.floor(game.rating))} (${game.rating}/5)</p>
                            <p class="card-text">Release Year: ${game.released ? game.released.substring(0, 4) : 'N/A'}</p>

                            <!-- User Rating Section -->
                            <div>
                                <label for="user-rating-${gameId}">Your Rating:</label>
                                <input type="number" id="user-rating-${gameId}" class="form-control" min="1" max="5" placeholder="Rate 1-5">
                                <button type="button" class="btn btn-primary mt-2" data-game-id="${gameId}" data-game-name="${game.name}" data-action="rate">Submit Rating</button>
                            </div>

                            <p id="user-rating-display-${gameId}" class="mt-3"></p>

                            <!-- Wishlist Button -->
                            <button type="button" class="btn btn-secondary mt-2" data-game-id="${gameId}" data-game-name="${game.name}" data-action="wishlist">Add to Wishlist</button>
                        </div>
                    </div>
                </div>
            `;
            gameList.innerHTML += gameCard;
        });
    }

    // Event delegation for handling user rating and wishlist submission
    gameList.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const gameId = event.target.getAttribute('data-game-id');
            const gameName = event.target.getAttribute('data-game-name');
            const action = event.target.getAttribute('data-action');

            if (action === 'rate') {
                submitUserRating(gameId, gameName);
            } else if (action === 'wishlist') {
                addToWishlist(gameId, gameName);
            }
        }
    });

    // Function to handle user rating submission
    function submitUserRating(gameId, gameName) {
        const userRatingInput = document.getElementById(`user-rating-${gameId}`);
        const userRatingDisplay = document.getElementById(`user-rating-display-${gameId}`);
        const userRating = parseInt(userRatingInput.value);

        if (userRating >= 1 && userRating <= 5) {
            userRatingDisplay.innerHTML = `<strong>${gameName}</strong> - Your Rating: ★${'★'.repeat(userRating)} (${userRating}/5)`;

            // Save the rating to the JSON server
            fetch('http://localhost:3000/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameId, gameName, userRating }),
            })
            .then(() => {
                console.log('Rating submitted to server');
            })
            .catch(error => {
                console.error('Error submitting rating:', error);
            });

            userRatingInput.value = ''; // Clear input after submission
        } else {
            alert('Please enter a rating between 1 and 5.');
        }
    }

    // Function to add a game to the wishlist
    function addToWishlist(gameId, gameName) {
        fetch('http://localhost:3000/wishlists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ gameId, gameName }),
        })
        .then(() => {
            alert(`${gameName} has been added to your wishlist.`);
            fetchWishlist(); // Refresh the wishlist after adding
        })
        .catch(error => {
            console.error('Error adding to wishlist:', error);
        });
    }

    // Fetch the wishlist when the page loads
    fetchWishlist();

    // Function to fetch and display the wishlist
    function fetchWishlist() {
        fetch('http://localhost:3000/wishlists') // Ensure the endpoint matches the correct collection
            .then(response => response.json())
            .then(data => {
                const wishlist = data; // Access the wishlists array directly
                const wishlistContainer = document.getElementById('wishlist');
                wishlistContainer.innerHTML = ''; // Clear existing wishlist

                if (wishlist.length === 0) {
                    wishlistContainer.innerHTML = `<p class="text-center">Your wishlist is empty</p>`;
                    return;
                }

                wishlist.forEach(item => {
                    const wishlistItem = `
                        <div class="col">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">${item.gameName}</h5>
                                    <button type="button" class="btn btn-danger mt-2" data-game-id="${item.gameId}" data-action="remove-wishlist">Remove</button>
                                </div>
                            </div>
                        </div>
                    `;
                    wishlistContainer.innerHTML += wishlistItem;
                });
            })
            .catch(error => {
                console.error('Error fetching wishlist:', error);
            });
    }

    // Event delegation for handling removing items from the wishlist
    document.getElementById('wishlist').addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.getAttribute('data-action') === 'remove-wishlist') {
            const gameId = event.target.getAttribute('data-game-id');
            removeFromWishlists(gameId);
        }
    });

    // Function to remove a game from the wishlist
    function removeFromWishlists(gameId) {
        fetch(`http://localhost:3000/wishlists/${gameId}`, { // Make sure this endpoint is correct
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert('Game removed from wishlist.');
                fetchWishlist(); // Refresh the wishlist after removal
            } else {
                throw new Error('Failed to remove the game.'); // Handle error response
            }
        })
        .catch(error => {
            console.error('Error removing from wishlist:', error);
            alert('There was an error removing the game from your wishlist. Please try again.');
        });
    }
});

