export async function fetchAPIConfigsklasser() {
    try {
        const response = await fetch('https://iws.itcn.dk/techcollege/schedules?departmentcode=smed'); // URL til at hente API-konfigurationer
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