# 🎬 Movie Explorer Web App

A modern, interactive movie browsing web application built using HTML, CSS, and JavaScript, powered by the TMDB API.  
Users can explore trending movies, search for titles, watch trailers, and manage personal favorites and watchlists.

---

## 🚀 Features

### 🎥 Movie Browsing
- View Trending Movies
- Browse by genres:
  - Action
  - Comedy
  - Horror
- Explore All Movies sorted by popularity

### 🔍 Search Functionality
- Search for any movie using real-time API results
- Displays up to 80 matching movies

### ⭐ Favorites & Watchlist
- Add/remove movies to:
  - ❤️ Favorites
  - ➕ Watchlist
- Data stored using LocalStorage
- Persistent across page reloads

### 🎞 Trailer & Details
- Watch trailers directly via YouTube popup
- Detailed movie information:
  - Release date
  - Rating
  - Runtime
  - Status
  - Genre

### 🖥 Hero Banner Slider
- Dynamic featured movie banner
- Auto-sliding carousel
- Interactive navigation dots

### ⚙ Settings Panel
Users can customize:
- 🎨 Theme (Default, Cinema, Midnight, Blood)
- 📏 Card Size (Small, Medium, Large)
- ✨ Animations (On/Off)
- 🎞 Auto Slider (On/Off)

### 🔔 UI Enhancements
- Toast notifications
- Loading spinner overlay
- Smooth animations & hover effects
- Responsive design (Mobile, Tablet, Desktop)

---

## 🛠 Technologies Used
- HTML5
- CSS3 (Advanced styling, animations, responsive design)
- JavaScript (Vanilla JS)
- TMDB API (Movie database)

---

## 📂 Project Structure
📁 Movie-App
│
├── index.html
├── movies.html
├── favorites.html
├── watchlist.html
│
├── style.css
├── script.js
│
└── README.md


## ⚙ How to Run the Project

1. Clone the repository:
2. Open the project folder  
3. Run the project:
- Open `index.html` in your browser



## 🔑 API Setup

This project uses the TMDB API.

1. Go to: https://www.themoviedb.org/
2. Create an account
3. Generate your API key
4. Replace the API key in `script.js`:
const apiKey = "YOUR_API_KEY_HERE";
---

## 💡 Future Improvements
- User authentication (login/signup)
- Backend integration (database instead of LocalStorage)
- Movie recommendations system
- Dark/light mode toggle button in navbar
- Pagination or infinite scroll
- Better accessibility support

---

## 👨‍💻 Contributors
- Kedir Lemecha (KedirL)
- Netsanet Mulugeta (netsanetmulugeta27-gif)
- Ruhama Hailu (ruhama-hailu)
- Tesnim Abdi (tesnimabdi16-netizen)
- Yayneabeba Emshaw
- Marta Kefale (martak12)

---

## 📄 License
This project is for educational and personal use.

---

## ⭐ Acknowledgements
- TMDB API for movie data
- YouTube for trailer streaming

---

## 📌 Notes
- This project is fully frontend-based
- Data persistence is handled using browser storage
- Designed with focus on UI/UX and interactivity
