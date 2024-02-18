
import songDatabase from './songsDatabase.js';

document.addEventListener("DOMContentLoaded", function () {
    
    const audioPlayer = document.getElementById("audioPlayer");
    var songSearchInput = document.getElementById("songSearch");
    const searchResultsContainer = document.getElementById("searchResults");
    const playPauseButton = document.querySelector('.playBtnspan');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressBarTooltip = document.querySelector('.progress-bar-tooltip');
    const musicPlayer = document.querySelector('.music-player');
    const songContainer = document.querySelector('.song-container');
    const songBoxes = document.querySelectorAll('.song-box');
    const body = document.getElementsByTagName('body')[0];
    
    console.log("Ummm you shouldnt be checking this websites console but since u are here lemme show some useless info :-");
    console.log("Total Songs",songDatabase);

    musicPlayer.style.display = 'none';

    
    let isPlaying = false;

    songSearchInput.addEventListener("input", handleSearchInput);
    searchResultsContainer.addEventListener("click", handleSearchResultClick);
    playPauseButton.addEventListener("click", togglePlayPause);

    audioPlayer.addEventListener("timeupdate", updateProgressBar);
    audioPlayer.addEventListener("ended", () => isPlaying = false);
    audioPlayer.addEventListener("timeupdate", updateProgressBar);
    audioPlayer.addEventListener("durationchange", updateTotalTime);
    audioPlayer.addEventListener("ended", () => isPlaying = false);

    progressBarContainer.addEventListener("click", handleProgressBarClick);
    


    document.addEventListener('click', function (event) {
        const searchBar = document.getElementById('songSearch');
        const searchResults = document.querySelector('.search-results');
        const sidebar = document.querySelector('.menu__box');
    
        // Check if the click is outside the search bar and results
        if (!searchBar.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = 'none';
        }
    
        
    });
    

    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 32) {
            event.preventDefault();
            togglePlayPause();
        }
    });

    document.getElementById('playerImg').addEventListener('click', function () {
        document.getElementById('playerImg').classList.toggle('music-player-rotate');
    });
    


    const songScrollContainer = document.getElementById('phonk'); // Assuming 'phonk' is the ID of the song scroll container

function scrollSongBoxes() {
  // Scroll to the next position
  songScrollContainer.scrollLeft += 1;

  // Check if reached the end, then reset to the beginning
  if (songScrollContainer.scrollLeft >= songScrollContainer.scrollWidth - songScrollContainer.clientWidth) {
    songScrollContainer.scrollLeft = 0;
  }
}

// Set an interval to scroll every 50 milliseconds (adjust the speed as needed)
setInterval(scrollSongBoxes, 50);




   // Shuffle the songDatabase array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Shuffled songDatabase
const shuffledSongDatabase = shuffleArray(songDatabase);

songBoxes.forEach(function (songBox, index) {
    const shuffledSong = shuffledSongDatabase[index];
    const songName = songBox.querySelector('.song-title');
    const songImg = songBox.querySelector('.song-img');

    // Set the text content of the song title
    songName.textContent = shuffledSong.title;

    // Set the source (image URL) of the img element
    songImg.style.backgroundImage = `url("${shuffledSong.image}")`;

    songBox.addEventListener('click', function () {
        const songNameClicked = songName.textContent;
        const foundSong = shuffledSongDatabase.find(song => song.title === songNameClicked);

        if (foundSong) {
            const songSrc = foundSong.src;
            const imageSrc = foundSong.image;
            const category = foundSong.category; // Retrieve the category

            Switch();
            playSelectedSong(songSrc, imageSrc, category); // Pass the category to playSelectedSong
        }
    });
});



function filterSongsByCategory(category) {
    const filteredSongs = songDatabase.filter(song => song.category === category);
    console.log(category)
    console.log(filteredSongs);
    return filteredSongs;
    
}
const phonkArray = filterSongsByCategory( 'Phonk Songs');
const englishArray = filterSongsByCategory('English Songs');
const romantichArray = filterSongsByCategory('Romantic Songs'); 
const hollywoodArray = filterSongsByCategory('Hollywood Songs');    




    function handleSearchInput() {
        const searchTerm = songSearchInput.value.toLowerCase();
        const searchResults = songDatabase.filter(song =>
            song.title.toLowerCase().includes(searchTerm)
        );

        displaySearchResults(searchResults);
    }

    function displaySearchResults(results) {
        const resultsHTML = results.map(({ title, src }) =>
            `<div data-src="${src}">${title}</div>`
        ).join("");

        searchResultsContainer.innerHTML = resultsHTML;
        searchResultsContainer.style.display = results.length > 0 ? "block" : "none";
    }

    function handleSearchResultClick(event) {
        const target = event.target;
        if (target.tagName === "DIV" && target.dataset.src) {
            const songSrc = target.dataset.src;
    
            // Find the corresponding song in the database
            const foundSong = songDatabase.find(song => song.src === songSrc);
    
            if (foundSong) {
                const imageSrc = foundSong.image;
                const category = foundSong.category;
    
                Switch();
                playSelectedSong(songSrc, imageSrc, category);
            }
        }
    }
    

     
    // Add an event listener for the popstate event
