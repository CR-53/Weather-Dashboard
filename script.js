var APIkey = "5aaeb0c0c30479c224f891798b7ec5b5";
var searchTerm = "";

var city = "";
var countryCode = "";
var UNIX_Timestamp = 0;

$("#searchButton").on("click", function () {
    event.preventDefault();
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

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=" + APIkey + "&units=metric";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (result) {
        console.log(result);

        // Uses the unix timestamp and converts into readable date format
        var UNIX_Timestamp = result.dt;
        var date = new Date(UNIX_Timestamp * 1000);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var cityDate = "(" + day + "/" + month + "/" + year + ")";

        // Creates a heading featuring the city name + date
        weatherCity = $("<h3>");
        weatherCity.text(result.name + " " + cityDate);

        // Fetches the image icon from the api and displays it in an <img> element
        var icon = $("<img>");
        var iconCode = result.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
        icon.attr("src", iconURL);

        var temp = $("<h5>");
        // Included "&units=metric" in the queryURL, so we will use degerees celsius
        temp.text("Temperature: " + result.main.temp + " °C");

        // Creates an element to display the humidity
        var humidity = $("<h5>");
        humidity.text("Humidity " + result.main.humidity + " %");

        var windSpeed = $("<h5>");
        // Convert wind speed from m/s to km/h
        windSpeed.text("Wind Speed " + (result.wind.speed * 3.6) + " km/h");

        // Retrieve the latitude and longitude of the searched city
        var lat = result.coord.lat;
        var lon = result.coord.lon;
        // New api call using lat & lon to find the UV Index
        var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIkey;

        $.ajax({
            url: uvQueryURL,
            method: "GET"
        }).then(function (uvResult) {
            console.log(uvResult.value);

            // Creates an element to display the UV Index
            var uvIndex = $("<h5>");
            uvIndex.text("UV Index: " + uvResult.value);

            $("#weather-results").append(weatherCity, icon, temp, humidity, windSpeed, uvIndex);
        });
    });

    // 5 Day Forecast here
});


