// model.js
export const WeatherModel = {
    apiKey: '4d58d6f0a435bf7c5a52e2030f17682d',
  
    // Funktion til at hente vejret baseret på brugerens koordinater
    fetchWeatherDataByCoordinates: function(lat, lon) {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
      return fetch(apiUrl)
        .then(response => response.json())
        .catch(error => {
          console.error('Fejl ved hentning af vejrdata:', error);
          return null;
        });
    }
  };
  