document.addEventListener("DOMContentLoaded", function () {
  // Search filter for pages that have searchable grid
  const searchInput = document.getElementById("searchInput");
  const movieCards = document.querySelectorAll(".searchable-grid .movie-card");

  if (searchInput && movieCards.length > 0) {
    searchInput.addEventListener("keyup", function () {
      const searchValue = searchInput.value.toLowerCase();

      movieCards.forEach(card => {
        const title = card.getAttribute("data-title").toLowerCase();
        if (title.includes(searchValue)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }

  // Favorite heart toggle
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