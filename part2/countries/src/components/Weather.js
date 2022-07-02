import { useState, useEffect } from 'react';
import axios from 'axios';

const convertTempture = (k) => (k - 273.15).toFixed(2);

const Weather = ({ capital }) => {
  /** state */
  const [weather, setWeather] = useState({});

  /** load weather data by calling web api */
  useEffect(() => {
    const fetchWeather = async () => {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${process.env.REACT_APP_API_KEY}`
      );
      if (res.data.name) {
        setWeather({
          name: res.data.name,
          temperature: convertTempture(res.data.main.temp),
          description: res.data.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`,
          windSpeed: res.data.wind.speed,
        });
      }
    };
    if (capital) fetchWeather();
  }, [capital]);

  return (
    <div>
      <h3>Weather in {weather.name}</h3>
      <p>temperature {weather.temperature} Celcius</p>
      <img src={weather.icon} alt={weather.description} />
      <p>wind {weather.windSpeed} m/s</p>
    </div>
  );
};

export default Weather;
