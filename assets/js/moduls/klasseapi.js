import APIUpdater from './apiUpdater.js';

// Function to fetch class schedules
export async function fetchAPIConfigsklasser() {
    try {
        const response = await fetch('https://iws.itcn.dk/techcollege/schedules?departmentcode=smed');
        if (!response.ok) {
            throw new Error(`Failed to fetch class schedules: ${response.statusText}`);
        }

        const apiConfigs = await response.json();
        return apiConfigs; // Assuming this returns the class schedule data
    } catch (error) {
        console.error("Error fetching class schedules:", error);
        return []; // Return empty array if there is an error
    }
}

// Function to filter classes by specific education programs
export function filterClassesByProgram(classData) {
    const relevantPrograms = ["Mediegrafiker", "Webudvikler", "Grafisk Designer"];

    // Filter classes based on the 'Uddannelse' field
    return classData.value.filter(classItem => relevantPrograms.includes(classItem.Education));
}
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
