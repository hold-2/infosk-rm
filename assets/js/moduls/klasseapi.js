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
    const relevantPrograms = [    "AMU indmeld","Brobyg teknisk","Data/komm.udd.","Grafisk Tekniker","Grafisk teknik.","Mediegrafiker","Webudvikler",];
    
    // Filter classes based on the 'Uddannelse' field
    return classData.value.filter(classItem => relevantPrograms.includes(classItem.Education));
}

// Function to update the UI with the latest class schedules
function updateClassScheduleUI(classData) {
    const filteredClasses = filterClassesByProgram(classData);
}

// Fetch the class schedules initially and set up the periodic update
fetchAPIConfigsklasser().then((initialData) => {
    // Update the UI with the initial class schedules
    updateClassScheduleUI(initialData);
});
