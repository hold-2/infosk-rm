
import APIUpdater from './apiUpdater.js';
import { fetchAPIConfigsklasser, filterClassesByProgram } from './klasseapi.js';
import { fetchAPIConfigsmadplan } from './madplan.js';
import { fetchAPIConfigsbusser } from './bustiderapi.js';
import { fetchAPIConfigsvejr } from './vejrapi.js'; // Assuming you have a weather module
import { WeatherView } from "./view.js";
import { WeatherModel } from "./model.js";

// --- FUNCTIONS TO UPDATE THE UI ---

// Function to update class schedule UI
function updateClassScheduleUI(classData) {
    const filteredClasses = filterClassesByProgram(classData);
    const classListElement = document.getElementById('class-schedule');
    classListElement.innerHTML = ''; // Clear previous data

    filteredClasses.forEach(classItem => {
        const listItem = document.createElement('li');
        listItem.textContent = `${classItem.education}: ${classItem.className} at ${classItem.time}`;
        classListElement.appendChild(listItem);
    });
}

// Function to update canteen menu UI
function updateCanteenMenuUI(menuData) {
    const menuElement = document.getElementById('canteen-menu');
    menuElement.innerHTML = ''; // Clear previous data

    menuData.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.Day}: ${item.Meal}`;
        menuElement.appendChild(listItem);
    });
}

// Function to update bus times UI
function updateBusTimesUI(busData) {
    const busListElement = document.getElementById('bus-schedule');
    busListElement.innerHTML = ''; // Clear previous data

    busData.forEach(busItem => {
        const listItem = document.createElement('li');
        listItem.textContent = `Bus ${busItem.line}: ${busItem.stop} at ${busItem.time}`;
        busListElement.appendChild(listItem);
    });
}

// Function to update weather UI
function updateWeatherUI(weatherData) {
    const weatherElement = document.getElementById('weather-info');
    WeatherModel()
    WeatherView()
    weatherElement.innerHTML = `Current weather: ${weatherData.temperature}°C, ${weatherData.condition}`;
}

// --- API CONFIGURATION AND UPDATER INITIALIZATION ---

async function initializeAPIUpdater() {
    // Fetch and update weather
    const weatherConfig = await fetchAPIConfigsvejr();
    APIUpdater.start([{
        name: 'weather',
        url: 'https://api.openweathermap.org/data/2.5/weather?q=Aalborg&appid=4d58d6f0a435bf7c5a52e2030f17682d&units=metric',
        method: 'GET',
        onUpdate: (data) => updateWeatherUI(data),
        onError: (error) => console.error('Error fetching weather data:', error)
    }], 50000); // Update every 10 seconds

    // Fetch and update bus times
    const busConfig = await fetchAPIConfigsbusser();
    APIUpdater.start([{
        name: 'bustider',
        url: 'https://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=851400602&id2=851973402&rttime&format=json&useBus=1',
        method: 'GET',
        onUpdate: (data) => updateBusTimesUI(data.MultiDepartureBoard.Departure), // Assuming 'DepartureBoard' contains the relevant data
        onError: (error) => console.error('Error fetching bus times:', error)
    }], 50000); // Update every 10 seconds

    // Fetch and update class schedules
    const classConfig = await fetchAPIConfigsklasser();
    APIUpdater.start([{
        name: 'klasser',
        url: 'https://iws.itcn.dk/techcollege/schedules?departmentcode=smed',
        method: 'GET',
        onUpdate: (data) => updateClassScheduleUI(data), // Assuming the raw data contains the classes
        onError: (error) => console.error('Error fetching class schedules:', error)
    }], 50000); // Update every 10 seconds

    // Fetch and update canteen menu
    const canteenConfig = await fetchAPIConfigsmadplan();
    APIUpdater.start([{
        name: 'madplan',
        url: 'https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json',
        method: 'GET',
        onUpdate: (data) => updateCanteenMenuUI(data.Days), // Assuming 'Menu' contains the relevant data
        onError: (error) => console.error('Error fetching canteen menu:', error)
    }], 50000); // Update every 10 seconds
}

// Initialize everything
initializeAPIUpdater();
