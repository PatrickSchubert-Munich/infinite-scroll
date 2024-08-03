"use strict";

// Unsplash Params
let isInitialLoad = true;
let initialCount = 5;
const apiKey = "API_KEY";
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

// params for loading amount of images
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;

// Array for collect photos
let photosArray = [];

// Get image container and loader elements
const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

// Improves performance for initialLoad
function updateAPIURLWithNewCount(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${picCount}`;
}

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;

  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  } else {
    console.error(
      "There are less photos than requested. Please check your API limit!"
    );
  }
}

// Helper Function to set Attributes on DOM Elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Display Photos in Browser
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // Loop every image
  photosArray.forEach((photo) => {
    // Create <a> tag to link to Unsplash
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });

    // Create <img> for photo
    const image = document.createElement("img");
    setAttributes(image, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    // Put <img> element inside <a> element
    item.appendChild(image);
    imageContainer.appendChild(item);

    // check if image loaded
    image.addEventListener("load", imageLoaded);
  });
}

// get photos from Api
async function getPhotosFromApi() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    // improves performance for initialLoad (less than 30 Phtotos)
    if (isInitialLoad) {
      updateAPIURLWithNewCount(30);
      isInitialLoad = false;
    }
  } catch (error) {
    console.error(`An error occured: ${error}`);
  }
}

window.addEventListener("scroll", () => {
  // calculate window and content position
  let windowScrollPosition = window.innerHeight + window.scrollY;
  let contentOfBody = document.body.offsetHeight - 500; // without margin and padding
  // Check if Scroll-Y achieves breakpoint for loading more photos
  if (windowScrollPosition >= contentOfBody && ready) {
    ready = false;
    getPhotosFromApi();
  }
});

// Get photos from unsplashed
getPhotosFromApi();
