"use strict";

const genreAPI = "https://sahilz9.github.io/CW-API/genre.json";

const moviesAPI = "https://sahilz9.github.io/CW-API/data.json";

const popularAPI = "https://sahilz9.github.io/CW-API/popular.json";

const upcomingAPI = "https://sahilz9.github.io/CW-API/upcoming.json";

const movieDetailsAPI = "https://sahilz9.github.io/CW-API/movie_details.json";

// const imageBaseURL = "https://image.tmdb.org/t/p/";

/*Fetching the data*/

const fetchDataFromServer = function (url, callback, optionalParam) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data, optionalParam));
};

export {
  moviesAPI,
  genreAPI,
  popularAPI,
  movieDetailsAPI,
  upcomingAPI,
  fetchDataFromServer,
};

// youtube link https://www.youtube.com/embed/Wk-MeF0ngVI?&theme=dark&color=white&rel=0
