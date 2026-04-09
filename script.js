const apiKey = `11ab1117a036358d42f55b2320020a34`;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";
const BACKDROP_PATH = "https://image.tmdb.org/t/p/original";

// DOM elements
const trendingRow = document.getElementById("trendingRow");
const actionRow = document.getElementById("actionRow");
const comedyRow = document.getElementById("comedyRow");
const horrorRow = document.getElementById("horrorRow");
const allMoviesRow = document.getElementById("allMoviesRow");
const favoritesRow = document.getElementById("favoritesRow");
const watchlistRow = document.getElementById("watchlistRow");

const heroBanner = document.getElementById("heroBanner");
const bannerTitle = document.getElementById("bannerTitle");
const bannerOverview = document.getElementById("bannerOverview");
const bannerTrailerBtn = document.getElementById("bannerTrailerBtn");
const bannerDetailsBtn = document.getElementById("bannerDetailsBtn");
const heroDots = document.getElementById("heroDots");

const trailerPopup = document.getElementById("trailerPopup");
const trailerFrame = document.getElementById("trailerFrame");
const closePopup = document.getElementById("closePopup");

const detailsPopup = document.getElementById("detailsPopup");
const detailsPoster = document.getElementById("detailsPoster");
const detailsTitle = document.getElementById("detailsTitle");
const detailsOverview = document.getElementById("detailsOverview");
const detailsRelease = document.getElementById("detailsRelease");
const detailsRating = document.getElementById("detailsRating");
const detailsRuntime = document.getElementById("detailsRuntime");
const detailsStatus = document.getElementById("detailsStatus");
const detailsGenreBadge = document.getElementById("detailsGenreBadge");
const detailsFavoriteBtn = document.getElementById("detailsFavoriteBtn");
const detailsWatchlistBtn = document.getElementById("detailsWatchlistBtn");
const detailsTrailerBtn = document.getElementById("detailsTrailerBtn");
const closeDetails = document.getElementById("closeDetails");

const globalLoading = document.getElementById("globalLoading");
const toast = document.getElementById("toast");

// Settings
const settingsPanel = document.getElementById("settingsPanel");
const openSettings = document.getElementById("openSettings");
const closeSettings = document.getElementById("closeSettings");
const saveSettings = document.getElementById("saveSettings");
const themeSelect = document.getElementById("themeSelect");
const cardSizeSelect = document.getElementById("cardSizeSelect");
const animToggle = document.getElementById("animToggle");
const sliderToggle = document.getElementById("sliderToggle");

// LocalStorage
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let currentDetailsMovie = null;

let heroMovies = [];
let heroIndex = 0;
let heroInterval = null;

// Settings defaults
let appSettings = JSON.parse(localStorage.getItem("movieAppSettings")) || {
  theme: "default",
  cardSize: "medium",
  animations: true,
  autoSlider: true,
};

// Helpers
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function showLoading() {
  if (globalLoading) globalLoading.style.display = "flex";
}

function hideLoading() {
  if (globalLoading) globalLoading.style.display = "none";
}

function getPrimaryGenre(movie) {
  const ids = movie.genre_ids || [];
  if (ids.includes(27)) return "Horror";
  if (ids.includes(35)) return "Comedy";
  if (ids.includes(28)) return "Action";
  if (ids.includes(878)) return "Sci-Fi";
  return "Movie";
}

function getPopupGenreClass(movie) {
  const ids = movie.genre_ids || [];
  if (ids.includes(27)) return "horror";
  if (ids.includes(35)) return "comedy";
  if (ids.includes(28)) return "action";
  if (ids.includes(878)) return "sci-fi";
  return "general";
}

function isInFavorites(id) {
  return favorites.some((fav) => fav.id === id);
}

function isInWatchlist(id) {
  return watchlist.some((w) => w.id === id);
}

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function saveWatchlist() {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

function addToFavorites(movie) {
  if (isInFavorites(movie.id)) {
    showToast(`${movie.title} is already in Favorites`);
    return false;
  }
  favorites.push(movie);
  saveFavorites();
  showToast(`${movie.title} added to Favorites ❤`);
  return true;
}

function addToWatchlist(movie) {
  if (isInWatchlist(movie.id)) {
    showToast(`${movie.title} is already in Watchlist`);
    return false;
  }
  watchlist.push(movie);
  saveWatchlist();
  showToast(`${movie.title} added to Watchlist ➕`);
  return true;
}

function removeFromFavorites(movieId) {
  favorites = favorites.filter((m) => m.id !== movieId);
  saveFavorites();
  if (favoritesRow) loadFavorites();
  showToast("Removed from Favorites");
}

function removeFromWatchlist(movieId) {
  watchlist = watchlist.filter((m) => m.id !== movieId);
  saveWatchlist();
  if (watchlistRow) loadWatchlist();
  showToast("Removed from Watchlist");
}

// Fetch
async function fetchMovies(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
}

async function fetchMovieDetails(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${apiKey}`);
  return await res.json();
}

async function fetchTrailer(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${apiKey}`);
  const data = await res.json();
  return data.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");
}

