// Constants 
const COUNT = 5;
const APIKEY = "5aaeb0c0c30479c224f891798b7ec5b5";

// Variables
var searchTerm = "";

function showData() {
    // Fetches the users search input and stores it in a variable
    searchTerm = $("#searchTerm").val();
    // Cretes a new list item
    var historyItem = $("<li>");
    // Adds the history list class
    historyItem.attr("class", "history-list");
    // Creates a new html link element
    var searchedCity = $("<a>");
    // Sets the link text to what the users search input was
    searchedCity.text(searchTerm);
    // Adds a URL to the link TODO: make this the same as the first searched URL
    searchedCity.attr("href", "wwww.google.com");
    // Adds the link to the list item
    historyItem.append(searchedCity);
    // Adds the list item to the list
    $("#history").append(historyItem);

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=" + APIKEY + "&units=metric";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (result) {

        // Uses the unix timestamp and converts into readable date format
        var UNIX_Timestamp = result.dt;
        var date = new Date(UNIX_Timestamp * 1000);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var cityDate = "(" + day + "/" + month + "/" + year + ")";

        // Fetches the image icon from the api and displays it in an <img> element
        var icon = $("<img>");
        var iconCode = result.weather[0].icon;
        var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
        icon.attr("src", iconURL);

        // Creates a heading featuring the city name + date
        weatherCity = $("<h3>");
        weatherCity.text(result.name + " " + cityDate).append(icon);


        var temp = $("<h5>");
        // Included "&units=metric" in the queryURL, so we will use degerees celsius
        temp.text("Temperature: " + result.main.temp + " °C");

        // Creates an element to display the humidity
        var humidity = $("<h5>");
        humidity.text("Humidity " + result.main.humidity + "%");

        var windSpeed = $("<h5>");
        // Convert wind speed from m/s to km/h
        windSpeed.text("Wind Speed " + (result.wind.speed * 3.6) + " km/h");

        // Retrieve the latitude and longitude of the searched city
        var lat = result.coord.lat;
        var lon = result.coord.lon;
        // New api call using lat & lon to find the UV Index (data wasn't included in first API call)
        var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKEY;

        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).then(function (uvResult) {

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

            // Appends all the current weather data to the weather results div
            $("#weather-results").append(weatherCity, temp, humidity, windSpeed, uvIndex);

            // New api call using lat & lon to find the daily forecast (data wasn't included in the first two API calls)
            var forecastQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely, hourly,&appid=" + APIKEY + "&units=metric";
            $.ajax({
                url: forecastQueryURL,
                method: "GET"
            }).then(function (forecastResult) {
                console.log(forecastResult);
                for (i = 1; i < 6; i++) {
                    // New div for each daily forecast
                    var forecastDiv = $("<div>");

                    // Converts time into date
                    var UNIX_Timestamp = forecastResult.daily[i].dt;
                    var date = new Date(UNIX_Timestamp * 1000);
                    var day = date.getDate();
                    var month = date.getMonth() + 1;
                    var year = date.getFullYear();
                    // Displays date in readable format
                    var cityDate = "(" + day + "/" + month + "/" + year + ")";

                    // Gets the icon
                    var icon = $("<img>");
                    var iconCode = forecastResult.daily[i].weather[0].icon;
                    console.log(iconCode);
                    var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
                    icon.attr("src", iconURL);

                    // Gets the temperature
                    var temp = $("<p>");
                    temp.text("Temp: " + forecastResult.daily[i].temp.day + " °C");

                    // Gets the humidity
                    var humidity = $("<p>");
                    humidity.text("Humidity" + forecastResult.daily[i].humidity + "%");

                    // Appends the data to the div
                    forecastDiv.append(cityDate, icon, temp, humidity);
                    // Styles the div
                    forecastDiv.attr("class", "STYLING-HERE");
                    $("#forecast-results").append(forecastDiv);
                }
            });
        });
    });
}

// Search button on click
$("#searchButton").on("click", function () {
    // Clears the previous weather result
    $("#weather-results").empty();
    $("#forecast-results").empty();
    showData();
});

