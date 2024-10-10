import { fetchAPIConfigsmadplan, formatCanteenMenu } from './madplan.js';
import APIUpdater from './apiUpdater.js';

// Function to update the UI with the latest canteen menu
function updateCanteenMenuUI(menuData) {
    const formattedMenu = formatCanteenMenu(menuData);

    // Clear the existing menu from the UI
    const menuElement = document.getElementById('canteen-menu');
    menuElement.innerHTML = '';

    // Append the new menu to the UI
    formattedMenu.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.day}: ${item.meal}`;
        menuElement.appendChild(listItem);
    });
}

// Fetch the canteen menu initially and set up the periodic update
fetchAPIConfigsmadplan().then((initialData) => {
    // Update the UI with the initial canteen menu
    updateCanteenMenuUI(initialData);

    // Start periodic updates using APIUpdater
    const apiConfig = {
        name: 'canteenMenu',
        url: 'https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json',
        method: 'GET',
        onUpdate: (newData) => {
            updateCanteenMenuUI(newData.Menu); // Ensure the correct path to the data is used
        },
        onError: (error) => {
            console.error('Error updating canteen menu:', error);
        }
    };

    APIUpdater.start([apiConfig], 5000); // Start polling every 5 seconds
});
