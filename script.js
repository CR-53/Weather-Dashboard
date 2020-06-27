// Constants 
const COUNT = 5;
const APIKEY = "5aaeb0c0c30479c224f891798b7ec5b5";

/**
 * Uses the unix timestamp and converts into readable date format
 * @param {string} dateDT string containing date as UNIX_Timestamp
 * @returns {string} human readable date
 */
function formatDate(dateDT) {
    var UNIX_Timestamp = dateDT;
    var date = new Date(UNIX_Timestamp * 1000);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return "(" + day + "/" + month + "/" + year + ")";
}

/**
 * Displays the provided current weather info on the screeen
 * @param {object} weatherData result of openweathermap api call for current weather of a city
 */
function displayWeatherData(weatherData) {
    // Fetches the date
    var cityDate = formatDate(weatherData.dt);

    // Fetches the image icon from the api and displays it in an <img> element
    var icon = $("<img>");
    var iconCode = weatherData.weather[0].icon;
    var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
    icon.attr("src", iconURL);

    // Creates a heading featuring the city name + date
    weatherCity = $("<h3>");
    weatherCity.text(weatherData.name + " " + cityDate).append(icon);

    var temp = $("<h5>");
    // Included "&units=metric" in the queryURL, so we will use degerees celsius
    temp.text("Temperature: " + weatherData.main.temp + "°C");

    // Creates an element to display the humidity
    var humidity = $("<h5>");
    humidity.text("Humidity: " + weatherData.main.humidity + "%");

    var windSpeed = $("<h5>");
    // Convert wind speed from m/s to km/h
    windSpeed.text("Wind Speed: " + (weatherData.wind.speed * 3.6) + " km/h");

    // Appends all the current weather data to the weather results div (except for uvIndex)
    $("#weather-results").append(weatherCity, temp, humidity, windSpeed);
};

/**
 * Fetches the current weather data of the provided city using openweathermap api call
 * @param {string} cityName name of searched city
 */
function fetchWeatherData(cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKEY + "&units=metric";

    return $.ajax({
        url: queryURL,
        method: "GET"
    });
}

/**
 * Fetches the uv index of the provided city using openweathermap api call
 * @param {string} lat latitude of searched city
 * @param {string} lon longitude of search city
 */
function fetchUVIndex(lat, lon) {
    // New api call using lat & lon to find the UV Index (data wasn't included in first API call)
    var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY;

    return $.ajax({
        url: uvQueryURL,
        method: "GET"
    });
}

/**
 * Displays the provided uv index to the screen and changes the colour based on severity of UV
 * @param {object} uvResult result of openweathermap api call for uv index of searched city
 */
function displayUVIndex(uvResult) {
    // If else statements to create the uvIndex html and give it the appropriate class based on the current uv rating
    if (uvResult.value < 3) {
        var uvIndex = $("<h5>").text("UV Index: ").append('<span class="low-uv">' + uvResult.value + '</span>');
    }

    else if ((uvResult.value >= 3) && (uvResult.value < 6)) {
        var uvIndex = $("<h5>").text("UV Index: ").append('<span class="moderate-uv">' + uvResult.value + '</span>');
    }

    else if ((uvResult.value >= 6) && (uvResult.value < 8)) {
        var uvIndex = $("<h5>").text("UV Index: ").append('<span class="high-uv">' + uvResult.value + '</span>');
    }

    else if ((uvResult.value >= 8) && (uvResult.value < 11)) {
        var uvIndex = $("<h5>").text("UV Index: ").append('<span class="very-high-uv">' + uvResult.value + '</span>');
    }

    else {
        var uvIndex = $("<h5>").text("UV Index: ").append('<span class="extreme-uv">' + uvResult.value + '</span>');
    }
    // Appends the uvIndex to the weather results section
    $("#weather-results").append(uvIndex);
}

/**
 * Fetches the forecast data of the provided city using openweathermap api call
 * @param {string} lat latitude of searched city
 * @param {string} lon longitude of search city
 */
function fetchForecastData(lat, lon) {
    // New api call using lat & lon to find the daily forecast (data wasn't included in the first two API calls)
    var forecastQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely, hourly,&appid=" + APIKEY + "&units=metric";

    return $.ajax({
        url: forecastQueryURL,
        method: "GET"
    });
}

