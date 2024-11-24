import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    //get user's location
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          //fetch weather data
          const WEATHER_API_KEY = "8539adfe782a8a4a6404c07bc9732dfe";
          const part= "minutely,hourly,daily,alert"
          const response = await axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=${part}&appid=${WEATHER_API_KEY}&units=metric`
          );

          setWeatherData({
            temperate: response.data.current.temp,
            humidity: response.data.current.humidity,
          });
        } catch (err) {
          setError("Failed to fetch weather data");
        }
      },
      (error) => {
        setError("Failed to fetch geolocation");
      }
    );
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!weatherData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p> Temperature: {weatherData.temperature} °C </p>
      <p> Humidity: {weatherData.humidity}% </p>
    </div>
  );
};

export default WeatherComponent;