window.addEventListener('popstate', function (event) {
    // Check if the event.state is defined and contains the information you set during the Switch
    if (event.state && event.state.switched) {
        // Reverse the Switch
        reverseSwitch();
    }
});

// Function to perform the reverse Switch
function reverseSwitch() {
    musicPlayer.style.display = 'none';
    songContainer.style.display = 'grid';
    body.style.backgroundImage = 'url("your-original-background-image-url")';

    // Remove custom classes from search-bar and search-results
    const searchBar = document.querySelector('.search-bar');
    const searchResults = document.querySelector('.search-results');

    searchBar.classList.remove('customsearch-bar');
    searchResults.classList.remove('customsearch-results');
}

// Function to trigger the Switch and set state
function Switch() {
    musicPlayer.style.display = 'grid';
    songContainer.style.display = 'none';
    body.style.backgroundImage = 'url("https://wallpapers.com/images/high/chill-music-background-qizu4za4rxw20upo.webp")';

    // Add custom classes to search-bar and search-results
    const searchBar = document.querySelector('.search-bar');
    const searchResults = document.querySelector('.search-results');

    searchBar.classList.add('customsearch-bar');
    searchResults.classList.add('customsearch-results');

    // Set state to include information about the Switch
    const state = { switched: true };
    history.pushState(state, '', ''); // pushState to update the browsing history
}


    

function playSelectedSong(songSrc, imageSrc, songCategory) {
    audioPlayer.src = songSrc;
    audioPlayer.play();

    // Update album art or image
    const albumArt = document.getElementById('playerImg');
    if (imageSrc) {
        albumArt.src = imageSrc;
        albumArt.style.display = 'block';
    } else {
        albumArt.style.display = 'none';
    }

    // Check if the category div is already present
    const existingCategoryDiv = albumArt.parentNode.querySelector('.song-category');
    if (existingCategoryDiv) {
        // Remove the existing category div
        existingCategoryDiv.remove();
    }

    // Find the corresponding song in the database
    const foundSong = shuffledSongDatabase.find(song => song.src === songSrc);

    // Create a div for displaying song category
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'songInfo song-category';
    categoryDiv.textContent = `Category: ${songCategory}`;

    // Insert the category div below the music image
    albumArt.parentNode.insertBefore(categoryDiv, albumArt.nextSibling);

    // Check if the author div is already present
    const existingAuthorDiv = albumArt.parentNode.querySelector('.song-author');
    if (existingAuthorDiv) {
        // Remove the existing author div
        existingAuthorDiv.remove();
    }

    // Create a div for displaying song author
    const authorDiv = document.createElement('div');
    authorDiv.className = 'songInfo song-author';

    if (foundSong.author == " ") {
        authorDiv.textContent = `Artist: ${'Unknown'}`;
    } else {
        authorDiv.textContent = `Artist: ${foundSong.author || 'Unknown'}`;
    }

    // Insert the author div below the category div
    albumArt.parentNode.insertBefore(authorDiv, categoryDiv.nextSibling);

    // Check if the title div is already present
    const existingTitleDiv = albumArt.parentNode.querySelector('.song-title');
    if (existingTitleDiv) {
        // Remove the existing title div
        existingTitleDiv.remove();
    }

    // Create a div for displaying song title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'songInfo song-title';
    titleDiv.textContent = `Song Name: ${foundSong.title || 'Unknown'}`;

    // Insert the title div below the song image
    albumArt.parentNode.insertBefore(titleDiv, albumArt.nextSibling);

    songSearchInput.value = "";
    searchResultsContainer.style.display = "none";
    isPlaying = true;
    updatePlayPauseButton();
    console.log("Played selected song");
}

