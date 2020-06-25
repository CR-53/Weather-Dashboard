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

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm + "&appid=" + APIkey;

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
        console.log(cityDate);


        weatherCity = $("<h3>");
        weatherCity.text(result.name + " " + cityDate);
        
        $("#weather-results").append(weatherCity);
    });
});
