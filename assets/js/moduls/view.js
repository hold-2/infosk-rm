// view.js
export const WeatherView = {
    updateTime: function(timeString) {
      document.getElementById('time').textContent = `Klokken: ${timeString}`;
    },
  
    updateWeatherDescriptionAndIcon: function(description, icon) {
      const weatherIconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      document.getElementById('description').innerHTML = `
        <img src="${weatherIconUrl}" alt="Vejr ikon" /><br>
        Beskrivelse: ${description}
      `;
    },
  
    updateLocation: function(cityName) {
      document.getElementById('location').textContent = `Lokation: ${cityName}`;
    },
  
    updateWeather: function(temperature) {
      document.getElementById('weather').innerHTML = `
        Temperatur: ${temperature}°C
      `;
    },
  
    showError: function() {
      document.getElementById('weather').textContent = 'Kunne ikke hente vejrdata.';
    }
  };
  

