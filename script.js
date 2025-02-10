const API_KEY = "3c563d373a1d6d2d408778e76755e600"; // Replace with your TMDB API key
let moviePage = 1;
let tvPage = 1;
let totalMoviePages = 1;
let totalTvPages = 1;

// Get references to buttons & elements
const yearInput = document.getElementById("year");
const moviesDiv = document.getElementById("movies");
const tvShowsDiv = document.getElementById("tv-shows");

// Populate Year Dropdown
function populateYears() {
  const currentYear = new Date().getFullYear();
  const startYear = 1940;
  for (let year = currentYear; year >= startYear; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearInput.appendChild(option);
  }
}

// Check if a string contains only Arabic characters
function isArabic(title) {
  return /^[\u0600-\u06FF\s]+$/.test(title);
}

// Call function to populate years on page load
populateYears();

// Fetch Movies
async function fetchMovies(page = 1) {
  const movieBtn = document.getElementById("movies-btn");
  
  const year = yearInput.value;
  moviesDiv.innerHTML = `<h2>الأفلام</h2><p>جاري التحميل...</p>`;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=${year}&with_original_language=ar&region=EG&page=${page}`
    );
    const data = await response.json();

    totalMoviePages = Math.min(data.total_pages, 3); // Limit pagination to 3 pages

    let moviesHTML = `
      <div class="list-controls">
        <h2>الأفلام (${data.total_results})</h2>
      </div>
    `;

    if (data.results.length > 0) {
      data.results.forEach((movie) => {
        if (isArabic(movie.original_title)) {
          moviesHTML += `<p>${movie.original_title}</p>`;
        }
      });
    } else {
      moviesHTML += `<p>لا توجد أفلام متاحة لسنة ${year}.</p>`;
    }

    // Pagination Controls
    moviesHTML += `
      <div class="pagination">
        <button onclick="changeMoviePage(-1)" ${page === 1 ? "disabled" : ""}>السابق</button>
        <span>صفحة ${page} من ${totalMoviePages}</span>
        <button onclick="changeMoviePage(1)" ${page === totalMoviePages ? "disabled" : ""}>التالي</button>
      </div>
    `;

    moviesDiv.innerHTML = moviesHTML;
    moviePage = page;
  } catch (error) {
    moviesDiv.innerHTML = `<p>حدث خطأ أثناء جلب الأفلام.</p>`;
    console.error(error);
  }
}

// Fetch TV Shows
async function fetchTvShows(page = 1) {
  const tvShowBtn = document.getElementById("tv-btn");

  const year = yearInput.value;
  tvShowsDiv.innerHTML = `<h2>المسلسلات</h2><p>جاري التحميل...</p>`;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&first_air_date.gte=${year}-01-01&first_air_date.lte=${year}-12-31&with_original_language=ar&region=EG&page=${page}`
    );
    const data = await response.json();

    totalTvPages = Math.min(data.total_pages, 3); // Limit pagination

    let tvShowsHTML = `
      <div class="list-controls">
        <h2>المسلسلات (${data.total_results})</h2>
      </div>
    `;

    if (data.results.length > 0) {
      data.results.forEach((tv) => {
        if (isArabic(tv.original_name)) {
          tvShowsHTML += `<p>${tv.original_name}</p>`;
        }
      });
    } else {
      tvShowsHTML += `<p>لا توجد مسلسلات متاحة لسنة ${year}.</p>`;
    }

    // Pagination Controls
    tvShowsHTML += `
      <div class="pagination">
        <button onclick="changeTvPage(-1)" ${page === 1 ? "disabled" : ""}>السابق</button>
        <span>صفحة ${page} من ${totalTvPages}</span>
        <button onclick="changeTvPage(1)" ${page === totalTvPages ? "disabled" : ""}>التالي</button>
      </div>
    `;

    tvShowsDiv.innerHTML = tvShowsHTML;
    tvPage = page;
  } catch (error) {
    tvShowsDiv.innerHTML = `<p>حدث خطأ أثناء جلب المسلسلات.</p>`;
    console.error(error);
  }
}

// Enable buttons when selecting a new year & clear lists
yearInput.addEventListener("change", () => {
  moviesDiv.innerHTML = `
    <div class="list-controls">
      <h2>الأفلام</h2>
      <button class="show" id="movies-btn" onclick="fetchMovies()">عرض الأفلام</button>
    </div>
  `;
  tvShowsDiv.innerHTML = `
    <div class="list-controls">
      <h2>المسلسلات</h2>
      <button class="show" id="tv-btn" onclick="fetchTvShows()">عرض المسلسلات</button>
    </div>
  `;

  // Re-enable buttons
  document.getElementById("movies-btn").disabled = false;
  document.getElementById("tv-btn").disabled = false;
});

// Change Movie Page
function changeMoviePage(step) {
  const nextPage = moviePage + step;
  if (nextPage > 0 && nextPage <= totalMoviePages) {
    moviePage = nextPage; // ✅ Update page number before calling function
    fetchMovies(moviePage);
  }
}

// Change TV Show Page
function changeTvPage(step) {
  const nextPage = tvPage + step;
  if (nextPage > 0 && nextPage <= totalTvPages) {
    tvPage = nextPage; // ✅ Update page number before calling function
    fetchTvShows(tvPage);
  }
}
// Dark mode toggle functionality
const darkModeToggle = document.getElementById("dark-mode");
darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});
