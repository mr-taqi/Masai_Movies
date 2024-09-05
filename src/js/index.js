"use strict";

// import

import { sidebar } from "./sidebar.js";
import { genreAPI, popularAPI, fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

const pageContent = document.querySelector("[page-content]");

let loginBtn = document.querySelector("#loginBtn");
let userprofileIcon = document.querySelector("#userprofileIcon");

let userId = localStorage.getItem("userId");

sidebar();

// Home page sections

const homePageSections = [
  {
    title: "Upcoming Movies",
    path: "upcoming.json",
  },
  {
    title: "Weekly Trending Movies",
    path: "/trending.json",
  },
  {
    title: "Top Rated Movies",
    path: "/top_rated.json",
  },
];

const genreList = {
  asString(genreIdList) {
    let newGenreList = [];

    for (const genreId of genreIdList) {
      this[genreId] && newGenreList.push(this[genreId]); //
      this == genreList;
    }

    return newGenreList.join(", ");
  },
};

fetchDataFromServer(`${genreAPI}`, function ({ genres }) {
  for (const { id, name } of genres) {
    genreList[id] = name;
  }

  fetchDataFromServer(`${popularAPI}`, heroBanner);
});

// fetchDataFromServer(
//   `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=1`,
//   heroBanner
// );

const heroBanner = function ({ results: movieList }) {
  const banner = document.createElement("section");
  banner.classList.add("banner");
  banner.ariaLabel = "Popular Movies";

  banner.innerHTML = `
    <div class="banner-slider"></div>

    <div class="slider-control">
      <div class="control-inner"></div>
    </div>
  `;

  let controlItemIndex = 0;

  for (const [index, movie] of movieList.entries()) {
    const {
      backdrop_path,
      title,
      release_date,
      genre_ids,
      overview,
      poster_path,
      vote_average,
      id,
    } = movie;

    const sliderItem = document.createElement("div");
    sliderItem.classList.add("slider-item");
    sliderItem.setAttribute("slider-item", "");

    sliderItem.innerHTML = `
      <img
        src="${backdrop_path}"
        alt="${title}"
        class="img-cover"
        loading="${index === 0 ? "eager" : "lazy"}"
      />

      <div class="banner-content">
        <h2 class="heading">${title}</h2>

        <div class="meta-list">
          <div class="meta-item">${release_date}</div>

          <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
        </div>

        <p class="genre">${genreList.asString(genre_ids)}</p>

        <p class="banner-text">
          ${overview}
        </p>

        <a href="./detail.html" class="btn" onclick="getMovieDetail(${id})">
          <img
            src="./src/images/play_circle.png"
            width="24"
            height="24"
            aria-hidden="true"
            alt="play circle"
          />

          <span class="span">Watch Now</span>
        </a>
      </div>
    `;

    banner.querySelector(".banner-slider").appendChild(sliderItem);

    const controlItem = document.createElement("button");
    controlItem.classList.add("poster-box", "slider-item");
    controlItem.setAttribute("slider-control", `${controlItemIndex}`);

    controlItemIndex++;

    controlItem.innerHTML = `
      <img
        src="${poster_path}"
        alt="${title}"
        loading="lazy"
        draggable="false"
        class="img-cover"
      />
    `;

    banner.querySelector(".control-inner").appendChild(controlItem);
  }

  pageContent.appendChild(banner);

  addHeroSlide();

  // fetching data for the home page sections (top rated, upcoming, trending)

  //BUG FIX
  for (const { title, path } of homePageSections) {
    fetchDataFromServer(
      `https://sahilz9.github.io/CW-API/${path}`,
      createMovieList,
      title
    );
  }
};

const addHeroSlide = function () {
  const sliderItems = document.querySelectorAll("[slider-item]");

  const sliderControls = document.querySelectorAll("[slider-control]");

  let lastSliderItem = sliderItems[0];
  let lastSliderControl = sliderControls[0];

  lastSliderItem.classList.add("active");
  lastSliderControl.classList.add("active");

  const sliderStart = function () {
    lastSliderItem.classList.remove("active");
    lastSliderControl.classList.remove("active");

    // `this` == slider-control
    sliderItems[Number(this.getAttribute("slider-control"))].classList.add(
      "active"
    );
    this.classList.add("active");

    lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
    lastSliderControl = this;
  };

  addEventOnElements(sliderControls, "click", sliderStart);
};

const createMovieList = function ({ results: movieList }, title) {
  const movieListElem = document.createElement("section");

  movieListElem.classList.add("movie-list");
  movieListElem.ariaLabel = `${title}`;

  movieListElem.innerHTML = `
  <div class="title-wrapper">
          <h3 class="title-large">${title}</h3>
        </div>
  
        <div class="slider-list">
          <div class="slider-inner">
          </div>
        </div>
  `;

  for (const movie of movieList) {
    const movieCard = createMovieCard(movie);

    movieListElem.querySelector(".slider-inner").appendChild(movieCard);
  }

  pageContent.appendChild(movieListElem);
};

if (userId) {
  userprofileIcon.innerHTML = `<img
  src="data:image/jpeg;base64,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"
  class="profile-logo"
  alt=""
/>`;

  loginBtn.style.display = "none";
} else {
  userprofileIcon.innerHTML = "";
}

loginBtn.addEventListener("click", () => {
  window.location.href = "vibhorlogin.html";
});

userprofileIcon.addEventListener("click", () => {
  window.location.href = "syedProfile.html";
});
