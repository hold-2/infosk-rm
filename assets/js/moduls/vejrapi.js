export async function fetchAPIConfigsvejr() {
    try {
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Aalborg&appid=4d58d6f0a435bf7c5a52e2030f17682d&units=metric'); // URL til at hente API-konfigurationer
        if (!response.ok) {
            throw new Error(`Failed to fetch API configurations: ${response.statusText}`);
        }
        console.log('fetchAPIConfigsvejr');
        
        const apiConfigs = await response.json();
        return apiConfigs;
    } catch (error) {
        console.error("Error fetching API configurations:", error);
        return []; // Returnerer tomt array, hvis noget går galt
    }
}