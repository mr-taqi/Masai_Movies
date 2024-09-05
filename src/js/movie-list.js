"use strict";

document.addEventListener("DOMContentLoaded", () => {
  let currentBatch = 0;
  const batchSize = 20;
  let allMovies = [];
  let filteredMovies = [];

  const searchBar = document.querySelector(".search-field");
  const gridList = document.querySelector(".grid-list");
  const loadBtn = document.querySelector(".load-more");

  async function getMovieData() {
    try {
      const response = await fetch(
        `https://sahilz9.github.io/CW-API/data.json`
      );
      const data = await response.json();
      allMovies = data.movies;
      filteredMovies = allMovies;
      const urlParams = new URLSearchParams(window.location.search);
      const genreId = urlParams.get("genreId");
      if (genreId) {
        filterByGenre(genreId);
      } else {
        showData();
      }
    } catch (error) {
      console.error("Error fetching movie data:", error);
    }
  }

  function showData(clearPrevious = false) {
    if (clearPrevious) {
      gridList.innerHTML = "";
      currentBatch = 0;
    }

    const fragment = document.createDocumentFragment();
    const startIndex = currentBatch * batchSize;
    const endIndex = startIndex + batchSize;
    const batchData = filteredMovies.slice(startIndex, endIndex);

    batchData.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.innerHTML = `
        <figure class="poster-box card-banner">
          <img src="${movie.thumbnail}" alt="${movie.title}" class="img-cover"/>
        </figure>
        <h4 class="movie-title">${getTitle(movie.title)}</h4>
        <div class="meta-list">
          <div class="meta-item">
            <img src="./src/images/star.png" width="20" height="20" loading="lazy" alt="" class=""/>
            <span class="span">8.4</span>
          </div>
          <div class="card-badge">${movie.year}</div>
        </div>
        <a href="./detail.html" class="card-btn" title="${movie.title}"></a>`;
      fragment.appendChild(movieCard);
    });

    gridList.appendChild(fragment);
    currentBatch++;
  }

  function getTitle(title) {
    const maxLength = 20;
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  }

  function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  }

  function handleSearch() {
    const query = searchBar.value.toLowerCase();
    if (query === "") {
      filteredMovies = allMovies;
    } else {
      filteredMovies = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(query)
      );
    }
    showData(true);
  }

  function filterByGenre(genreId) {
    const genreName = getGenreNameById(genreId);
    filteredMovies = allMovies.filter((movie) =>
      movie.genres.some((genre) => genre === genreName)
    );
    showData(true);
  }

  function getGenreNameById(genreId) {
    const genres = {
      28: "Action",
      12: "Adventure",
      16: "Animated",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Science Fiction",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };
    return genres[genreId];
  }

  function throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  searchBar.addEventListener("input", debounce(handleSearch, 2000));
  loadBtn.addEventListener(
    "click",
    throttle(() => {
      showData();
    }, 1000)
  );

  getMovieData();
});
