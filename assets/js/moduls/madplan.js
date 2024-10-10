import APIUpdater from './apiUpdater.js';

// Function to fetch the canteen menu
export async function fetchAPIConfigsmadplan() {
    try {
        const response = await fetch('https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json');
        if (!response.ok) {
            throw new Error(`Failed to fetch canteen menu: ${response.statusText}`);
        }

        const apiConfigs = await response.json();
        return apiConfigs.Menu; // Assuming 'Menu' contains the actual canteen data
    } catch (error) {
        console.error("Error fetching canteen menu:", error);
        return []; // Return empty array if there is an error
    }
}

// Function to transform and format the canteen menu for display
export function formatCanteenMenu(menuData) {
    // Map over the data to create a simple format
    return menuData.Days.map(item => {
        return {
            day: item.DayName,   // Assuming 'Day' holds the day of the week
            meal: item.Dish  // Assuming 'Meal' holds the dish of the day
        };
    });
}
