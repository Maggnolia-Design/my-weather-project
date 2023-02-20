// ------------------------------------------------------
// ----------- SHOW CURRENT WEEKDAY AND TIME ------------
// ------------------------------------------------------

function getDateTime(coordinates) {
  let timeApiBase =
    "https://api.timezonedb.com/v2.1/get-time-zone?key=5DF9APBUNYVJ&format=json&by=position";
  let fullTimeApiURL = `${timeApiBase}&lat=${coordinates.latitude}&lng=${coordinates.longitude}`;
  axios.get(fullTimeApiURL).then(showDateTime);
}

function showDateTime(response) {
  let day = response.data.formatted.slice(8, 10);
  let time = response.data.formatted.slice(11, 16);
  let abbreviation = response.data.abbreviation;
  let monthNumber = parseInt(response.data.formatted.slice(5, 7));
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let currentDateTime = document.querySelector(".current-date-time");
  currentDateTime.innerHTML = `${months[monthNumber]} ${day} ${time} ${abbreviation}`;
}

// --------------------------------------------------------------
// ------------------ SHOWS RESULTS, CURRENT --------------------
// --------------------------------------------------------------

// Shows result for current situation based on axios response

function showCurrentWeather(response) {
  let currentCity = document.querySelector(".current-city");
  let currentTemp = document.querySelector(".current-temp");
  let currentCondition = document.querySelector(".current-condition");
  let currentWind = document.querySelector(".current-wind");
  let currentHumidity = document.querySelector(".current-humidity");
  let currentIcon = document.querySelector(".current-icon");

  // show temperature and unit
  currentTemp.innerHTML = `${Math.round(response.data.temperature.current)}`;

  // show condition, wind speed, city name, and icon
  currentCondition.innerHTML = `Status: ${response.data.condition.description}`;
  currentWind.innerHTML = `Wind: ${response.data.wind.speed}`;
  currentHumidity.innerHTML = `Humidity: ${response.data.temperature.humidity}%`;
  currentCity.innerHTML = response.data.city;
  currentIcon.src = response.data.condition.icon_url;

  // Using this for date and time function above
  getDateTime(response.data.coordinates);
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
// ----------------- GET WEATHER BASED ON SEARCH ----------------
// --------------------------------------------------------------

// ------------------------ API VARIABLES -----------------------

let apiBase = "https://api.shecodes.io/weather/v1/";
let apiKey = "&key=980b37o4b3a1b1c1ab73fe5f07d91dta";

// -------------------------- FUNCTIONS -------------------------

function getCurrentWeather(city) {
  let fullApiUrl = `${apiBase}current?query=${city}${apiKey}&units=imperial`;
  console.log(fullApiUrl);
  axios.get(fullApiUrl).then(showCurrentWeather);
}

function getForecastWeather(city) {
  let fullApiUrl = `${apiBase}forecast?query=${city}${apiKey}&units=imperial`;
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

// -------------------- SHOW BOSTON ON LOAD ---------------------
getCurrentWeather("Boston");
getForecastWeather("Boston");

// --------------------------------------------------------------
// ------------ UPDATE WEATHER BASED ON GEOLOCATION -------------
// --------------------------------------------------------------

// takes position, updates the API URL using coordinates, then runs showCurrentResult
function searchGeolocation(position) {
  let apiLon = `${position.coords.longitude}`;
  let apiLat = `${position.coords.latitude}`;

  let fullApiUrl = `${apiBase}current?lon=${apiLon}&lat=${apiLat}&key=${apiKey}&units=imperial`;
  console.log(fullApiUrl);
  axios.get(fullApiUrl).then(showCurrentWeather);
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
  let tempUnit = document.querySelector(".temp-unit");
  let windUnit = document.querySelector(".wind-unit");

  if (tempUnit.innerHTML === "°F") {
    //switches to celcius
    function getCurrentWeather() {
      let fullApiUrl = `${apiBase}current?query=${city}${apiKey}&units=metric`;
      axios.get(fullApiUrl).then(showCurrentWeather);
      tempUnit.innerHTML = "°C";
      windUnit.innerHTML = "&nbspmps";
    }

    function getForecastWeather() {
      let fullApiUrl = `${apiBase}forecast?query=${city}${apiKey}&units=metric`;
      axios.get(fullApiUrl).then(showForecastWeather);
    }

    //switches to farenheit
  } else {
    function getCurrentWeather() {
      let fullApiUrl = `${apiBase}current?query=${city}${apiKey}&units=imperial`;
      axios.get(fullApiUrl).then(showCurrentWeather);
      tempUnit.innerHTML = "°F";
      windUnit.innerHTML = "&nbspmph";
    }

    function getForecastWeather() {
      let fullApiUrl = `${apiBase}forecast?query=${city}${apiKey}&units=imperial`;
      axios.get(fullApiUrl).then(showForecastWeather);
    }
  }
  getCurrentWeather();
  getForecastWeather();
}

let convertButton = document.querySelector(".convert-button");
convertButton.addEventListener("click", convert);
