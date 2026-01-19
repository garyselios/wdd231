
// scripts/weather.js - Weather API module
import { formatTemperature, getWeatherIconUrl } from './main.js';

const WEATHER_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key
const CITY = 'San Miguel';
const COUNTRY = 'SV';
const UNITS = 'imperial';

export async function getWeatherData() {
    try {
        // Fetch current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY}&units=${UNITS}&appid=${WEATHER_API_KEY}`
        );

        // Fetch forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY}&units=${UNITS}&appid=${WEATHER_API_KEY}`
        );

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Weather API error');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        return {
            current: currentData,
            forecast: forecastData
        };
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

export function displayWeather(weatherData) {
    if (!weatherData) {
        displayWeatherError();
        return;
    }

    // Update current weather
    const current = weatherData.current;
    const currentTempEl = document.getElementById('currentTemp');
    const weatherDescEl = document.getElementById('weatherDesc');
    const windSpeedEl = document.getElementById('windSpeed');
    const humidityEl = document.getElementById('humidity');
    const weatherIconEl = document.getElementById('weatherIcon');

    if (currentTempEl) currentTempEl.textContent = formatTemperature(current.main.temp);
    if (weatherDescEl) weatherDescEl.textContent = current.weather[0].description;
    if (windSpeedEl) windSpeedEl.textContent = `${Math.round(current.wind.speed)} mph`;
    if (humidityEl) humidityEl.textContent = `${current.main.humidity}%`;
    if (weatherIconEl) {
        weatherIconEl.src = getWeatherIconUrl(current.weather[0].icon);
        weatherIconEl.alt = current.weather[0].description;
    }

    // Update forecast
    updateForecast(weatherData.forecast);
}

function updateForecast(forecastData) {
    const forecastContainer = document.getElementById('forecastContainer');
    if (!forecastContainer) return;

    // Get next 3 days
    const forecasts = [];
    const today = new Date().getDate();

    for (let i = 0; i < forecastData.list.length; i++) {
        const forecast = forecastData.list[i];
        const date = new Date(forecast.dt * 1000);
        const day = date.getDate();

        if (day !== today && !forecasts.some(f => f.day === day)) {
            forecasts.push({
                day: day,
                date: date,
                temp: forecast.main.temp,
                description: forecast.weather[0].description,
                icon: forecast.weather[0].icon
            });

            if (forecasts.length === 3) break;
        }
    }

    // Display forecast
    forecastContainer.innerHTML = '';
    forecasts.forEach(forecast => {
        const dayName = forecast.date.toLocaleDateString('en-US', { weekday: 'short' });

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <p class="day">${dayName}</p>
            <img src="${getWeatherIconUrl(forecast.icon)}" 
                 alt="${forecast.description}" 
                 width="40" 
                 height="40">
            <p class="temp">${formatTemperature(forecast.temp)}</p>
        `;

        forecastContainer.appendChild(forecastCard);
    });
}

function displayWeatherError() {
    const elements = {
        'currentTemp': '--°F',
        'weatherDesc': 'Weather data unavailable',
        'windSpeed': '-- mph',
        'humidity': '--%'
    };

    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = elements[id];
    });

    const forecastContainer = document.getElementById('forecastContainer');
    if (forecastContainer) {
        forecastContainer.innerHTML = `
            <div class="forecast-card">
                <p class="day">--</p>
                <p class="temp">--°F</p>
            </div>
            <div class="forecast-card">
                <p class="day">--</p>
                <p class="temp">--°F</p>
            </div>
            <div class="forecast-card">
                <p class="day">--</p>
                <p class="temp">--°F</p>
            </div>
        `;
    }
}

// Auto-initialize if script is loaded in home page
if (document.getElementById('weatherSection')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const weatherData = await getWeatherData();
        displayWeather(weatherData);

        // Refresh every 15 minutes
        setInterval(async () => {
            const newData = await getWeatherData();
            displayWeather(newData);
        }, 900000);
    });
}