/**
 * Displays the provided daily forecast data to the screen for the next 5 days
 * @param {object} forecastData result of openweathermap api call for daily forecast of searched city
 */
function displayForecastData(forecastData) {
    for (i = 1; i < 6; i++) {
        // New div for each daily forecast
        var forecastDiv = $("<div>");

        // Gets the date
        var cityDate = formatDate(forecastData.daily[i].dt);

        // Gets the icon
        var icon = $("<img>");
        var iconCode = forecastData.daily[i].weather[0].icon;

        var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
        icon.attr("src", iconURL);

        // Gets the temperature
        var temp = $("<p>");
        temp.text("Temp: " + forecastData.daily[i].temp.day + "°C");

        // Gets the humidity
        var humidity = $("<p>");
        humidity.text("Humidity: " + forecastData.daily[i].humidity + "%");

        // Appends the data to the div
        forecastDiv.append(cityDate, icon, temp, humidity);
        // Styles the div
        forecastDiv.attr("class", "forecastDiv");
        $("#forecast-results").append(forecastDiv);
    }
}

/**
 * Adds the searched city to the search history, allows for search history to be clicked
 * @param {string} cityName searched city
 */
function prependHistory(cityName) {
    // Cretes a new list item
    var historyItem = $("<li>");
    // Adds the history list class
    historyItem.attr("class", "history-list");
    // Sets the list item text to what the users search input was
    historyItem.text(cityName);
    // Sets a click function
    historyItem.on("click", function () {
        clearDisplay();
        if (!localStorage[cityName]) {
            return;
        }
        loadDataFromStorage(cityName);
    });
    // Adds the history item to the list
    $("#history").prepend(historyItem);
}

/**
 * Loads the data corresponding to provided city from local storage and displays it on the screen
 * @param {string} cityName city to load from local storage
 */
function loadDataFromStorage(cityName) {
    var weatherData = JSON.parse(localStorage[cityName + "weatherData"]);
    displayWeatherData(weatherData);
    
    var uvData = JSON.parse(localStorage[cityName + "uvData"]);
    displayUVIndex(uvData);
    
    var forecastData = JSON.parse(localStorage[cityName + "forecastData"]);
    displayForecastData(forecastData);
}

/**
 * Performs the search and displays the returned data
 */
function performSearch() {
    // Fetches the users search input and stores it in a variable
    var searchTerm = $("#searchTerm").val();

    // Initialise local storage object for this search term
    localStorage[searchTerm] = {};

    // Fetch then save and display the weather data
    fetchWeatherData(searchTerm).then(result => {
        localStorage[searchTerm + "weatherData"] = JSON.stringify(result);
        displayWeatherData(result);

        // Fetch then save and display the uv index
        fetchUVIndex(result.coord.lat, result.coord.lon).then(uvResult => {
            localStorage[searchTerm + "uvData"] = JSON.stringify(uvResult);
            displayUVIndex(uvResult);
        });

        // Fetch then save and display the forecast data
        fetchForecastData(result.coord.lat, result.coord.lon).then(forecastResult => {
            localStorage[searchTerm + "forecastData"] = JSON.stringify(forecastResult);
            displayForecastData(forecastResult);
        });
    });
    // Adds the searched city to the history list
    prependHistory(searchTerm);
    // Sets the last search inside local storage to the last searched city name
    localStorage["lastSearch"] = searchTerm;
}

/**
 * Clears the current weather data & forecast data
 */
function clearDisplay() {
    $("#weather-results").empty();
    $("#forecast-results").empty();
}

// Performs the search
$("#searchButton").on("click", function () {
    // Clears the previous weather result
    clearDisplay();
    // Performs the search and shows the result on the screen
    performSearch();
});

// Search button on enter press
$(document).on('keypress', function (e) {
    if (e.which == 13) {
        $("#searchButton").click();
    }
});

// If data for most recent search exists, then load it
if (localStorage["lastSearch"]) {
    var cityName = localStorage["lastSearch"];
    loadDataFromStorage(cityName);
}
