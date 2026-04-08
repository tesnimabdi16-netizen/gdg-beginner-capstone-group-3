const inputBox= document.querySelector("#searchInput");
const searchIcon = document.querySelector(".searchIcon");
const SearchBox = document.querySelector(".search-box");

const heroSide = document.querySelector(".hero-side")
const MovieList = document.querySelector(".section");


const apiKey=`11ab1117a036358d42f55b2320020a34`;
const BASE_URL ="https://api.themoviedb.org/3";
const IMAGE_PATH = "https://images.tmdb.org/t/p/w500";


  async function fetchPopularMovie(){
    const response= await fetch(`${BASE_URL}/movie/popular?api_key=${apiKey}`);
    const data = await response.json();
        DisplayFeaturedTodayMovie(data);
    
   }

   function DisplayFeaturedTodayMovie(data){
    
    const [{title, overview, release_date, poster_path, backdrop_path}]= data.results;
    const HeroContent = document.querySelector(".hero");
    
    const movieElement= document.createElement("div");
    movieElement.classList.add("hero-content")
    movieElement.innerHTML=`<span class="hero-badge">🔥 Featured Today</span>
          <h1>${title}</h1>
          <p>
            ${overview}
          </p>

          <div class="hero-meta">
            <span>2h 40m</span>
            <span>${release_date}</span>
            <span>${title}</span>
            <span>Action</span>
            <span>IMDb 8.9</span>
          </div>

          <div class="hero-buttons">
            <a href="details.html" class="btn btn-primary"><i class="fas fa-play"></i> View Details</a>
            <button class="btn btn-secondary trailer-btn"><i class="fas fa-circle-play"></i> Watch Trailer</button>
          </div>
        </div>   
        <div class="hero-side">
          <div class="mini-card">
            <img src="${IMAGE_PATH + poster_path}" alt="${title}">
            <span>01</span>
          </div>

        </div>`;

        HeroContent.appendChild(movieElement);
   }
   
async function FetchNowPlayingMovie() {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`
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
    const moviesToShow = data.results.slice(0, 4);
   moviesToShow.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");   

        movieCard.innerHTML = `
            <div class="rating">⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</div>
            <img src="${IMAGE_PATH + movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>${movie.release_date || "Unknown"}</p>
                <div class="movie-actions">
                    <a href="details.html?id=${movie.id}" class="small-btn">Details</a>
                    <button class="heart-btn"><i class="far fa-heart"></i></button>
                </div>
            </div>
        `;

        NowPlayingSection.appendChild(movieCard);
    });
}



    

   //fetch trending  movie for the past week

     async function FetchTrendingMovie(){
        //length of trending. it could be day, week or month
    const forHowLong = "week";
    const response= await fetch(`${BASE_URL}/trending/movie/${forHowLong}?api_key=${apiKey}`);
    const data = await response.json();
       DisplayTrendingMovie(data);
   }



   function DisplayTrendingMovie(data) {
    const TrendinGMovie = document.querySelector(".searchable-grid");
    
    TrendinGMovie.innerHTML = "";

    // Loop through the first 5 movies
    data.results.slice(0, 15).forEach(movie => {
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
                    <a href="details.html?id=${movie.id}" class="small-btn">Details</a>
                    <button class="heart-btn"><i class="far fa-heart"></i></button>
                </div>
            </div>
        `;

        TrendinGMovie.appendChild(MovieCard);
    });
}

 

