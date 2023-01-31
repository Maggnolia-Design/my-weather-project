// ------------------------------------------------------
// ----- SHOW CURRENT WEEKDAY, DATE, TIME, AND YEAR -----
// ------------------------------------------------------

// defining variables

let now = new Date();

let date = now.getDate();
let hour = now.getHours();
let minutes = now.getMinutes();
let years = now.getFullYear();

let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
let day = days[now.getDay()]; // 0 and 6

let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[now.getMonth()]; // 0 and 11

// plug result into the corresponding paragraph

let currentDateTime = document.querySelector(".current-date-time");
currentDateTime.innerHTML = `${day} ${month} ${date}, ${hour}:${minutes}, ${years} [WIP]`;
console.log(currentDateTime);

// ----------------------------------------------------------
// ----- UPDATE CITY AND API DATA BASED ON SEARCH INPUT -----
// ----------------------------------------------------------

//defining variables

let currentCity = document.querySelector(".current-city");
let searchInput = document.querySelector(".search-input");

let apiBase = "https://api.openweathermap.org/data/2.5/weather?";
let apiKey = "&appid=ba3a2d83a8227aa5c0e1f8782d2a124b";
let apiUnit = "&units=imperial";

// Show result based on axios response
function showResult(response) {
  // show temperature and unit
  let currentTemperature = document.querySelector(".current-temperature");
  let currentUnit = document.querySelector(".current-unit");

  currentTemperature.innerHTML = `${Math.round(response.data.main.temp)}`;
  currentUnit.innerHTML = `°F`;

  // show condition
  let currentCondition = document.querySelector(".current-condition");
  currentCondition.innerHTML = response.data.weather[0].main;

  // show city name
  currentCity.innerHTML = response.data.name;
  console.log(response.data.name);
}

function search(event) {
  // prevents page from reloading
  event.preventDefault();

  // updates the API URL using search input, then runs show result
  let apiCity = `q=${searchInput.value.replaceAll(" ", "")}`;
  let fullApiUrl = `${apiBase}${apiCity}${apiKey}${apiUnit}`;

  console.log(fullApiUrl);
  axios.get(fullApiUrl).then(showResult);
}

// run search function when form is submitted
let form = document.querySelector("form");
form.addEventListener("submit", search);

// -----------------------------------
// ----- CURRENT LOCATION OPTION -----
// -----------------------------------

function searchGeolocation(position) {
  let apiLat = `lat=${position.coords.latitude}`;
  let apiLon = `&lon=${position.coords.longitude}`;

  // updates the API URL using coordinates, then runs show results
  let fullApiUrl = `${apiBase}${apiLat}${apiLon}${apiKey}${apiUnit}`;

  console.log(fullApiUrl);
  axios.get(fullApiUrl).then(showResult);
}

function getGeolocation(event) {
  // prevents page from reloading
  event.preventDefault();

  // takes event, returns position
  navigator.geolocation.getCurrentPosition(searchGeolocation);
}

let button = document.querySelector(".current-location-button");
button.addEventListener("click", getGeolocation);

// -------------------------
// ----- CONVERT UNITS -----
// -------------------------

function convert(event) {
  event.preventDefault();
  let currentTemperature = document.querySelector(".current-temperature");
  let currentTemperatureText = currentTemperature.innerText;

  let currentUnit = document.querySelector(".current-unit");

  if (currentUnit.innerText === "°F") {
    currentTemperature.innerHTML = Math.round(
      ((currentTemperatureText - 32) * 5) / 9
    );
    currentUnit.innerHTML = "°C";
  } else {
    currentTemperature.innerHTML = Math.round(
      (currentTemperatureText * 9) / 5 + 32
    );
    currentUnit.innerHTML = "°F";
  }
}

let convertButton = document.querySelector(".convert-button");
convertButton.addEventListener("click", convert);
