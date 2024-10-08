export async function fetchAPIConfigs() {
    try {
        const response = await fetch('https://xmlopen.rejseplanen.dk/bin/rest.exe/multiDepartureBoard?id1=851400602&id2=851973402&rttime&format=json&useBus=1'); // URL til at hente API-konfigurationer
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