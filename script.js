const inputBox = document.querySelector("#searchInput");
const searchIcon = document.querySelector(".searchIcon");
const SearchBox = document.querySelector(".search-box");

const heroSide = document.querySelector(".hero-side");
const MovieList = document.querySelector(".section");
const apiKey = `11ab1117a036358d42f55b2320020a34`;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_PATH = "https://images.tmdb.org/t/p/w500";

async function fetchPopularMovie() {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${apiKey}`);
  const data = await response.json();
  DisplayFeaturedTodayMovie(data);
}

async function DisplayFeaturedTodayMovie(data) {
  const allMovies = data.results;

  if (!allMovies || allMovies.length === 0) return;

  const randomIndex = Math.floor(Math.random() * allMovies.length);
  const movie = allMovies[randomIndex];

  const { title, overview, release_date, poster_path } = movie;

  const HeroContent = document.querySelector(".hero");
  if (!HeroContent) return;

  HeroContent.innerHTML = "";

  const contentDiv = document.createElement("div");
  contentDiv.classList.add("hero-content");
  contentDiv.innerHTML = `
        <span class="hero-badge">🔥 Featured Today</span>
        <h1>${title}</h1>
        <p>${overview}</p>

        <div class="hero-meta">
            <span>2h 40m</span>
            <span>${release_date}</span>
            <span>Action</span>
            <span>IMDb 8.9</span>
        </div>

        <div class="hero-buttons">
            <a href="#" class="btn btn-primary"><i class="fas fa-play"></i> View Details</a>
            <button class="btn btn-secondary trailer-btn"><i class="fas fa-circle-play"></i> Watch Trailer</button>
        </div>
    `;

  const posterDiv = document.createElement("div");
  posterDiv.classList.add("hero-side");
  posterDiv.innerHTML = `
        <img src="${IMAGE_PATH + poster_path}" alt="${title}">
    `;

  HeroContent.appendChild(contentDiv);
  HeroContent.appendChild(posterDiv);

  HeroContent.style.display = "grid";
  HeroContent.style.gridTemplateColumns = "1.35fr 0.65fr";
  HeroContent.style.gap = "40px";
  HeroContent.style.alignItems = "center";
  HeroContent.style.minHeight = "420px";
  HeroContent.style.padding = "34px";

  const posterImg = posterDiv.querySelector("img");
  if (posterImg) {
    posterImg.style.width = "100%";
    posterImg.style.maxWidth = "340px";
    posterImg.style.height = "auto";
    posterImg.style.borderRadius = "20px";
    posterImg.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.5)";
    posterImg.style.border = "8px solid rgba(255,255,255,0.12)";
  }

  if (window.innerWidth <= 1100) {
    HeroContent.style.gridTemplateColumns = "1fr";
    HeroContent.style.textAlign = "center";
    posterDiv.style.order = "-1";
    posterDiv.style.marginBottom = "30px";
  }
}
async function FetchNowPlayingMovie() {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`,
    );

    if (!response.ok) throw new Error("Failed to fetch now playing movies");

    const data = await response.json();

    DisplayMovieNowPlaying(data);
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
  }
}

