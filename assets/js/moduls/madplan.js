export async function fetchAPIConfigsmadplan() {
    try {
        const response = await fetch('https://infoskaerm.techcollege.dk/umbraco/api/content/getcanteenmenu/?type=json'); // URL til at hente API-konfigurationer
        if (!response.ok) {
            throw new Error(`Failed to fetch API configurations: ${response.statusText}`);
        }

        const apiConfigs = await response.json();
        return apiConfigs;
    } catch (error) {
        console.error("Error fetching API configurations:", error);
        return []; // Returnerer tomt array, hvis noget går galt
    }
}