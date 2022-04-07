// variables for page function //
var timeDisplayEl = $("#time-display");
var searchFormEl = $('#search-form');
var APIkey = '2512f35cd9188a4c02534a5ab66c2457';

var currentCity;

// time display function
function displayTime() {
    var rightNow = moment().format("MMM DD, YYYY [at] hh:mm:ss a");
    timeDisplayEl.text(rightNow);
}

setInterval(displayTime, 1000);

function getWeather(data) {
    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&units={standard}&exclude={part}&appid={APIkey}'
    fetch(requestUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // get current weather
            var currentConditionsEl = document.querySelector('.current-weather-container');
            currentConditionsEl.addClass('border border-primary');

            var cityNameEl = $('<h3>');
            cityNameEl.text(currentCity);
            currentConditionsEl.append(cityNameEl);

            // get date for current city
            var currentCityDate = data.current.dt;
            currentCityDate = moment.unix(currentCityDate).format('MM/DD/YYYY');
            var currentDateEl = $('<span>');
            currentDateEl.text(` (${currentCityDate}) `);
            cityNameEl.append(currentDateEl);

            var currentCityWeatherIcon = data.current.weather[0].icon;
            var currentWeatherIconEl = $('<img>');
            currentWeatherIconEl.attr("src", "http://openweathermap.org/img/wn/" + currentCityWeatherIcon + ".png");
            cityNameEl.append(currentWeatherIconEl);

            // get temperature data
            var currentCityTemp = data.current.temp;
            var currentTempEl = $('<p>')
            currentTempEl.text(`Temp: ${currentCityTemp}`)
            currentConditionsEl.append(currentTempEl);

            // get wind
            var currentCityWind = data.current.wind_speed;
            var currentWindEl = $('<p>')
            currentWindEl.text(`Wind: ${currentCityWind}`)
            currentConditionsEl.append(currentWindEl);

            // get humidity
            var currentCityHumidity = data.current.humidity;
            var currentHumidityEl = $('<p>')
            currentHumidityEl.text(`Humidity: ${currentCityHumidity}`)
            currentConditionsEl.append(currentHumidityEl);

            // get UV index and set background color based on index
            var currentCityUv = data.current.uvi;
            var currentUvEl = $('<p>');
            var currentUvSpanEl = $('<span>');
            currentUvEl.append(currentUvSpanEl);

            currentUvSpanEl.text(`UV Index: ${currentCityUv}`)

            if (currentCityUv < 3 ) {
                currentUvSpanEl.css({'background-color':'green', 'color':'white'});
            } else if (currentCityUv < 6 ) {
                currentUvSpanEl.css({'background-color':'yellow', 'color':'black'});
            } else if (currentCityUv < 8 ) {
                currentUvSpanEl.css({'background-color':'orange', 'color':'white'});
            } else if (currentCityUv < 11 ) {
                currentUvSpanEl.css({'background-color':'red', 'color':'white'});
            } else {
                currentUvSpanEl.css({'Background-color':'violet', 'color':'white'});
            }

            currentConditionsEl.append(currentUvEl);

            // get 5 day forecast
            var fiveDayForecastEl = $('.forecast-container');

            for (var i = 1; i <=5; i++) {
                var date;
                var temp;
                var icon;
                var wind;
                var humidity;
                var uvIndex;

                date = data.daily[i].dt;
                date = moment.unix(date).format('MM/DD/YYYY');

                temp = data.daily[i].temp.day;
                icon = data.daily[i].weather[0].icon;
                wind = data.daily[i].wind_speed;
                humidity = data.daily[i].humidity;
                uvIndex = data.daily[i].uvi;

                // creating cards for each day of forecast
                var card = document.createElement('section');
                card.classList.add('card', 'col-2', 'm-1', 'bg-primary', 'text-white');

                var cardBody = document.createElement('section');
                cardBody.classList.add('card-body')
                cardBody.innerHTML = `<h4>${date}</h4>
                    <img src= "http://openweathermap.org/img/wn/${icon}.png"></><br>
                    ${temp}<br>
                    ${wind}<br>
                    ${humidity}<br>
                    ${uvi}`

                card.appendChild(cardBody)
                fiveDayForecastEl.append(card);
            }
        })
    return;
}


