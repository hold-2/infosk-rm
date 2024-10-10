import APIUpdater from './apiUpdater.js';

// Function to fetch bus times
export async function fetchAPIConfigsbusser() {
    try {
        const response = await fetch('https://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=851400602&id2=851973402&rttime&format=json&useBus=1');
        if (!response.ok) {
            throw new Error(`Failed to fetch bus times: ${response.statusText}`);
        }

        const apiConfigs = await response.json();
    return apiConfigs;
    } catch (error) {
        console.error("Error fetching bus times:", error);
        return []; // Return empty array if there is an error
    }
}

// Function to filter and sort the bus times based on specific stops and time
export function filterAndSortBusTimes(busData, specificStops) {
    // Filter based on specific bus stops
     const filteredBusTimes = busData.filter(bus => specificStops.includes(bus.stop));

    // Sort by time
    const sortedBusTimes = filteredBusTimes.sort((a, b) => new Date(a.time) - new Date(b.time));

    return sortedBusTimes;
}
// Bus stops you're interested in
const specificStops = ['Øster Sundby Vej', 'Øster Uttrup Vej'];

// Function to update the UI with the latest bus times
function updateBusTimetable(busData) {
    const sortedBusTimes = filterAndSortBusTimes(busData, specificStops);

    // Clear the existing bus times from the UI
    const timetableElement = document.getElementById('bus-schedule');
    timetableElement.innerHTML = '';

    // Append new bus times to the UI
    sortedBusTimes.forEach(bus => {
        const listItem = document.createElement('li');
        listItem.textContent = `${bus.stop}: ${bus.time}`;
        timetableElement.appendChild(listItem);
    });
}

// Fetch the bus times initially and set up the periodic update
fetchAPIConfigsbusser().then((initialData) => {
    // Update the UI with the initial bus times

    console.log(initialData)
    //updateBusTimetable(initialData.MultiDepartureBoard.Departure);

    // Start periodic updates using APIUpdater
    const apiConfig = {
        name: 'busTimes',
        url: 'https://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=851400602&id2=851973402&rttime&format=json&useBus=1',
        method: 'GET',
        onUpdate: (newData) => {
            updateBusTimetable(newData.MultiDepartureBoard.Departure); // Ensure to map the new data structure properly
        },
        onError: (error) => {
            console.error('Error updating bus times:', error);
        }
    };

    APIUpdater.start([apiConfig], 5000); // Start polling every 5 seconds
});