// Add an event listener for the 'ended' event on the audioPlayer
audioPlayer.addEventListener('ended', function() {

   
    console.log("Audio playback ended."); // Check if the event listener is triggered

    // Get the current category from the displayed category div
    const currentCategoryDiv = document.querySelector('.song-category');
    if (currentCategoryDiv) {
        const currentCategory = currentCategoryDiv.textContent.replace('Category: ', '').trim();
        console.log("Current Category:", currentCategory); // Log the retrieved current category

        // Play a random song from the same category
        playRandomSongFromCategory(currentCategory);
    }
});

// Function to play a random song from the specified category
function playRandomSongFromCategory(category) {
    let categoryArray;

    // Determine the array based on the category
    switch (category) {
        case 'Phonk Songs':
            categoryArray = phonkArray;
            break;
        case 'English Songs':
            categoryArray = englishArray;
            break;
        case 'Romantic Songs':
            categoryArray = romantichArray;
            break;
        case 'Hollywood Songs':
            categoryArray = hollywoodArray;
            break;
        default:
            // Handle other categories or provide a default array
            console.log("Unknown category:", category);
            break;
    }

    // Check if there are songs in the category array
    if (categoryArray && categoryArray.length > 0) {
        // Get a random index
        const randomIndex = Math.floor(Math.random() * categoryArray.length);
        console.log("Random Index:", randomIndex);

        // Get the random song from the array
        const randomSong = categoryArray[randomIndex];
        console.log("Random Song:", randomSong);

        // Play the random song
        playSelectedSong(randomSong.src, randomSong.image, category);

        // Update the currently playing category div
        updatePlayingCategory(category);
    } else {
        console.log("No songs found in category:", category);
    }
}

// Function to update the currently playing category div
function updatePlayingCategory(category) {
    // Get the currently playing category div or create a new one
    let playingCategoryDiv = document.querySelector('.playing-category');
    if (!playingCategoryDiv) {
        playingCategoryDiv = document.createElement('div');
        playingCategoryDiv.className = 'playing-category';
        document.querySelector('.music-player').insertBefore(playingCategoryDiv, document.getElementById('playerImg'));
    }

    // Update the text content of the playing category div
    playingCategoryDiv.textContent = `Playing songs from same category: ${category}`;
    console.log("Playing category updated:", category);
}




    
    function updateProgressBar() {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        const progress = (currentTime / duration) * 100;

        // Update the progress bar visually
        document.querySelector('.progress-bar').style.width = progress + '%';

        // Update the current time display
        document.querySelector('.current-time').textContent = formatTime(currentTime);

        // Update the tooltip position and content
        updateTooltip(currentTime, duration);
    }

    function togglePlayPause() {
        if (isPlaying) {
            audioPlayer.pause();
        } else {
            audioPlayer.play();
        }
        isPlaying = !isPlaying;
        updatePlayPauseButton();
    }

    function updatePlayPauseButton() {
        playPauseButton.textContent = isPlaying ? 'Pause' : 'Play';
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function updateTotalTime() {
        const duration = audioPlayer.duration;
        document.querySelector('.total-time').textContent = formatTime(duration);
    }

    function handleProgressBarClick(event) {
        const progressBarContainerRect = progressBarContainer.getBoundingClientRect();
        const clickPosition = event.clientX - progressBarContainerRect.left;
        const seekTime = (clickPosition / progressBarContainerRect.width) * audioPlayer.duration;

        // Update the audio current time to the selected position
        audioPlayer.currentTime = seekTime;
    }

    function updateTooltip(currentTime, duration) {
        const timeLeft = duration - currentTime;

        const tooltipText = `${formatTime(currentTime)} / ${formatTime(duration)} - ${formatTime(timeLeft)}`;
        progressBarTooltip.textContent = tooltipText;
    }

    //<loading>

    const loadingSpinner = document.querySelector('.loader');

    audioPlayer.addEventListener("timeupdate", updateProgressBar);
    audioPlayer.addEventListener("ended", () => {
        isPlaying = false;
        loadingSpinner.style.display = 'none';
    });

    audioPlayer.addEventListener("playing", () => {
        isPlaying = true;
        loadingSpinner.style.display = 'none';
    });

    audioPlayer.addEventListener("waiting", () => {
        loadingSpinner.style.display = 'block';
    });

    //</loading>

 //cool cursor
    const cursor = document.querySelector('.cursor');

        document.addEventListener('mousemove', e => {
            cursor.setAttribute("style", "top: "+(e.pageY - 10)+"px; left: "+(e.pageX - 10)+"px;")
        })

        document.addEventListener('click', () => {
            cursor.classList.add("expand");

            setTimeout(() => {
                cursor.classList.remove("expand");
            }, 500)
        })

        //<the end?>
});



