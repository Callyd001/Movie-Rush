// ==============================
// TMDB API
// ==============================

const API_KEY = "4b58fee4001f3a3a83fbb2ed26f47ae8";


// ==============================
// HTML ELEMENTS
// ==============================

const movieContainer = document.getElementById("movieContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const movieModal = document.getElementById("movieModal");
const movieDetails = document.getElementById("movieDetails");
const closeModal = document.getElementById("closeModal");

const viewAllBtn = document.getElementById("viewAllBtn");

const logo = document.querySelector(".logo");

const exploreButton = document.querySelector(".hero-btn");

const navLinks = document.querySelectorAll(".navbar nav a");


// ==============================
// STORE TRENDING MOVIES
// ==============================

let trendingMovies = [];


// ==============================
// GET TRENDING MOVIES
// ==============================

function getTrendingMovies() {

    movieContainer.innerHTML = `
        <p class="loading">
            Loading movies...
        </p>
    `;

    const url =
        `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=en-US`;

    fetch(url)

        .then(response => {

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            return response.json();

        })

        .then(data => {

            console.log("TRENDING MOVIES:", data);

            trendingMovies = data.results;

            // Show first 10 movies initially
            displayMovies(trendingMovies.slice(0, 10));

        })

        .catch(error => {

            console.error("TMDB ERROR:", error);

            movieContainer.innerHTML = `
                <p class="loading">
                    Unable to load movies!
                </p>
            `;

        });
}


// ==============================
// DISPLAY MOVIES
// ==============================

function displayMovies(movies) {

    movieContainer.innerHTML = "";

    if (!movies || movies.length === 0) {

        movieContainer.innerHTML = `
            <p class="loading">
                No movies found.
            </p>
        `;

        return;
    }


    movies.forEach(movie => {

        const title =
            movie.title ||
            movie.name ||
            "Untitled";


        const date =
            movie.release_date ||
            movie.first_air_date;


        const year =
            date
                ? date.substring(0, 4)
                : "N/A";


        const poster =
            movie.poster_path

                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`

                : "https://via.placeholder.com/500x750?text=No+Poster";


        // Create movie card

        const movieCard =
            document.createElement("div");


        movieCard.classList.add("movie-card");


        movieCard.innerHTML = `

            <img
                src="${poster}"
                alt="${title}"
            >

            <div class="movie-info">

                <h3>
                    ${title}
                </h3>

                <div class="movie-meta">

                    <span>
                        ${year}
                    </span>

                    <span class="rating">

                        ⭐ ${
                            movie.vote_average
                                ? movie.vote_average.toFixed(1)
                                : "N/A"
                        }

                    </span>

                </div>

            </div>

        `;


        // Movie click

        movieCard.addEventListener(
            "click",
            function () {

                getMovieDetails(
                    movie.id,
                    movie.media_type
                );

            }
        );


        movieContainer.appendChild(movieCard);

    });
}


// ==============================
// SEARCH MOVIES
// ==============================

function searchMovies() {

    const searchTerm =
        searchInput.value.trim();


    if (searchTerm === "") {

        // If search is empty,
        // return to trending

        displayMovies(
            trendingMovies.slice(0, 10)
        );

        return;
    }


    movieContainer.innerHTML = `
        <p class="loading">
            Searching for "${searchTerm}"...
        </p>
    `;


    const url =
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}&language=en-US&page=1`;


    fetch(url)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );

            }

            return response.json();

        })

        .then(data => {

            console.log(
                "SEARCH RESULTS:",
                data
            );


            displayMovies(
                data.results
            );


            // Scroll to results

            movieContainer.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        })

        .catch(error => {

            console.error(
                "SEARCH ERROR:",
                error
            );


            movieContainer.innerHTML = `
                <p class="loading">
                    Unable to search movies!
                </p>
            `;

        });
}


// ==============================
// SEARCH BUTTON
// ==============================

searchBtn.addEventListener(
    "click",
    searchMovies
);


// ==============================
// PRESS ENTER TO SEARCH
// ==============================

searchInput.addEventListener(
    "keypress",
    function (event) {

        if (event.key === "Enter") {

            searchMovies();

        }

    }
);


// ==============================
// EXPLORE MOVIES BUTTON
// ==============================

