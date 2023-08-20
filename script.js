const moviesData = [];
const genre = [
  { id: 1, name: "All" },
  {
    id: 28,
    name: "Action",
  },
  {
    id: 12,
    name: "Adventure",
  },
  {
    id: 16,
    name: "Animation",
  },
  {
    id: 35,
    name: "Comedy",
  },
  {
    id: 80,
    name: "Crime",
  },
  {
    id: 99,
    name: "Documentary",
  },
  {
    id: 18,
    name: "Drama",
  },
  {
    id: 10751,
    name: "Family",
  },
  {
    id: 14,
    name: "Fantasy",
  },
  {
    id: 36,
    name: "History",
  },
  {
    id: 27,
    name: "Horror",
  },
  {
    id: 10402,
    name: "Music",
  },
  {
    id: 9648,
    name: "Mystery",
  },
  {
    id: 10749,
    name: "Romance",
  },
  {
    id: 878,
    name: "Science Fiction",
  },
  {
    id: 10770,
    name: "TV Movie",
  },
  {
    id: 53,
    name: "Thriller",
  },
  {
    id: 10752,
    name: "War",
  },
  {
    id: 37,
    name: "Western",
  },
];

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNzdiZTU0NmI4NDQ4YWQ3MGE1NTIyYzBmZmJhMTFmYSIsInN1YiI6IjY0ZDUwZWZhMDIxY2VlMDEzYjcyN2ZlOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.x_2C6LbZiZ3LiRFdDMnqLqrvGmriNqnX8OrLCguUlNs",
  },
};
let currentMovie = [];

function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");
  movieCard.innerHTML = `
      <h2>${movie.title}</h2>
      <p><b>Genre:</b> ${movie.genre}</p>
      <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" />
      <p>Vote: ${movie.vote_average}/10</p>
      <button class="show-description-btn">Show Description</button>
    `;

  const showDescriptionBtn = movieCard.querySelector(".show-description-btn");
  showDescriptionBtn.addEventListener("click", () => {
    showMovieDescription(movie);
  });

  return movieCard;
}

function showMovieDescription(movie) {
  const modal = document.getElementById("movieModal");
  modal.innerHTML = `
     <div id="close" class="close">
      <h2>${movie.title}</h2>
      <h3>Release Date: ${movie.release_date}</h3>
      <div class="movie-discription">
      <img src = "https://image.tmdb.org/t/p/w400${movie.backdrop_path}"/>
      <p><b style="color:red">Description:</b> ${movie.overview}</p>   
      </div>
      </div>
    `;
  modal.style.display = "block";

  const closeButton = document.querySelector(".close");
  closeButton.addEventListener("click", () => {
    const modal = document.getElementById("movieModal");
    modal.style.display = "none";
  });
}
function filterMoviesByGenre(genre) {
  if (genre == "All") {
    currentMovie = [...moviesData];
  } else currentMovie = moviesData.filter((p) => p.genre.includes(genre));
  //console.log(currentMovie);
  const moviesSection = document.querySelector(".listMovie");
  //console.log(genre);
  while (moviesSection.firstChild) {
    moviesSection.removeChild(moviesSection.firstChild);
  }
  currentMovie.forEach((movie) => {
    //console.log(movie);
    const movieCard = createMovieCard(movie);
    moviesSection.appendChild(movieCard);
  });
}

function performSearch(searchTerm) {
  currentMovie = moviesData.filter((p) => p.title.includes(searchTerm));
  const moviesSection = document.querySelector(".listMovie");
  //console.log(genre);
  while (moviesSection.firstChild) {
    moviesSection.removeChild(moviesSection.firstChild);
  }

  currentMovie.forEach((movie) => {
    //console.log(movie);
    const movieCard = createMovieCard(movie);
    moviesSection.appendChild(movieCard);
  });
}

async function fetchMoviesFromAPI(page) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`,
      options
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movies from API:", error);
    return [];
  }
}
async function addGenresList() {
  const modal = document.querySelector(".filter");
  genre.forEach((gen) => {
    const optionElement = document.createElement("option");
    optionElement.value = gen.name;
    optionElement.textContent = gen.name;
    modal.appendChild(optionElement);
  });
  modal.style.display = "block";
  //modal.addEventListener("change", filterMoviesByGenre(modal.value));
}
async function initApp() {
  addGenresList();
  const moviesSection = document.querySelector(".listMovie");

  const moviesFromAPI = await fetchMoviesFromAPI(1);
  const page2 = await fetchMoviesFromAPI(2);
  console.log(page2);
  //moviesFromAPI.add(page2);
  //   const generes = await fetchGenres();
  //console.log(moviesFromAPI);
  const resutlData = moviesFromAPI.results.forEach((a) => {
    let str = "";
    a.genre_ids.forEach((p) => {
      str = str + " " + genre.find((q) => q.id == p).name;
    });
    a["genre"] = str;
    moviesData.push(a);
  });
  const resultPage = page2.results.forEach((a) => {
    let str = "";
    a.genre_ids.forEach((p) => {
      str = str + " " + genre.find((q) => q.id == p).name;
    });
    a["genre"] = str;
    moviesData.push(a);
  });
  //moviesData.push(...moviesFromAPI);

  //console.log(moviesData);
  currentMovie = [...moviesData];
  currentMovie.forEach((movie) => {
    //console.log(movie);
    const movieCard = createMovieCard(movie);
    moviesSection.appendChild(movieCard);
  });
  const genreFilter = document.getElementById("genreFilter");
  genreFilter.addEventListener("change", () => {
    filterMoviesByGenre(genreFilter.value);
  });
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    performSearch(searchInput.value);
  });
}

document.addEventListener("DOMContentLoaded", initApp);