function DisplayMovieNowPlaying(data) {
  const NowPlayingSection = document.querySelector(".continue-row");

  NowPlayingSection.innerHTML = "";
  const moviesToShow = data.results.slice(0, 16);
  moviesToShow.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
                    <div class="rating">⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</div>
                    <img src="${IMAGE_PATH + movie.poster_path}" alt="${movie.title}">
                    <div class="movie-info">
                        <h3>${movie.title}</h3>
                        <p>${movie.release_date || "Unknown"}</p>
                        <div class="movie-actions">
                            <a href="#?id=${movie.id}" class="small-btn">Details</a>
                            <button class="heart-btn"><i class="far fa-heart"></i></button>
                        </div>
                    </div>
                `;

    NowPlayingSection.appendChild(movieCard);
  });
}

//fetch trending  movie for the past week

async function FetchTrendingMovie() {
  //length of trending. it could be day, week or month
  const forHowLong = "week";
  const response = await fetch(
    `${BASE_URL}/trending/movie/${forHowLong}?api_key=${apiKey}`,
  );
  const data = await response.json();
  DisplayTrendingMovie(data);
}

function DisplayTrendingMovie(data) {
  const TrendinGMovie = document.querySelector(".searchable-grid");

  TrendinGMovie.innerHTML = "";

  // Loop through the first 20 movies
  data.results.slice(0, 15).forEach((movie) => {
    const { title, release_date, poster_path, vote_average } = movie;

    const MovieCard = document.createElement("div");
    MovieCard.classList.add("movie-card");

    MovieCard.innerHTML = `
                    <div class="rating">⭐ ${vote_average.toFixed(2)}</div>
                    <img src="${IMAGE_PATH + poster_path}" alt="${title}">
                    <div class="movie-info">
                        <h3>${title}</h3>
                        <p>${release_date}</p>
                        <div class="movie-actions">
                            <a href="#?id=${movie.id}" class="small-btn">Details</a>
                            <button class="heart-btn"><i class="far fa-heart"></i></button>
                        </div>
                    </div>
                `;

    TrendinGMovie.appendChild(MovieCard);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const LinkOfMovieList = document.getElementById("Movie-list-link");

  // Only add event listener if the element exists (i.e., on index.html)
  if (LinkOfMovieList) {
    LinkOfMovieList.addEventListener("click", function (e) {
      e.preventDefault();
      window.location.href = "movies.html";
    });
  }

  if (window.location.href.includes("movies.html")) {
    const container = document.querySelector(".searchable-grid");

    if (container) {
      container.innerHTML =
        "<p style='color:white; text-align:center; grid-column:1/-1; padding:30px;'>Loading 100 movies...</p>";

      let allMovies = [];

      // Fetch 6 pages = 120 movies (to be safe)
      const promises = [];
      for (let page = 1; page <= 6; page++) {
        promises.push(
          fetch(
            `${BASE_URL}/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=${page}`,
          ).then((res) => res.json()),
        );
      }

      Promise.all(promises)
        .then((results) => {
          results.forEach((pageData) => {
            if (pageData.results) {
              allMovies = allMovies.concat(pageData.results);
            }
          });

          // Take exactly 100 movies (or more if you want)
          const finalMovies = allMovies.slice(0, 110);

          container.innerHTML = "";

          finalMovies.forEach((movie) => {
            const card = document.createElement("div");
            card.classList.add("movie-card");

            card.innerHTML = `
                                <div class="rating">⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</div>
                                <img src="${IMAGE_PATH}${movie.poster_path}" alt="${movie.title}">
                                <div class="movie-info">
                                    <h3>${movie.title}</h3>
                                    <p>${movie.release_date || "Unknown"}</p>
                                    <div class="movie-actions">
                                        <a href="#?id=${movie.id}" class="small-btn">Details</a>
                                        <button class="heart-btn"><i class="far fa-heart"></i></button>
                                    </div>
                                </div>
                            `;

            container.appendChild(card);
          });
        })
        .catch((err) => {
          console.error(err);
          container.innerHTML =
            "<p style='color:white; text-align:center; grid-column:1/-1;'>Failed to load movies.</p>";
        });
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const movieCards = document.querySelectorAll(".movie-card");

      let hasResults = false;

      // Filter movie cards
      movieCards.forEach((card) => {
        const titleElement = card.querySelector("h3");

        if (titleElement) {
          const title = titleElement.textContent.toLowerCase();

          if (searchTerm === "" || title.includes(searchTerm)) {
            card.style.display = "block";
            if (searchTerm !== "") hasResults = true;
          } else {
            card.style.display = "none";
          }
        }
      });

      // Show "No results found" only when user is searching and nothing matches
      const container =
        document.querySelector(".searchable-grid") ||
        document.querySelector(".movie-grid");

      if (container) {
        // Remove previous no-results message
        const existingMsg = document.getElementById("no-results-msg");
        if (existingMsg) existingMsg.remove();

        if (searchTerm !== "" && !hasResults) {
          const noResults = document.createElement("p");
          noResults.id = "no-results-msg";
          noResults.style.cssText =
            "color: white; text-align: center; grid-column: 1/-1; padding: 40px 20px; font-size: 18px;";
          noResults.textContent = `No results found for "${searchInput.value}"`;
          container.appendChild(noResults);
        }
      }
    });
  }
});

document.addEventListener("click", function (e) {
  if (e.target.closest(".heart-btn")) {
    const heartBtn = e.target.closest(".heart-btn");
    const movieCard = heartBtn.closest(".movie-card");

    if (!movieCard) return;

    heartBtn.classList.toggle("active");

    const title = movieCard.querySelector("h3").textContent.trim();
    const poster = movieCard.querySelector("img").src;
    const rating = movieCard.querySelector(".rating").textContent.trim();
    const releaseDate = movieCard
      .querySelector(".movie-info p")
      .textContent.trim();
    const id =
      movieCard.querySelector("a").getAttribute("href").split("=")[1] ||
      Date.now().toString();

    const movieData = {
      id: id,
      title: title,
      poster: poster,
      rating: rating,
      releaseDate: releaseDate,
    };

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (heartBtn.classList.contains("active")) {
      // Add to favorites
      if (!favorites.some((m) => m.id === movieData.id)) {
        favorites.push(movieData);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        showSuccessMessage(title, "added");
      }
    } else {
      // Remove from favorites
      favorites = favorites.filter((m) => m.id !== movieData.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      showSuccessMessage(title, "removed");
    }
  }
});

function showSuccessMessage(title, action) {
  const msg = document.createElement("div");
  msg.style.cssText = `
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                background: ${action === "added" ? "#10b981" : "#ef4444"};
                color: white; padding: 14px 24px; border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 10000; font-weight: 600;
            `;
  msg.textContent =
    action === "added"
      ? `"${title}" added to favorites`
      : `"${title}" removed from favorites`;

  document.body.appendChild(msg);

  setTimeout(() => {
    msg.style.opacity = "0";
    setTimeout(() => msg.remove(), 400);
  }, 2500);
}

document.addEventListener("DOMContentLoaded", function () {
  if (!window.location.href.includes("favorites.html")) return;

  // Small delay to make sure DOM is fully loaded
  setTimeout(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const mainContent = document.querySelector(".main-content");
    const emptySection = document.querySelector(".empty-card");

    if (favorites.length === 0) {
      return; // keep empty state
    }

    // Force remove empty state
    if (emptySection) {
      emptySection.style.display = "none";
      emptySection.remove();
    }

    // Create favorites section
    const section = document.createElement("section");
    section.className = "section";
    section.innerHTML = `<div class="section-header"><h2>Your Favorites</h2></div>`;

    const grid = document.createElement("div");
    grid.className = "movie-grid searchable-grid";

    favorites.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("movie-card");

      card.innerHTML = `
                        <div class="rating">${movie.rating}</div>
                        <img src="${movie.poster}" alt="${movie.title}">
                        <div class="movie-info">
                            <h3>${movie.title}</h3>
                            <p>${movie.releaseDate}</p>
                            <div class="movie-actions">
                                <a href="#?id=${movie.id}" class="small-btn">Details</a>
                                <button class="heart-btn active"><i class="fas fa-heart"></i></button>
                            </div>
                        </div>
                    `;

      grid.appendChild(card);
    });

    section.appendChild(grid);
    if (mainContent) mainContent.appendChild(section);
  }, 100); // small delay to ensure DOM is ready
});

document.addEventListener("DOMContentLoaded", function () {
  if (window.location.href.includes("favorites.html")) {
    const grid = document.querySelector(".searchable-grid");
    if (grid) {
      grid.innerHTML = ""; // Clear trending movies
    }
  }
});

document.addEventListener("click", function (e) {
  if (e.target.closest(".small-btn")) {
    const btn = e.target.closest(".small-btn");
    const movieCard = btn.closest(".movie-card");

    if (!movieCard) return;

    // Find or create overview container
    let overviewDiv = movieCard.querySelector(".movie-overview");

    if (!overviewDiv) {
      // Get movie ID
      const href = btn.getAttribute("href");
      const movieId = href.split("=")[1];

      if (!movieId) return;

      // Create overview div
      overviewDiv = document.createElement("div");
      overviewDiv.classList.add("movie-overview");
      overviewDiv.style.display = "none";
      overviewDiv.style.padding = "16px";
      overviewDiv.style.background = "rgba(0,0,0,0.7)";
      overviewDiv.style.color = "#fff";
      overviewDiv.style.borderRadius = "0 0 22px 22px";
      overviewDiv.style.fontSize = "14px";
      overviewDiv.style.lineHeight = "1.6";

      // Insert after image
      const img = movieCard.querySelector("img");
      if (img) {
        img.parentNode.insertBefore(overviewDiv, img.nextSibling);
      } else {
        movieCard.appendChild(overviewDiv);
      }

      // Fetch overview
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`,
      )
        .then((res) => res.json())
        .then((movie) => {
          overviewDiv.innerHTML = `
                        <strong>Overview:</strong><br>
                        ${movie.overview || "No overview available."}
                    `;
        })
        .catch(() => {
          overviewDiv.innerHTML = "Failed to load overview.";
        });
    }

    // Toggle slide up / down
    if (
      overviewDiv.style.display === "none" ||
      overviewDiv.style.display === ""
    ) {
      overviewDiv.style.display = "block";
      overviewDiv.style.animation = "slideUp 0.4s ease forwards";
    } else {
      overviewDiv.style.animation = "slideDown 0.4s ease forwards";
      setTimeout(() => {
        overviewDiv.style.display = "none";
      }, 400);
    }
  }
});

// Add keyframes for slide animation (add this once at the bottom)
const style = document.createElement("style");
style.innerHTML = `
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes slideDown {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(20px); }
            }
        `;
document.head.appendChild(style);

fetchPopularMovie();
FetchNowPlayingMovie();
// Do NOT call FetchTrendingMovie() on favorites.html
if (!window.location.href.includes("favorites.html")) {
  FetchTrendingMovie();
}