exploreButton.addEventListener(
    "click",
    function () {

        document
            .querySelector(".movies-section")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    }
);


// ==============================
// VIEW ALL BUTTON
// ==============================

viewAllBtn.addEventListener(
    "click",
    function () {

        // Display all trending movies

        displayMovies(
            trendingMovies
        );


        // Change button

        viewAllBtn.textContent =
            "Showing All";


        // Disable button

        viewAllBtn.disabled = true;

    }
);


// ==============================
// NAVIGATION LINKS
// ==============================

navLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                document
                    .querySelector(".movies-section")
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            }
        );

    }
);


// ==============================
// MOVIERUSH LOGO → HOME
// ==============================

logo.addEventListener(
    "click",
    function () {

        // Clear search box

        searchInput.value = "";


        // Reset View All button

        viewAllBtn.textContent =
            "View All";

        viewAllBtn.disabled = false;


        // Restore original trending movies

        displayMovies(
            trendingMovies.slice(0, 10)
        );


        // Close movie modal if open

        movieModal.style.display =
            "none";


        // Scroll to homepage

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


// ==============================
// GET MOVIE DETAILS
// ==============================

function getMovieDetails(id, mediaType) {

    // If media type doesn't exist,
    // treat it as a movie

    if (!mediaType) {

        mediaType = "movie";

    }


    const url =
        `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}&language=en-US`;


    movieDetails.innerHTML = `
        <p class="loading">
            Loading movie details...
        </p>
    `;


    movieModal.style.display =
        "flex";


    fetch(url)

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    `HTTP Error: ${response.status}`
                );

            }

            return response.json();

        })

        .then(movie => {

            console.log(
                "MOVIE DETAILS:",
                movie
            );


            displayMovieDetails(
                movie
            );

        })

        .catch(error => {

            console.error(
                "DETAIL ERROR:",
                error
            );


            movieDetails.innerHTML = `
                <p class="loading">
                    Unable to load movie details.
                </p>
            `;

        });
}


// ==============================
// DISPLAY MOVIE DETAILS
// ==============================

function displayMovieDetails(movie) {

    const title =
        movie.title ||
        movie.name ||
        "N/A";


    const releaseDate =
        movie.release_date ||
        movie.first_air_date ||
        "N/A";


    const genres =
        movie.genres &&
        movie.genres.length > 0

            ? movie.genres
                .map(
                    genre => genre.name
                )
                .join(", ")

            : "N/A";


    const poster =
        movie.poster_path

            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`

            : "https://via.placeholder.com/500x750?text=No+Poster";


    movieDetails.innerHTML = `

        <div class="details-container">


            <div class="details-poster">

                <img
                    src="${poster}"
                    alt="${title}"
                >

            </div>


            <div class="details-info">

                <h2>
                    ${title}
                </h2>


                <p>

                    <strong>
                        Name:
                    </strong>

                    ${movie.name || title}

                </p>


                <p>

                    <strong>
                        Title:
                    </strong>

                    ${movie.title || title}

                </p>


                <p>

                    <strong>
                        Popularity:
                    </strong>

                    ${
                        movie.popularity
                            ? movie.popularity.toFixed(1)
                            : "N/A"
                    }

                </p>


                <p>

                    <strong>
                        Genre:
                    </strong>

                    ${genres}

                </p>


                <p>

                    <strong>
                        Rating:
                    </strong>

                    ⭐ ${
                        movie.vote_average
                            ? movie.vote_average.toFixed(1)
                            : "N/A"
                    }

                </p>


                <p>

                    <strong>
                        Release Date:
                    </strong>

                    ${releaseDate}

                </p>


                <div class="overview">

                    <h3>
                        Overview
                    </h3>

                    <p>

                        ${
                            movie.overview ||
                            "No overview available."
                        }

                    </p>

                </div>

            </div>

        </div>

    `;
}


// ==============================
// CLOSE MOVIE MODAL
// ==============================

closeModal.addEventListener(
    "click",
    function () {

        movieModal.style.display =
            "none";

    }
);


// ==============================
// CLOSE MODAL BY CLICKING OUTSIDE
// ==============================

movieModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === movieModal
        ) {

            movieModal.style.display =
                "none";

        }

    }
);


// ==============================
// START MOVIERUSH
// ==============================

getTrendingMovies();