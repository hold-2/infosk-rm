
const WeatherController = {
    init: function() {
      this.updateClock(); // Opdater klokkeslættet
      setInterval(this.updateClock, 1000); // Opdater hvert sekund
  
      this.updateWeather(); // Hent og vis vejrdata
      setInterval(this.updateWeather, 600000); // Opdater vejret hver 10. minut
    },
  
    updateClock: function() {
      const now = new Date();
      const timeString = now.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      WeatherView.updateTime(timeString);
    },
  
    updateWeather: function() {
      WeatherModel.fetchWeatherData().then(data => {
        if (data) {
          const temperature = data.main.temp;
          const description = data.weather[0].description;
          const cityName = data.name;
          
          WeatherView.updateLocation(cityName);
          WeatherView.updateWeather(temperature, description);
        } else {
          WeatherView.showError();
        }
      });
    }
  };
  
  // Initialiser controlleren, når siden er klar
  document.addEventListener('DOMContentLoaded', () => {
    WeatherController.init();
  });