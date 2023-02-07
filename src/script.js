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

let apiBase = "https://api.shecodes.io/weather/v1/";
let apiKey = "&key=980b37o4b3a1b1c1ab73fe5f07d91dta";
let apiUnit = "&units=imperial";

let currentCity = document.querySelector(".current-city");
let currentTemperature = document.querySelector(".current-temperature");
let currentCondition = document.querySelector(".current-condition");
let currentWind = document.querySelector(".current-wind");
let currentIcon = document.querySelector(".current-icon");

// --------------------------------------------------------------
// ------------------ SHOWS RESULTS, CURRENT --------------------
// --------------------------------------------------------------

// Shows result for current situation based on axios response

function showCurrentWeather(response) {
  // show temperature and unit
  currentTemperature.innerHTML = `${Math.round(
    response.data.temperature.current
  )}`;

  // show condition, wind speed, city name, and icon
  currentCondition.innerHTML = `Status: ${response.data.condition.description}`;
  currentWind.innerHTML = `Wind: ${response.data.wind.speed} mph`;
  currentCity.innerHTML = response.data.city;
  currentIcon.src = response.data.condition.icon_url;
}

// ----------------------------------------------------
// ------------- SHOWS RESULTS, FORECAST --------------
// ----------------------------------------------------

// Shows result for forecasted situation

function showForecastWeather(response) {
  let forecastDiv = document.querySelector(".forecast > .row");
  let forecastHTML = "";

  let forecastDays = ["Tues", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];

  // here, we are looping through the days, each time
  // appending a new day-specific div to the end of the existing one (concatitation)

  for (var i = 0; i < 6; i++) {
    forecastHTML =
      forecastHTML +
      `
    <div class="col">
      <p class="forecast-day">${forecastDays[i]}</p>
      <img class="forecast-icon" src="${
        response.data.daily[i].condition.icon_url
      }"></img>
      <h4>
        <span class="forecast-high">${Math.round(
          response.data.daily[i].temperature.maximum
        )}°</span> | 
        <span class="forecast-low">${Math.round(
          response.data.daily[i].temperature.minimum
        )}°</span>
      </h4>
    </div>
  `;
  }

  // end by injecting final variable into HTML
  forecastDiv.innerHTML = forecastHTML;
}

// --------------------------------------------------------------
// --------------- UPDATE API URL BASED ON SEARCH ---------------
// --------------------------------------------------------------

function getCurrentWeather(city) {
  let fullApiUrl = `${apiBase}current?query=${city}${apiKey}${apiUnit}`;
  console.log(fullApiUrl);
  axios.get(fullApiUrl).then(showCurrentWeather);
}

function getForecastWeather(city) {
  let fullApiUrl = `${apiBase}forecast?query=${city}${apiKey}${apiUnit}`;
  console.log(fullApiUrl);
  axios.get(fullApiUrl).then(showForecastWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let apiQuery = document.querySelector(".search-input");

  getCurrentWeather(apiQuery.value);
  getForecastWeather(apiQuery.value);
}

let form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);

// get current and forecasted weather information for city of Boston
getCurrentWeather("Boston");
getForecastWeather("Boston");

// --------------------------------------------------------------
// ---------- UPDATE API URL BASED ON CURRENT LOCATION ----------
// --------------------------------------------------------------

// takes position, updates the API URL using coordinates, then runs showCurrentResult
function searchGeolocation(position) {
  let apiLon = `${position.coords.longitude}`;
  let apiLat = `${position.coords.latitude}`;

  let fullApiUrl = `${apiBase}current?lon=${apiLon}&lat=${apiLat}&key=${apiKey}${apiUnit}`;
  console.log(fullApiUrl);
  axios.get(fullApiUrl).then(showCurrentResult);
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

// to convert units, I'll try running getCurrentWeather and getForecastWeather apiUnit = "&units=metrics"
// city is already known
function convert(event) {
  let city = document.querySelector(".current-city").innerHTML;
  let currentUnit = document.querySelector(".current-unit");

  if (currentUnit.innerHTML === "°F") {
    //switches to celcius
    function getCurrentWeather() {
      let fullApiUrl = `${apiBase}current?query=${city}${apiKey}&units=metrics`;
      axios.get(fullApiUrl).then(showCurrentWeather);
    }

    function getForecastWeather() {
      let fullApiUrl = `${apiBase}forecast?query=${city}${apiKey}&units=metrics`;
      axios.get(fullApiUrl).then(showForecastWeather);
      currentUnit.innerHTML = "°C";
      console.log(currentUnit.innerHTML);
    }

    //switches to farenheit
  } else {
    function getCurrentWeather() {
      let fullApiUrl = `${apiBase}current?query=${city}${apiKey}&units=imperial`;
      axios.get(fullApiUrl).then(showCurrentWeather);
    }

    function getForecastWeather() {
      let fullApiUrl = `${apiBase}forecast?query=${city}${apiKey}&units=imperial`;
      axios.get(fullApiUrl).then(showForecastWeather);
      currentUnit.innerHTML = "°F";
      console.log(currentUnit.innerHTML);
    }
  }
  getCurrentWeather();
  getForecastWeather();
}

let convertButton = document.querySelector(".convert-button");
convertButton.addEventListener("click", convert);