// Render movies
function renderMovies(movies, container) {
  if (!container) return;
  container.innerHTML = "";

  if (!movies.length) {
    container.innerHTML = `<p style="padding: 10px 0 20px 4px; color:#aaa;">No movies found.</p>`;
    return;
  }

  movies.forEach((movie) => {
    if (!movie.poster_path) return;

    const genre = getPrimaryGenre(movie);

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie-item");
    movieEl.dataset.genre = genre;

    const inFav = isInFavorites(movie.id);
    const inWatch = isInWatchlist(movie.id);
    const isFavPage = container.id === "favoritesRow";
    const isWatchPage = container.id === "watchlistRow";

    movieEl.innerHTML = `
      <img src="${IMAGE_PATH + movie.poster_path}" alt="${movie.title}">
      
      <div class="card-top">
        <span class="genre-pill">${genre}</span>
        <span class="score-pill">⭐ ${Number(movie.vote_average).toFixed(1)}</span>
      </div>

      <div class="movie-info">
        <h3>${movie.title}</h3>
        <div class="rating"></div>
      </div>

      <div class="quick-actions">
        <button class="favorite-btn" title="Favorite">${inFav ? "💖" : "❤"}</button>
        <button class="watchlist-btn" title="Watchlist">${inWatch ? "✓" : "+"}</button>
        <button class="trailer-btn" title="Trailer">▶</button>
        ${isFavPage ? `<button class="remove-btn remove-fav-btn" title="Remove">✖</button>` : ""}
        ${isWatchPage ? `<button class="remove-btn remove-watch-btn" title="Remove">✖</button>` : ""}
      </div>
    `;

    // Favorite button
    const favBtn = movieEl.querySelector(".favorite-btn");
    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      if (isInFavorites(movie.id)) {
        showToast(`${movie.title} is already in Favorites`);
      } else {
        addToFavorites(movie);
        favBtn.textContent = "❤️";
      }

      renderCurrentPageAgain();
    });

    // Watchlist button
    const watchBtn = movieEl.querySelector(".watchlist-btn");
    watchBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      if (isInWatchlist(movie.id)) {
        showToast(`${movie.title} is already in Watchlist`);
        watchBtn.textContent = "✓";
      } else {
        addToWatchlist(movie);
        watchBtn.textContent = "✓";
      }

      renderCurrentPageAgain();
    });

    // Trailer button
    movieEl.querySelector(".trailer-btn").addEventListener("click", async (e) => {
      e.stopPropagation();
      openTrailer(movie.id);
    });

    // Remove favorite button
    const removeFavBtn = movieEl.querySelector(".remove-fav-btn");
    if (removeFavBtn) {
      removeFavBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromFavorites(movie.id);
      });
    }

    // Remove watchlist button
    const removeWatchBtn = movieEl.querySelector(".remove-watch-btn");
    if (removeWatchBtn) {
      removeWatchBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeFromWatchlist(movie.id);
      });
    }

    // Card click -> details
    movieEl.addEventListener("click", () => showDetails(movie));

    container.appendChild(movieEl);
  });
}

function renderCurrentPageAgain() {
  if (document.body.contains(favoritesRow)) loadFavorites();
  if (document.body.contains(watchlistRow)) loadWatchlist();
}

// Trailer
async function openTrailer(movieId) {
  const trailer = await fetchTrailer(movieId);
  if (trailer) {
    trailerFrame.src = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
    trailerPopup.style.display = "flex";
  } else {
    showToast("Trailer not available");
  }
}

function closeTrailerPopup() {
  if (trailerPopup) trailerPopup.style.display = "none";
  if (trailerFrame) trailerFrame.src = "";
}

