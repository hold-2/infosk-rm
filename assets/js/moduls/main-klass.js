import { fetchAPIConfigsklasser, filterClassesByProgram } from './klasseapi.js';
import APIUpdater from './apiUpdater.js';

// Function to update the UI with the latest class schedules
function updateClassScheduleUI(classData) {
    const filteredClasses = filterClassesByProgram(classData);

    // Clear the existing class schedules from the UI
    const classListElement = document.getElementById('class-schedule');
    classListElement.innerHTML = '';

    // Append the new class schedules to the UI
    filteredClasses.forEach(classItem => {
        const listItem = document.createElement('li');
        listItem.textContent = `${classItem.education}: ${classItem.className} at ${classItem.time}`;
        classListElement.appendChild(listItem);
    });
}

// Fetch the class schedules initially and set up the periodic update
fetchAPIConfigsklasser().then((initialData) => {
    // Update the UI with the initial class schedules
    updateClassScheduleUI(initialData);

    // Start periodic updates using APIUpdater
    const apiConfig = {
        name: 'classSchedules',
        url: 'https://iws.itcn.dk/techcollege/schedules?departmentcode=smed',
        method: 'GET',
        onUpdate: (newData) => {
            updateClassScheduleUI(newData); // Update with the new class schedules
        },
        onError: (error) => {
            console.error('Error updating class schedules:', error);
        }
    };

    APIUpdater.start([apiConfig], 5000); // Start polling every 5 seconds
});
