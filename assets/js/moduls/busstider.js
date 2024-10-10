import { fetchAPIConfigsbusser, filterAndSortBusTimes } from './bustiderapi.js';
import APIUpdater from './apiUpdater.js';

// Bus stops you're interested in
const specificStops = ['Øster Sundby Vej', 'Øster Uttrup Vej'];

// Function to update the UI with the latest bus times
function updateBusTimetable(busData) {
    const sortedBusTimes = filterAndSortBusTimes(busData, specificStops);

    // Clear the existing bus times from the UI
    const timetableElement = document.getElementById('bus-timetable');
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
    updateBusTimetable(initialData);

    // Start periodic updates using APIUpdater
    const apiConfig = {
        name: 'busTimes',
        url: 'https://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=851400602&id2=851973402&rttime&format=json&useBus=1',
        method: 'GET',
        onUpdate: (newData) => {
            updateBusTimetable(newData.DepartureBoard.Departure); // Ensure to map the new data structure properly
        },
        onError: (error) => {
            console.error('Error updating bus times:', error);
        }
    };

    APIUpdater.start([apiConfig], 5000); // Start polling every 5 seconds
});