document.addEventListener("DOMContentLoaded", function() {

    const LinkOfMovieList = document.getElementById("Movie-list-link");

    // Only add event listener if the element exists (i.e., on index.html)
    if (LinkOfMovieList) {
        LinkOfMovieList.addEventListener("click", function(e) {
            e.preventDefault();
            window.location.href = "movies.html";
        });
    }

   
    if (window.location.pathname.includes("movies.html")) {
        
        const container = document.querySelector(".searchable-grid");

        if (container) {
            container.innerHTML = "<p style='color:white; text-align:center; grid-column:1/-1;'>Loading movies...</p>";

            fetch(`${BASE_URL}/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=100`)
                .then(response => response.json())
                .then(data => {
                    container.innerHTML = "";

                    data.results.slice(0, 100).forEach(movie => {
                        const card = document.createElement("div");
                        card.classList.add("movie-card");

                        card.innerHTML = `
                            <div class="rating">⭐ ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}</div>
                            <img src="${IMAGE_PATH}${movie.poster_path}" alt="${movie.title}">
                            <div class="movie-info">
                                <h3>${movie.title}</h3>
                                <p>${movie.release_date || "Unknown"}</p>
                                <div class="movie-actions">
                                    <a href="details.html?id=${movie.id}" class="small-btn">Details</a>
                                    <button class="heart-btn"><i class="far fa-heart"></i></button>
                                </div>
                            </div>
                        `;

                        container.appendChild(card);
                    });
                })
                .catch(err => {
                    console.error(err);
                    container.innerHTML = "<p style='color:white; text-align:center; grid-column:1/-1;'>Failed to load movies.</p>";
                });
        }
    }
});
  

// Fetch movies from OMDb API
async function searchMovies(movieName) {
  const searchResults = document.getElementById("searchResults");
  const searchResultsSection = document.getElementById("searchResultsSection");

  if (!movieName.trim()) {
    searchResultsSection.style.display = "none";
    searchResults.innerHTML = "";
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${apiKey}`);
    const data = await response.json();

    if (data.Response === "True") {
      searchResultsSection.style.display = "block";

      searchResults.innerHTML = data.Search.map(movie => `
        <div class="movie-card" data-title="${movie.Title}">
          <div class="rating">⭐ IMDb</div>
          <img 
            src="${movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}" 
            alt="${movie.Title}" 
            class="movie-poster"
          >
          <div class="movie-info">
            <h3>${movie.Title}</h3>
            <p>${movie.Year} • ${movie.Type}</p>
            <div class="movie-actions">
              <a href="details.html?imdbID=${movie.imdbID}" class="small-btn">Details</a>
              <button class="heart-btn"><i class="far fa-heart"></i></button>
            </div>
          </div>
        </div>
      `).join("");

      attachHeartEvents();

    } else {
      searchResultsSection.style.display = "block";
      searchResults.innerHTML = `<p style="color: white; padding: 10px;">${data.Error}</p>`;
    }
  } catch (error) {
    searchResultsSection.style.display = "block";
    searchResults.innerHTML = `<p style="color: white; padding: 10px;">Error fetching movies. Please try again.</p>`;
    console.error("Fetch error:", error);


  }
}

// Heart button lo
// gic
function attachHeartEvents() {
  const heartButtons = document.querySelectorAll(".heart-btn");

  heartButtons.forEach(button => {
    button.addEventListener("click", function () {
      button.classList.toggle("active");

      const icon = button.querySelector("i");
      if (button.classList.contains("active")) {
        icon.classList.remove("far");
        icon.classList.add("fas");
      } else {
        icon.classList.remove("fas");
        icon.classList.add("far");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");

  // Search on keyup using OMDb API
  if (searchInput) {
    searchInput.addEventListener("keyup", function () {
      const movieName = searchInput.value;
      searchMovies(movieName);
    });
  }

  // Attach heart events for existing static cards
  attachHeartEvents();

  // Trailer button
  const trailerButtons = document.querySelectorAll(".trailer-btn");
  trailerButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      alert("🎬 Trailer feature demo! In a real project, this can open a video modal or YouTube trailer.");
    });
  });

  // Explore button
  const exploreBtn = document.querySelector(".upgrade-btn");
  if (exploreBtn) {
    exploreBtn.addEventListener("click", function () {
      window.location.href = "movies.html";
    });
  }

  // Notification & bookmark demo
  const iconButtons = document.querySelectorAll(".icon-btn");
  iconButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      alert("✨ Demo action! This button can be connected to notifications or saved content.");
    });
  });
});


       fetchPopularMovie();
       FetchNowPlayingMovie();
       FetchTrendingMovie();
     
       
  


