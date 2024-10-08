import APIUpdater from './apiUpdater.js';
import { fetchAPIConfigsklasser, filterClassesByProgram } from './klasseapi.js';
import { fetchAPIConfigsmadplan } from './madplan.js';
import { fetchAPIConfigsbusser } from './bustiderapi.js';
import { fetchAPIConfigsvejr } from './vejrapi.js'; // Weather API

// --- FUNCTIONS TO UPDATE THE UI ---
// Function to filter valid activities by using our config file
const filterValidActivities = (arr) => {
let filteredData = arr.filter((item) =>
  activityConfig.validEducations.includes(item.Education)
);
return filteredData;
};

// Function to filter out the current activities from StartDate
const filterCurrentActivities = (arr) => {
let currentActivities = arr.filter(
  (item) => new Date(item.StartDate) >= new Date() - 3600000
);
return currentActivities;
};

// Function to sort all activities by date / time
const sortActivities = (arr) => {
let sortedData = arr.sort(
  (a, b) => new Date(a.StartDate) - new Date(b.StartDate)
);
return sortedData;
};

// Function to update class schedule UI
function updateClassScheduleUI(classData) {
    const filteredClasses = filterClassesByProgram(classData);
    const Activities = filterCurrentActivities(filteredClasses)
    const sorted = sortActivities(Activities)
    const classListElement = document.getElementById('class-schedule');
    classListElement.innerHTML = ''; // Clear previous data

    sorted.forEach((classItem,index) => {
        if (index < 11) {
            
            const listItem = document.createElement('li');
            listItem.textContent = `${classItem.Room || 'unnamed room'}:${classItem.Team || 'Unnamed Class'}:${classItem.Education || 'Unknown Program'}:${new Date(classItem.StartDate).toLocaleTimeString("da-DK").slice(0,5) || 'No Time Available'}`;
            classListElement.appendChild(listItem);
        }
    });

}
// Function to update canteen menu UI
function updateCanteenMenuUI(menuData) {
    const menuElement = document.getElementById('canteen-menu');
    menuElement.innerHTML = ''; // Clear previous data

    menuData.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.DayName || 'Unknown Day'}: ${item.Dish || 'No Dish Available'}`;
        menuElement.appendChild(listItem);
    });
    
}

// Function to update bus times UI
function updateBusTimesUI(busData) {
    const busListElement = document.getElementById('bus-schedule');
    busListElement.innerHTML = ''; // Clear previous data
    

    busData.forEach((busItem,index) => {
        if (index < 4) {
            
            const listItem = document.createElement('li');
            listItem.textContent = `Bus ${busItem.line}: ${busItem.stop} at ${busItem.time}`;
            busListElement.appendChild(listItem);
        }
    });
}

// Function to update weather UI
function updateWeatherUI(weatherData) {
    const weatherElement = document.getElementById('weather-info');
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const temperature = weatherData.main?.temp || 'N/A';
    const description = weatherData.weather?.[0]?.description || 'N/A';
    const iconCode = weatherData.weather?.[0]?.icon || '';
    const location = weatherData.name || 'Aalborg';  // Default location is Aalborg

    // Set the weather icon using OpenWeatherMap icon code
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Update the weather information in the UI
    weatherElement.innerHTML = `
        <div>
            <h2>${location}</h2>
            <p>${currentTime}</p>
            <img src="${iconUrl}" alt="${description}" />
            <p>${temperature}°C, ${description}</p>
        </div>
    `;
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
    }], 10000); // Update every 10 seconds

    // Fetch and update bus times
    const busConfig = await fetchAPIConfigsbusser();
    APIUpdater.start([{
        name: 'bustider',
        url: 'https://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=851400602&id2=851973402&rttime&format=json&useBus=1',
        method: 'GET',
        onUpdate: (data) => updateBusTimesUI(data.MultiDepartureBoard.Departure),
        onError: (error) => console.error('Error fetching bus times:', error)
    }], 10000); // Update every 10 seconds

    // Fetch and update class schedules
    const classConfig = await fetchAPIConfigsklasser();
    APIUpdater.start([{
        name: 'klasser',
        url: 'https://iws.itcn.dk/techcollege/schedules?departmentcode=smed',
        method: 'GET',
        onUpdate: (data) => updateClassScheduleUI(data),
        onError: (error) => console.error('Error fetching class schedules:', error)
    }], 10000); // Update every 10 seconds

    // Fetch and update canteen menu
    const canteenConfig = await fetchAPIConfigsmadplan();
    APIUpdater.start([{
        name: 'madplan',
        url: 'https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json',
        method: 'GET',
        onUpdate: (data) => updateCanteenMenuUI(data.Days),
        onError: (error) => console.error('Error fetching canteen menu:', error)
    }], 10000); // Update every 10 seconds
}

// Initialize everything
initializeAPIUpdater();
