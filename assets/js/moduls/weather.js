// weather.js
import APIUpdater from './apiUpdater.js';

// Fetch weather data from OpenWeatherMap API
export async function fetchAPIConfigsvejr() {
    try {
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Aalborg&appid=4d58d6f0a435bf7c5a52e2030f17682d&units=metric');
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.statusText}`);
        }

        const apiConfigs = await response.json();
        return apiConfigs;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return {}; // Return empty object if there's an error
    }
}

// Function to update the weather section in the UI
export function updateWeatherUI(weatherData) {
    // Get the weather elements
    const weatherElement = document.getElementById('weather-info');
    
    // Get current time
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Extract the relevant weather details
    const temperature = weatherData.main?.temp || 'N/A';
    const description = weatherData.weather?.[0]?.description || 'N/A';
    const iconCode = weatherData.weather?.[0]?.icon || '';
    const location = weatherData.name || 'N/A';
    
    // Set the weather icon using the icon code from OpenWeatherMap
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Update the weather information in the UI
    weatherElement.innerHTML = `
        <div>
            <h2>${location}</h2>
            <p>${currentTime}</p>
            <img src="${iconUrl}" alt="${description}">
            <p>${temperature}°C, ${description}</p>
        </div>
    `;
}
