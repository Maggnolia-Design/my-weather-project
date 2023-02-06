// ------------------------------------------------------
// ----------- SHOW CURRENT WEEKDAY AND TIME ------------
// ------------------------------------------------------

// defining variables

let now = new Date();

let hour = now.getHours();
let minutes = now.getMinutes();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let day = days[now.getDay()]; // 0 and 6

// plug result into the corresponding paragraph

let currentDateTime = document.querySelector(".current-date-time");
currentDateTime.innerHTML = `${day} ${hour}:${minutes}, [WIP]`;
console.log(currentDateTime);

// ----------------------------------------------------------
// ------------------------ VARIABLES -----------------------
// ----------------------------------------------------------

let searchInput = document.querySelector(".search-input");

let apiBase = "https://api.shecodes.io/weather/v1/current?";
let apiKey = "&key=980b37o4b3a1b1c1ab73fe5f07d91dta";
let apiUnit = "&units=imperial";

let currentCity = document.querySelector(".current-city");
let currentTemperature = document.querySelector(".current-temperature");
let currentCondition = document.querySelector(".current-condition");
let currentWind = document.querySelector(".current-wind");
let currentIcon = document.querySelector(".current-icon");

// --------------------------------------------------------------
// ------------------------ SHOWS RESULTS -----------------------
// --------------------------------------------------------------

// Show result based on axios response

function showResult(response) {
  // show temperature and unit
  currentTemperature.innerHTML = `${Math.round(
    response.data.temperature.current
  )}`;

  // show condition, wind speed, city name, and icon
  currentCondition.innerHTML = response.data.condition.description;
  currentWind.innerHTML = `Wind: ${response.data.wind.speed} mph`;
  currentCity.innerHTML = response.data.city;
  currentIcon.src = response.data.condition.icon_url;
}

// --------------------------------------------------------------
// --------------- UPDATE API URL BASED ON SEARCH ---------------
// --------------------------------------------------------------

function search(event) {
  event.preventDefault();
  let apiQuery = `query=${searchInput.value}`;
  let fullApiUrl = `${apiBase}${apiQuery}${apiKey}${apiUnit}`;
  console.log(fullApiUrl);
  axios.get(fullApiUrl).then(showResult);
}

// run search function when form is submitted
let form = document.querySelector("form");
form.addEventListener("submit", search);

// ------------------------------------------------------
// ---------- UPDATE BASED ON CURRENT LOCATION ----------
// ------------------------------------------------------

// takes position, updates the API URL using coordinates, then runs show results
function searchGeolocation(position) {
  let apiLon = `${position.coords.longitude}`;
  let apiLat = `${position.coords.latitude}`;

  let fullApiUrl = `${apiBase}lon=${apiLon}&lat=${apiLat}&key=${apiKey}${apiUnit}`;
  console.log(fullApiUrl);
  axios.get(fullApiUrl).then(showResult);
}
// takes event, returns position
function getGeolocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchGeolocation);
}

// run when button is clicked
let button = document.querySelector(".current-location-button");
button.addEventListener("click", getGeolocation);

// ---------------------------------------
// ------------ CONVERT UNITS ------------
// ---------------------------------------

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

// ---------------------------------------
// ---------------- TESTING --------------
// ---------------------------------------

# To add the HTML and CSS for forecast
# To add the API call to get the forecast
# Replace the dummy content