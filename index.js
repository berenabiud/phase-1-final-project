// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function() {

    // Get references to form elements
    const gameForm = document.getElementById('game-form');
    const gameTitleInput = document.getElementById('game-title');
    const gameGenreInput = document.getElementById('game-genre');
    const gameList = document.getElementById('game-list');

    // Handle form submission
    gameForm.addEventListener('submit', function(event) {
        event.preventDefault();  // Prevent the default form submission behavior

        // Get input values
        const gameTitle = gameTitleInput.value.trim();
        const gameGenre = gameGenreInput.value.trim();

        if (gameTitle === '' || gameGenre === '') {
            alert('Please enter both game title and genre');
            return;
        }

        // Create a new list item for the game
        const listItem = document.createElement('li');
        listItem.textContent = `Title: ${gameTitle}, Genre: ${gameGenre}`;
        
        // Add the new list item to the game list
        gameList.appendChild(listItem);

        // Clear the input fields
        gameTitleInput.value = '';
        gameGenreInput.value = '';
    });
});
