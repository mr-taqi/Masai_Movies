"use strict";

import {
  genreAPI,
  moviesAPI,
  upcomingAPI,
  fetchDataFromServer,
  movieDetailsAPI,
} from "./api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";

const movieId = window.localStorage.getItem("movieId");

async function getData() {
  try {
    let response = await fetch(`${movieDetailsAPI}`);
    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }
    let data = await response.json();
    showData(data);
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
}

getData();

const pageContent = document.querySelector("[page-content]");

sidebar();

function showData(data) {
  const fragment = document.createDocumentFragment();

  data.forEach((ele) => {
    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");
    movieDetail.innerHTML = `
      <div class="backdrop-image" style="background-image: url('${
        ele.backdrop_path || ele.poster_path
      }')"></div>
      <figure class="poster-box movie-poster">
        <img src="${ele.poster_path}" alt="${
      ele.title
    } poster" class="img-cover" />
      </figure>
      <div class="detail-box">
        <div class="detail-content">
          <h1 class="heading">${ele.title}</h1>
          <button id="seatBookingBtn">Book Movie</button>
          <div class="meta-list">
            <div class="meta-item">
              <img src="./src/images/star.png" width="20" height="20" alt="rating" />
              <span class="span">${ele.vote_average.toFixed(1)}</span>
            </div>
            <div class="seperator"></div>
            <div class="meta-item">${ele.release_date}</div>
          </div>
          <p class="genre">${getGenres(ele.genres)}</p>
          <p class="overview">${ele.overview}</p>
          <ul class="detail-list">
            <div class="list-item">
              <p class="list-name">Starring</p>
              <p>${getCastNames(ele.casts)}</p>
            </div>
          </ul>
        </div>
        <div class="title-wrapper">
          <h3 class="title-large">Trailer and Clips</h3>
        </div>
        <div class="slider-list">
          <div class="slider-inner">
            ${createVideoCards(filterVideos(ele.videos))}
          </div>
        </div>
      </div>
    `;

    const seatBookingBtn = movieDetail.querySelector("#seatBookingBtn");
    seatBookingBtn.addEventListener("click", () => {
      window.location.href = "pavan.html";
    });

    fragment.appendChild(movieDetail);
  });

  pageContent.appendChild(fragment);
}

function getCastNames(casts) {
  if (!casts || !Array.isArray(casts.cast)) {
    console.error("Invalid casts object");
    return "";
  }
  return casts.cast.map((castMember) => castMember.name).join(", ");
}

function getGenres(genres) {
  if (!Array.isArray(genres)) {
    console.error("Expected an array of genres");
    return "";
  }
  return genres.map((genre) => genre.name).join(", ");
}

function filterVideos(videos) {
  if (!videos || !Array.isArray(videos.results)) {
    console.error("Invalid videos object");
    return [];
  }
  return videos.results.filter((video) => video.site === "YouTube");
}

function createVideoCards(videos) {
  return videos
    .map(
      ({ key, name }) => `
      <div class="video-card">
        <iframe width="500" height="294" src="https://www.youtube.com/embed/${key}?&theme=dark&color=white&rel=0" frameborder="0" allowfullscreen="1" title="${name}" class="img-cover" loading="lazy"></iframe>
      </div>`
    )
    .join("");
}
