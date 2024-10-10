const WeatherModel = {
    apiKey: '4d58d6f0a435bf7c5a52e2030f17682d',
    city: 'Aalborg',
    apiUrl: function() {
      return `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${this.apiKey}&units=metric`;
    },
  
    fetchWeatherData: function() {
      return fetch(this.apiUrl())
        .then(response => response.json())
        .catch(error => {
          console.error('Fejl ved hentning af vejrdata:', error);
          return null;
        });
    }
  };