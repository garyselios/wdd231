
// ==============================
// CONFIGURATION
// ==============================
const API_KEY = '15b6e195691a7259316c6baf1613af7e'; // ⚠️ WARNING: Don't publish this!
const LAT = -34.9011;
const LON = -56.1645;
const UNITS = 'imperial'; // Changed to 'imperial' for Fahrenheit (matches your HTML)
const LANG = 'en';

const API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=${UNITS}&lang=${LANG}`;

// ==============================
// HTML ELEMENTS FROM YOUR HTML
// ==============================
const elements = {
    // Current weather elements
    cityName: document.querySelector('h3'), // The <h3> in .current-weather
    weatherIcon: document.getElementById('weatherIcon'),
    currentTemp: document.getElementById('currentTemp'),
    weatherDesc: document.getElementById('weatherDesc'),
    windSpeed: document.getElementById('windSpeed'),
    humidity: document.getElementById('humidity'),

    // Forecast container
    forecastContainer: document.getElementById('forecastContainer'),

    // Forecast template (for creating forecast cards)
    forecastCardTemplate: null
};

// ==============================
// WEATHER ICON MAPPING
// ==============================
const weatherIcons = {
    '01d': 'https://openweathermap.org/img/wn/01d@2x.png', // clear sky (day)
    '01n': 'https://openweathermap.org/img/wn/01n@2x.png', // clear sky (night)
    '02d': 'https://openweathermap.org/img/wn/02d@2x.png', // few clouds (day)
    '02n': 'https://openweathermap.org/img/wn/02n@2x.png', // few clouds (night)
    '03d': 'https://openweathermap.org/img/wn/03d@2x.png', // scattered clouds
    '03n': 'https://openweathermap.org/img/wn/03n@2x.png',
    '04d': 'https://openweathermap.org/img/wn/04d@2x.png', // broken clouds
    '04n': 'https://openweathermap.org/img/wn/04n@2x.png',
    '09d': 'https://openweathermap.org/img/wn/09d@2x.png', // shower rain
    '09n': 'https://openweathermap.org/img/wn/09n@2x.png',
    '10d': 'https://openweathermap.org/img/wn/10d@2x.png', // rain (day)
    '10n': 'https://openweathermap.org/img/wn/10n@2x.png', // rain (night)
    '11d': 'https://openweathermap.org/img/wn/11d@2x.png', // thunderstorm
    '11n': 'https://openweathermap.org/img/wn/11n@2x.png',
    '13d': 'https://openweathermap.org/img/wn/13d@2x.png', // snow
    '13n': 'https://openweathermap.org/img/wn/13n@2x.png',
    '50d': 'https://openweathermap.org/img/wn/50d@2x.png', // mist
    '50n': 'https://openweathermap.org/img/wn/50n@2x.png'
};

// ==============================
// MAIN FUNCTION TO FETCH WEATHER DATA
// ==============================
async function fetchWeatherData() {
    try {
        console.log('Fetching weather data from OpenWeatherMap...');
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Weather data received successfully');

        updateCurrentWeather(data);
        updateForecast(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        showErrorMessage('Unable to load weather data. Please try again later.');
    }
}

// ==============================
// UPDATE CURRENT WEATHER DISPLAY
// ==============================
function updateCurrentWeather(data) {
    if (!data.list || data.list.length === 0) {
        console.error('No weather data available');
        return;
    }

    const current = data.list[0];
    const city = data.city.name;

    console.log('Updating current weather with:', {
        city: city,
        temp: current.main.temp,
        desc: current.weather[0].description,
        wind: current.wind.speed,
        humidity: current.main.humidity,
        icon: current.weather[0].icon
    });

    // Update city name (Montevideo)
    if (elements.cityName) {
        elements.cityName.textContent = city;
    }

    // Update temperature (in Fahrenheit since UNITS is 'imperial')
    if (elements.currentTemp) {
        elements.currentTemp.textContent = `${Math.round(current.main.temp)}°F`;
    }

    // Update weather description (in Spanish from API)
    if (elements.weatherDesc) {
        elements.weatherDesc.textContent = capitalizeFirstLetter(current.weather[0].description);
    }

    // Update wind speed (in mph)
    if (elements.windSpeed) {
        elements.windSpeed.textContent = `${Math.round(current.wind.speed)} mph`;
    }

    // Update humidity
    if (elements.humidity) {
        elements.humidity.textContent = `${current.main.humidity}%`;
    }

    // Update weather icon
    if (elements.weatherIcon && current.weather[0].icon) {
        const iconCode = current.weather[0].icon;
        elements.weatherIcon.src = weatherIcons[iconCode] || weatherIcons['01d'];
        elements.weatherIcon.alt = current.weather[0].description;
    }
}

// ==============================
// UPDATE 3-DAY FORECAST DISPLAY
// ==============================
function updateForecast(data) {
    if (!elements.forecastContainer || !data.list) {
        console.error('Forecast container not found or no forecast data');
        return;
    }

    // Clear existing forecast cards (except the loading one)
    elements.forecastContainer.innerHTML = '';

    // Get forecast for next 3 days (every 24 hours = index 8, 16, 24)
    const forecastIndices = [8, 16, 24]; // Skip today (index 0), get next 3 days

    // Create forecast cards for next 3 days
    forecastIndices.forEach((index, dayIndex) => {
        if (index >= data.list.length) return;

        const forecast = data.list[index];
        const date = new Date(forecast.dt * 1000);

        // Create forecast card
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';

        // Day name (short format in English)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        // Weather icon for forecast
        const iconCode = forecast.weather[0].icon;
        const iconUrl = weatherIcons[iconCode] || weatherIcons['01d'];

        forecastCard.innerHTML = `
            <p class="day">${dayName}</p>
            <img src="${iconUrl}" alt="${forecast.weather[0].description}" width="48" height="48">
            <p class="temp">${Math.round(forecast.main.temp)}°F</p>
        `;

        elements.forecastContainer.appendChild(forecastCard);
    });

    console.log('Forecast updated for 3 days');
}

// ==============================
// HELPER FUNCTIONS
// ==============================
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showErrorMessage(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'weather-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #721c24;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        padding: 12px;
        margin: 15px 0;
        border-radius: 8px;
        text-align: center;
        font-size: 14px;
    `;

    // Insert after weather container
    const weatherSection = document.getElementById('weatherSection');
    if (weatherSection) {
        weatherSection.insertBefore(errorDiv, weatherSection.querySelector('.weather-source'));
    }
}

// ==============================
// INITIALIZE WEATHER APP
// ==============================
function initWeatherApp() {
    console.log('Initializing weather application...');

    // Check if API key is set
    if (!API_KEY || API_KEY.includes('{API key}') || API_KEY.length < 10) {
        showErrorMessage('Weather API key not configured. Using sample data.');
        return;
    }

    // Fetch weather data immediately
    fetchWeatherData();

    // Refresh weather data every 30 minutes
    setInterval(fetchWeatherData, 30 * 60 * 1000);

    console.log('Weather app initialized successfully');
}

// ==============================
// START THE APP WHEN DOCUMENT IS READY
// ==============================
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, starting weather app...');
    initWeatherApp();
});

// ==============================
// EXPORT FOR MODULE USAGE (optional)
// ==============================
// If using ES6 modules, uncomment:
// export { fetchWeatherData, initWeatherApp };