// Details
async function showDetails(movie) {
  showLoading();
  currentDetailsMovie = movie;

  try {
    const data = await fetchMovieDetails(movie.id);

    if (detailsPoster) detailsPoster.src = data.poster_path ? IMAGE_PATH + data.poster_path : "";
    if (detailsTitle) detailsTitle.textContent = data.title || "Untitled";
    if (detailsOverview) detailsOverview.textContent = data.overview || "No overview available.";
    if (detailsRelease) detailsRelease.textContent = data.release_date || "N/A";
    if (detailsRating) detailsRating.textContent = data.vote_average ? Number(data.vote_average).toFixed(1) : "N/A";
    if (detailsRuntime) detailsRuntime.textContent = data.runtime ? `${data.runtime} min` : "N/A";
    if (detailsStatus) detailsStatus.textContent = data.status || "N/A";

    const genreNames = data.genres?.map((g) => g.name) || [];
    const genreClass = getPopupGenreClass({ genre_ids: data.genres?.map(g => g.id) || movie.genre_ids || [] });

    if (detailsGenreBadge) {
      detailsGenreBadge.textContent = genreNames[0] || getPrimaryGenre(movie);
    }

    if (detailsPopup) {
      detailsPopup.className = `details-popup ${genreClass}`;
      detailsPopup.style.display = "flex";
    }

    if (detailsFavoriteBtn) {
      detailsFavoriteBtn.textContent = isInFavorites(movie.id) ? "❤ In Favorites" : "❤ Favorite";
    }

    if (detailsWatchlistBtn) {
      detailsWatchlistBtn.textContent = isInWatchlist(movie.id) ? "✓ In Watchlist" : "➕ Watchlist";
    }
  } catch (error) {
    showToast("Failed to load movie details");
  } finally {
    hideLoading();
  }
}

function closeDetailsPopup() {
  if (detailsPopup) detailsPopup.style.display = "none";
}

// Hero slider
function updateHero(movie) {
  if (!heroBanner || !movie) return;

  heroBanner.style.backgroundImage = `url(${BACKDROP_PATH + (movie.backdrop_path || movie.poster_path)})`;
  bannerTitle.textContent = movie.title || "Trending Movie";
  bannerOverview.textContent = movie.overview || "No overview available.";

  if (bannerTrailerBtn) {
    bannerTrailerBtn.onclick = () => openTrailer(movie.id);
  }

  if (bannerDetailsBtn) {
    bannerDetailsBtn.onclick = () => showDetails(movie);
  }

  renderHeroDots();
}

function renderHeroDots() {
  if (!heroDots || !heroMovies.length) return;

  heroDots.innerHTML = "";
  heroMovies.slice(0, 6).forEach((_, index) => {
    const dot = document.createElement("div");
    dot.className = `hero-dot ${index === heroIndex ? "active" : ""}`;
    dot.addEventListener("click", () => {
      heroIndex = index;
      updateHero(heroMovies[heroIndex]);
      restartHeroSlider();
    });
    heroDots.appendChild(dot);
  });
}

function startHeroSlider() {
  if (!appSettings.autoSlider || !heroMovies.length) return;

  clearInterval(heroInterval);
  heroInterval = setInterval(() => {
    heroIndex = (heroIndex + 1) % Math.min(heroMovies.length, 6);
    updateHero(heroMovies[heroIndex]);
  }, 4500);
}

function restartHeroSlider() {
  clearInterval(heroInterval);
  startHeroSlider();
}

// Settings
function applySettings() {
  document.body.classList.remove("theme-cinema", "theme-midnight", "theme-blood");
  document.body.classList.remove("cards-small", "cards-medium", "cards-large");
  document.body.classList.remove("no-anim");

  if (appSettings.theme === "cinema") document.body.classList.add("theme-cinema");
  if (appSettings.theme === "midnight") document.body.classList.add("theme-midnight");
  if (appSettings.theme === "blood") document.body.classList.add("theme-blood");

  document.body.classList.add(`cards-${appSettings.cardSize}`);

  if (!appSettings.animations) {
    document.body.classList.add("no-anim");
  }

  if (themeSelect) themeSelect.value = appSettings.theme;
  if (cardSizeSelect) cardSizeSelect.value = appSettings.cardSize;
  if (animToggle) animToggle.checked = appSettings.animations;
  if (sliderToggle) sliderToggle.checked = appSettings.autoSlider;
}

function saveAppSettings() {
  appSettings = {
    theme: themeSelect?.value || "default",
    cardSize: cardSizeSelect?.value || "medium",
    animations: animToggle?.checked ?? true,
    autoSlider: sliderToggle?.checked ?? true,
  };

  localStorage.setItem("movieAppSettings", JSON.stringify(appSettings));
  applySettings();

  clearInterval(heroInterval);
  if (appSettings.autoSlider) startHeroSlider();

  if (settingsPanel) settingsPanel.style.display = "none";
  showToast("Settings saved successfully ⚙");
}

