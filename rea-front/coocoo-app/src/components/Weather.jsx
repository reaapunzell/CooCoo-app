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
          const WEATHER_API_KEY = process.env.WEATHER_API_KEY
          const part= "minutely,hourly,daily,alert"
          const response = await axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=${part}&appid=${WEATHER_API_KEY}&units=metric`
          );

          setWeatherData({
            temperature: response.data.current.temp,
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

  /* if (!weatherData) {
    return <p>Loading...</p>;
  }
*/ 
  return (
    <div className="weather-data" >
        <div className='temperatures'>
        <h2> Temperature </h2>
        <div className="weather-card" >
            <p>Today</p>
            <div className="weather-card-data" >
            <img> </img>
      <p>{weatherData.temperature}16 °C </p>
      </div>
      </div>
      </div>
      <div className='temperatures'>
        <h2> Humidity </h2>
        <div className="weather-card" >
            <p>Today</p>
            <div className="weather-card-data" >
            <img> </img>
      <p>{weatherData.humidity}30 % </p>
      </div>
      </div>
      </div>
      
    </div>
  );
};

export default WeatherComponent;
