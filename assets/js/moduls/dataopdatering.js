// apiUpdater.js

// Dette objekt vil indeholde alle funktioner og data til opdatering af API'er
const APIUpdater = {
    apiConfigs: [],
    refreshInterval: 5000,
    isRunning: false,
    data: {},

    // En funktion til at starte opdateringerne
    start(apiConfigs, refreshInterval = 5000) {
        this.apiConfigs = apiConfigs;
        this.refreshInterval = refreshInterval;
        this.isRunning = true;

        // Start polling af hver API
        this.apiConfigs.forEach((apiConfig) => {
            this.pollAPI(apiConfig);
        });
    },

    // En funktion til at stoppe opdateringerne
    stop() {
        this.isRunning = false;
    },

    // En funktion til pulling af en API
    async pullAPI(apiConfig) {
        while (this.isRunning) {
            try {
                const response = await fetch(apiConfig.url, {
                    method: apiConfig.method || 'GET',
                    headers: apiConfig.headers || {},
                    body: apiConfig.method === 'POST' ? JSON.stringify(apiConfig.body) : null
                });

                if (!response.ok) {
                    throw new Error(`Error fetching ${apiConfig.url}: ${response.statusText}`);
                }

                const responseData = await response.json();
                this.data[apiConfig.name] = responseData;

                // Hvis der er en onUpdate callback, kald den
                if (apiConfig.onUpdate) {
                    apiConfig.onUpdate(responseData);
                }

                // Vent før næste opdatering
                await this.sleep(this.refreshInterval);
            } catch (error) {
                console.error(`Failed to update ${apiConfig.name}:`, error);

                // Hvis der er en onError callback, kald den
                if (apiConfig.onError) {
                    apiConfig.onError(error);
                }

                // Vent før vi prøver igen
                await this.sleep(this.refreshInterval);
            }
        }
    },

    // Simpel sleep funktion
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
};

export default APIUpdater;
