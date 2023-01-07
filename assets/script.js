// variables for page function //
var timeDisplayEl = $("#time-display");
var searchFormEl = document.querySelector('#search-form')
var searchFormCityInputEl = document.querySelector('#search-input');
var weatherDayCityEl = document.querySelector('#weather-day-city');
var weatherDayTempEl = document.querySelector('#weather-day-temp');
var weatherDayWindEl = document.querySelector('#weather-day-wind');
var weatherDayHumidityEl = document.querySelector('#weather-day-humidity');
var weatherDayUvIndexEl = document.querySelector('#weather-day-uv-index');
var forecastContainerEl = document.querySelector('#forecast-container');
var weatherDayIconEl = document.querySelector('#weather-day-icon');
var buttonContainerEl = document.querySelector('#button-container');
var weatherDayContainerEl = document.querySelector('#current-weather-container');
var outerForecastContainerEl = document.querySelector('#outer-forecast-container');
var weatherDayDateEl = document.querySelector('#weather-day-date');
var clearHistoryBtnEl = document.querySelector('#clear-history')

var baseUrl = 'http://api.openweathermap.org/';
var apiKey = '2a756868a72daf81c811b7769b885832';

// time display function
function displayTime() {
    var rightNow = moment().format("MMM DD, YYYY [at] hh:mm:ss a");
    timeDisplayEl.text(rightNow);
}

setInterval(displayTime, 1000);

// gets current weather for current city
function getCityWeather(city) {
    var url = `${baseUrl}geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (!data.length) {
                window.alert("No city matches.");
                return;
            }

            storeCityLocation(city);
            addButtons();

            var cityObject = data[0];
            var lat = cityObject.lat;
            var lon = cityObject.lon;

            var currentWeatherUrl = `${baseUrl}data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
            // get current weather from onecall api
            fetch(currentWeatherUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data);
                    var date = moment(Date.now()).format("L");
                    var current = data.current;
                    var temp = current.temp;
                    var windSpeed = current.wind_speed;
                    var humidity = current.humidity;
                    var uvIndex = current.uvi;
                    var icon = current.weather[0].icon;

                    weatherDayCityEl.textContent = city;
                    weatherDayDateEl.textContent = date;
                    weatherDayTempEl.textContent = temp;
                    weatherDayWindEl.textContent = windSpeed;
                    weatherDayHumidityEl.textContent = humidity;
                    weatherDayUvIndexEl.textContent = uvIndex;
                    if (uvIndex < 3) {
                        weatherDayUvIndexEl.classList.add('favorable');
                    } else if (uvIndex < 7) {
                        weatherDayUvIndexEl.classList.add('moderate');
                    } else {
                        weatherDayUvIndexEl.classList.add('severe');
                    }

                    weatherDayIconEl.src = `https://openweathermap.org/img/wn/${icon}.png`;
                    weatherDayContainerEl.classList.remove('hide');
                    get5dayForecast(data.daily);
                });
        });
}

function addButtons() {
    buttonContainerEl.innerHTML = "";
    var cities = window.localStorage.getItem('cities');
    if (cities) {
        cities = JSON.parse(cities);
    } else {
        cities = [];
    }

    cities.forEach(function (city) {
        var button = document.createElement('button');
        button.classList = "btn btn-secondary col-12";
        button.textContent = city;
        button.setAttribute('data-city', city);
        buttonContainerEl.appendChild(button);
    });
}

function get5dayForecast(data) {
    forecastContainerEl.innerHTML = "";
    data.forEach(function (day, index) {
        if (index === 0 || index > 5) {
            return;
        }
        var dt = day.dt;
        var date = moment(dt * 1000).format("L");
        var temp = day.temp.day;
        var windSpeed = day.wind_speed;
        var humidity = day.humidity;
        var icon = day.weather[0].icon;
        var section = document.createElement('section');
        var offsetClass = "";
        if (index === 1) {
            offsetClass = "col-lg-offset-1";
        }
        section.classList = `card-weather-container col-sm-12 ${offsetClass} col-lg-2 text-light`;
        section.innerHTML = `
            <section class='card-weather bg-dark p-3'>
                <h4>${date}</h4>
                <img src='https://openweathermap.org/img/wn/${icon}.png' />
                <dl>
                    <dt>Temp:</dt>
                    <dd>${temp} °F</dd>
                    <dt>Wind:</dt>
                    <dd>${windSpeed} mph</dd>
                    <dt>Humidity:</dt>
                    <dd>${humidity} %</dd>
                </dl>
            </section>
        `;
        forecastContainerEl.appendChild(section);
        forecastContainerEl.classList.remove('hide');
    });
    outerForecastContainerEl.classList.remove('hide')
}

function storeCityLocation(city) {
    city = city.toLowerCase();
    var cities = window.localStorage.getItem('cities');
    if (cities) {
        cities = JSON.parse(cities);
    } else {
        cities = [];
    }
    if (cities.includes(city)) {
        return;
    } else {
        cities.push(city);
    }
    window.localStorage.setItem('cities', JSON.stringify(cities));
}

// submits city name to get city weather
function cityFormSubmit(evt) {
    evt.preventDefault();
    var city = searchFormCityInputEl.value.trim()
    getCityWeather(city);
}

function handleButtonClick(evt) {
    var target = evt.target;
    var city = target.getAttribute('data-city');
    getCityWeather(city);
}

function addEventListeners() {
    searchFormEl.addEventListener('submit', cityFormSubmit);
    buttonContainerEl.addEventListener('click', handleButtonClick);
}

function init() {
    addEventListeners();
    addButtons();
}

clearHistoryBtnEl.addEventListener("click", function () {
    localStorage.clear();
    document.querySelector("#button-container").innerHTML = "";
    outerForecastContainerEl.classList.add('hide');
    weatherDayContainerEl.classList.add('hide');
    forecastContainerEl.classList.add('hide');
});

init();