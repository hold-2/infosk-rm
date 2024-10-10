const WeatherView = {
    updateTime: function(timeString) {
      document.getElementById('time').textContent = `Klokken: ${timeString}`;
    },
  
    updateLocation: function(cityName) {
      document.getElementById('location').textContent = `Lokation: ${cityName}`;
    },
  
    updateWeather: function(temperature, description) {
      document.getElementById('weather').innerHTML = `
        Temperatur: ${temperature}°C<br>
        Beskrivelse: ${description}
      `;
    },
  
    showError: function() {
      document.getElementById('weather').textContent = 'Kunne ikke hente vejrdata.';
    }
  };

  