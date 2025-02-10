const API_KEY = "3c563d373a1d6d2d408778e76755e600"; // Replace with your TMDB API key
let moviePage = 1;
let tvPage = 1;
let totalMoviePages = 1;
let totalTvPages = 1;

// Function to populate the year dropdown
function populateYears() {
  const yearSelect = document.getElementById("year");
  const currentYear = new Date().getFullYear();
  const startYear = 1940;

  for (let year = currentYear; year >= startYear; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

// Function to check if a string contains only Arabic characters
function isArabic(title) {
  const arabicRegex = /^[\u0600-\u06FF\s]+$/;
  return arabicRegex.test(title);
}

// Call the function to populate years when the page loads
populateYears();

// Function to fetch movies
async function fetchMovies(page = 1) {
  const year = document.getElementById("year").value;
  const moviesDiv = document.getElementById("movies");
  moviesDiv.innerHTML = "<p>جاري التحميل...</p>"; // Loading message

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=${year}&with_original_language=ar&region=EG&page=${page}`
    );
    const data = await response.json();

     //totalMoviePages = data.total_pages; // Get total pages
   totalMoviePages = 3; // Get total pages

    let moviesHTML = `<h2>الأفلام (${data.total_results})</h2>`;
    if (data.results.length > 0) {
      data.results.forEach((movie) => {
        if (isArabic(movie.original_title))
          moviesHTML += `<p>${movie.original_title}</p>`;
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
    moviePage = page; // Update current page
  } catch (error) {
    moviesDiv.innerHTML = `<p>حدث خطأ أثناء جلب الأفلام.</p>`;
    console.error(error);
  }
}

async function fetchTvShows(page = 1) {
  const year = document.getElementById("year").value;
  const tvShowsDiv = document.getElementById("tv-shows");
  tvShowsDiv.innerHTML = "<p>جاري التحميل...</p>";

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&first_air_date.gte=${year}-01-01&first_air_date.lte=${year}-12-31&with_original_language=ar&region=EG&page=${page}`
    );
    const data = await response.json();

    if (data.total_results === 0) {
      tvShowsDiv.innerHTML = `<h2>المسلسلات</h2><p>لا توجد مسلسلات متاحة لسنة ${year}.</p>`;
      return;
    }

   // totalTvPages = data.total_pages; // Get total pages
    totalTvPages = 3; // Get total pages

    let tvShowsHTML = `<h2>المسلسلات (${data.total_results})</h2>`;
    data.results.forEach((tv) => {
      if (isArabic(tv.original_name))
        tvShowsHTML += `<p>${tv.original_name}</p>`;
    });

    // Pagination Controls
    tvShowsHTML += `
      <div class="pagination">
        <button onclick="changeTvPage(-1)" ${page === 1 ? "disabled" : ""}>السابق</button>
        <span>صفحة ${page} من ${totalTvPages}</span>
        <button onclick="changeTvPage(1)" ${page === totalTvPages ? "disabled" : ""}>التالي</button>
      </div>
    `;

    tvShowsDiv.innerHTML = tvShowsHTML;
    tvPage = page; // Update current page
  } catch (error) {
    tvShowsDiv.innerHTML = `<p>حدث خطأ أثناء جلب المسلسلات.</p>`;
    console.error(error);
  }
}


// Change Movie Page
function changeMoviePage(step) {
  const nextPage = moviePage + step;
  if (nextPage > 0 && nextPage <= totalMoviePages) {
    fetchMovies(nextPage);
  }
}

// Change TV Show Page
function changeTvPage(step) {
  const nextPage = tvPage + step;
  if (nextPage > 0 && nextPage <= totalTvPages) {
    fetchTvShows(nextPage);
  }
}

// Fetch data when clicking "عرض" button
function fetchData() {
  moviePage = 1;
  tvPage = 1;
  fetchMovies();
  fetchTvShows();
}

// Dark mode toggle functionality
const darkModeToggle = document.getElementById("dark-mode");
darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});
