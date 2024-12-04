const API_KEY = 'YOUR_API_KEY';  // Replace with your OpenWeather API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast?';

$(document).ready(function () {
  // Load search history from localStorage
  loadSearchHistory();

  // Search button event
  $('#search-btn').click(function () {
    const city = $('#city-search').val().trim();
    if (city) {
      getWeatherData(city);
      addSearchHistory(city);
    }
  });

  // Handle search history item click
  $(document).on('click', '#search-history li', function () {
    const city = $(this).text();
    getWeatherData(city);
  });

  // Function to get weather data from OpenWeather API
  function getWeatherData(city) {
    const url = `${BASE_URL}q=${city}&appid=${API_KEY}&units=metric`;

    $.ajax({
      url: url,
      method: 'GET',
      success: function (response) {
        displayCurrentWeather(response);
        displayForecast(response);
      },
      error: function () {
        alert('City not found!');
      }
    });
  }

  // Function to display current weather
  function displayCurrentWeather(data) {
    const cityName = data.city.name;
    const weather = data.list[0].weather[0];
    const temp = data.list[0].main.temp;
    const humidity = data.list[0].main.humidity;
    const wind = data.list[0].wind.speed;

    $('#city-name').text(`${cityName} - ${new Date().toLocaleDateString()}`);
    $('#current-weather').text(weather.description);
    $('#current-temp').text(`Temperature: ${temp}°C`);
    $('#current-humidity').text(`Humidity: ${humidity}%`);
    $('#current-wind').text(`Wind Speed: ${wind} m/s`);
  }

  // Function to display 5-day forecast
  function displayForecast(data) {
    $('#forecast-container').empty();
    for (let i = 0; i < 5; i++) {
      const forecast = data.list[i * 8];  // 3-hour intervals, 8 items per day
      const date = new Date(forecast.dt * 1000).toLocaleDateString();
      const icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
      const temp = forecast.main.temp;
      const humidity = forecast.main.humidity;
      const wind = forecast.wind.speed;

      const forecastItem = `
        <div class="forecast-item">
          <h4>${date}</h4>
          <img src="${icon}" alt="${forecast.weather[0].description}">
          <p>Temp: ${temp}°C</p>
          <p>Humidity: ${humidity}%</p>
          <p>Wind: ${wind} m/s</p>
        </div>
      `;
      $('#forecast-container').append(forecastItem);
    }
  }

  // Function to save search history to localStorage
  function addSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
      history.push(city);
      localStorage.setItem('searchHistory', JSON.stringify(history));
      loadSearchHistory();
    }
  }

  // Function to load search history from localStorage
  function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    $('#search-history').empty();
    history.forEach(city => {
      $('#search-history').append(`<li>${city}</li>`);
    });
  }
});
