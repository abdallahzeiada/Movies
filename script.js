const API_KEY = "3c563d373a1d6d2d408778e76755e600"; // Replace with your TMDB API key

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

// Call the function to populate years when the page loads
populateYears();

async function fetchMovies() {
  const year = document.getElementById("year").value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>جاري التحميل...</p>"; // Loading message in Arabic

  try {
    // Fetch movies
    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&primary_release_year=${year}&with_original_language=ar&region=EG`
    );
    const movieData = await movieResponse.json();

    // Fetch TV shows
    const tvResponse = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&first_air_date_year=${year}&with_original_language=ar&region=EG`
    );
    const tvData = await tvResponse.json();

    // Display results
    let moviesHTML = `<h2>الأفلام:</h2>`;
    if (movieData.results.length > 0) {
      movieData.results.forEach((movie) => {
        moviesHTML += `<p>${movie.original_title}</p>`;
      });
    } else {
      moviesHTML += `<p>لا توجد أفلام متاحة لسنة ${year}.</p>`;
    }

    let tvShowsHTML = `<h2>المسلسلات:</h2>`;
    if (tvData.results.length > 0) {
      tvData.results.forEach((tv) => {
        tvShowsHTML += `<p>${tv.original_name}</p>`;
      });
    } else {
      tvShowsHTML += `<p>لا توجد مسلسلات متاحة لسنة ${year}.</p>`;
    }

    resultsDiv.innerHTML = `
            <div class="movies">${moviesHTML}</div>
            <div class="tv-shows">${tvShowsHTML}</div>
        `;
  } catch (error) {
    resultsDiv.innerHTML = `<p>حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى لاحقًا.</p>`; // Error message in Arabic
    console.error(error);
  }
}

// Dark mode toggle functionality
const darkModeToggle = document.getElementById("dark-mode");
darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode");
});
