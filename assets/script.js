
var cardText = $("#card-text");
var cardBody = $("#card-body");
var card1 = $("#card-1");
var uvIndexDiv = $("#uv-index")
var forecastDiv = $(".forecast-div")
//input as a global variable (what user enters in the search area)
var input;


var populateInfo = function (list) {
    console.log(list)
    //Targets the Bootstrap card element
    cardText.empty()
    var city = $("<h5>").text(list.name);
    var temperature = $("<p>").text("Temperature: " + list.main.temp);
    var humidity = $("<p>").text("Humidity: " + list.main.humidity)
    var windSpeed = $("<p>").text("Windspeed: " + list.wind.speed)
    var uvLine = $("<p>").addClass("uvForecast")
    console.log(city)

    cardText.append(city, temperature, humidity, windSpeed, uvLine);
    cardBody.append(cardText);
    //append after cardText is appended
    var uvIndexVar = uvIndex(list.coord.lat, list.coord.lon)
    var dailyForecast = forecast(list.coord.lat, list.coord.lon)
};


var searchCity = function () {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=metric" +
        "&appid=d97355d58c6b5630b8875481727974dc";
    console.log(queryURL)

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        populateInfo(response);
    }).catch(function (error) {
        console.log(error)
    });

};


// function for displaying the UV index by using a different
function uvIndex(lat, lon) {
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon +
        "&appid=d97355d58c6b5630b8875481727974dc";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        var uvForecast = $(".uvForecast")
        var span = $("<span>" + response.value + "</span>").css("background-color", "red")
        var responseValue = $("<p> UV Index: </p >")
        responseValue.append(span)
        uvForecast.text(response.value)
        if (response.value >= 6) {
            $("#uv-index").html(responseValue)
        };

    });

}

function forecast(lat, lon) {
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric" +
        "&exclude=hourly,minutely" + "&appid=d97355d58c6b5630b8875481727974dc"
    console.log(queryURL)

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response)
        forecastDiv.empty()
        for (i = 0; i < 5; i++) {
            var today = response.daily[i]
            //unix to regular time and day var date=new Date(today.dt * 1000).toDateString(); console.log(today.dt) var
            todayCard = `<div class="col-sm-2">
    <div class="card">
        <div class="card-body" style="background-color: #0BB5FF;">
            <h5 class="card-title" style="color:white;"> ${date} </h5>
            <img src="http://openweathermap.org/img/w/${today.weather[0].icon}.png" <p class="card-text">
            Temperature ${today.temp.day}</p>
            <p> Humidity: ${today.humidity}</p>
        </div>
    </div>
    </div>`
            $(".forecast-div").append(todayCard)

        }
    });
}

//// Adding data
// const cities = ['Chicago', 'Milwaukee', 'Miami']
// localStorage.setItem('test', JSON.stringify(cities))

// Getting data
// const savedCities = localStorage.getItem('test')
// console.log(JSON.parse(savedCities))

$("#search-button").click(function (event) {
    event.preventDefault();
    input = $("#myInput").val();
    console.log(input)
    // first, get the cities
    //json parse the cities
    var cities = JSON.parse(localStorage.getItem("searched cities")) || []

    //take our city and put it into the array of cities
    cities.push(input)
    // json.stringify (turning into a string) and set it in the local storage
    localStorage.setItem("searched cities", JSON.stringify(cities))

    searchCity()
    $(".past-searches").append("<li>" + input + "</li>")
});

var cities = JSON.parse(localStorage.getItem("searched cities")) || []
console.log(cities)
for (var i = 0; i < cities.length; i++) {
    $(".past-searches").append("<li>" + cities[i] + "</li>")
}

