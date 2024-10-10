
// controller.js
import { WeatherModel } from './model.js';
import { WeatherView } from './view.js';

const WeatherController = {
  init: function() {
    this.updateClock(); // Opdater klokkeslættet
    setInterval(this.updateClock, 1000); // Opdater hvert sekund

    this.getUserLocationAndUpdateWeather(); // Hent lokation og vis vejrdata
    setInterval(this.getUserLocationAndUpdateWeather.bind(this), 600000); // Opdater vejret hver 10. minut
  },

  updateClock: function() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    WeatherView.updateTime(timeString);
  },

  getUserLocationAndUpdateWeather: function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          this.updateWeather(lat, lon);
        },
        error => {
          console.error('Fejl ved hentning af brugerens lokation:', error);
          WeatherView.showError();
        }
      );
    } else {
      console.error('Geolocation understøttes ikke af denne browser.');
      WeatherView.showError();
    }
  },

  updateWeather: function(lat, lon) {
    WeatherModel.fetchWeatherDataByCoordinates(lat, lon).then(data => {
      if (data) {
        const temperature = data.main.temp;
        const description = data.weather[0].description;
        const icon = data.weather[0].icon; // Ikonkode fra API'et
        const cityName = data.name;

        WeatherView.updateWeatherDescriptionAndIcon(description, icon);
        WeatherView.updateLocation(cityName);
        WeatherView.updateWeather(temperature);
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
