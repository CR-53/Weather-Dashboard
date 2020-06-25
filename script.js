var APIkey = "5aaeb0c0c30479c224f891798b7ec5b5";
var searchTerm = "";

var city = "";
var countryCode = "";

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
    });
});