// Page loads
async function loadHome() {
  showLoading();

  try {
    const trending = await fetchMovies(`${BASE_URL}/trending/movie/week?api_key=${apiKey}`);
    heroMovies = trending.slice(0, 6);
    if (heroMovies.length) {
      heroIndex = 0;
      updateHero(heroMovies[0]);
      startHeroSlider();
    }
    renderMovies(trending.slice(0, 12), trendingRow);

    const action = await fetchMovies(`${BASE_URL}/discover/movie?api_key=${apiKey}&with_genres=28`);
    renderMovies(action.slice(0, 12), actionRow);

    const comedy = await fetchMovies(`${BASE_URL}/discover/movie?api_key=${apiKey}&with_genres=35`);
    renderMovies(comedy.slice(0, 12), comedyRow);

    const horror = await fetchMovies(`${BASE_URL}/discover/movie?api_key=${apiKey}&with_genres=27`);
    renderMovies(horror.slice(0, 12), horrorRow);
  } catch (error) {
    showToast("Failed to load home movies");
  } finally {
    hideLoading();
  }
}

async function loadMovies() {
  showLoading();
  try {
    const movies = await fetchMovies(`${BASE_URL}/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`);
    renderMovies(movies.slice(0, 80), allMoviesRow);
  } catch (error) {
    showToast("Failed to load movies");
  } finally {
    hideLoading();
  }
}

function loadFavorites() {
  renderMovies(favorites, favoritesRow);
}

function loadWatchlist() {
  renderMovies(watchlist, watchlistRow);
}

// Event listeners
if (closePopup) {
  closePopup.addEventListener("click", closeTrailerPopup);
}

if (closeDetails) {
  closeDetails.addEventListener("click", closeDetailsPopup);
}

if (trailerPopup) {
  trailerPopup.addEventListener("click", (e) => {
    if (e.target === trailerPopup) closeTrailerPopup();
  });
}

if (detailsPopup) {
  detailsPopup.addEventListener("click", (e) => {
    if (e.target === detailsPopup) closeDetailsPopup();
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeTrailerPopup();
    closeDetailsPopup();
    if (settingsPanel) settingsPanel.style.display = "none";
  }
});

if (detailsFavoriteBtn) {
  detailsFavoriteBtn.addEventListener("click", () => {
    if (!currentDetailsMovie) return;
    addToFavorites(currentDetailsMovie);
    detailsFavoriteBtn.textContent = "❤ In Favorites";
    renderCurrentPageAgain();
  });
}

if (detailsWatchlistBtn) {
  detailsWatchlistBtn.addEventListener("click", () => {
    if (!currentDetailsMovie) return;
    addToWatchlist(currentDetailsMovie);
    detailsWatchlistBtn.textContent = "✓ In Watchlist";
    renderCurrentPageAgain();
  });
}

if (detailsTrailerBtn) {
  detailsTrailerBtn.addEventListener("click", () => {
    if (!currentDetailsMovie) return;
    openTrailer(currentDetailsMovie.id);
  });
}

// Search
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

if (searchBtn) {
  searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    showLoading();
    try {
      const res = await fetch(`${BASE_URL}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
      const data = await res.json();
      renderMovies((data.results || []).slice(0, 80), allMoviesRow);
      showToast(`Showing results for "${query}"`);
    } catch (error) {
      showToast("Search failed");
    } finally {
      hideLoading();
    }
  });
}

if (searchInput) {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchBtn.click();
  });
}

// Settings events
if (openSettings) {
  openSettings.addEventListener("click", () => {
    if (settingsPanel) settingsPanel.style.display = "flex";
  });
}

if (closeSettings) {
  closeSettings.addEventListener("click", () => {
    if (settingsPanel) settingsPanel.style.display = "none";
  });
}

if (settingsPanel) {
  settingsPanel.addEventListener("click", (e) => {
    if (e.target === settingsPanel) settingsPanel.style.display = "none";
  });
}

if (saveSettings) {
  saveSettings.addEventListener("click", saveAppSettings);
}

// Init
applySettings();

if (document.body.contains(trendingRow)) loadHome();
if (document.body.contains(allMoviesRow)) loadMovies();
if (document.body.contains(favoritesRow)) loadFavorites();
if (document.body.contains(watchlistRow)) loadWatchlist();