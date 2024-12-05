import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Weather.css";

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User location:", { latitude, longitude });

        try {
          const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
          const part = "minutely,hourly,daily,alert";

          // Fetch current day's weather
          const responseCurrentDay = await axios.get(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=${part}&appid=${WEATHER_API_KEY}&units=metric`
          );

          console.log("Current day response:", responseCurrentDay.data);

          // Set previous date
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() - 1);
          const previousDate = currentDate.toISOString().split("T")[0];
          console.log("Previous date:", previousDate);

          // Fetch previous day's weather
          const responsePreviousDay = await axios.get(
            `https://api.openweathermap.org/data/3.0/onecall/day_summary?lat=${latitude}&lon=${longitude}&date=${previousDate}&appid=${WEATHER_API_KEY}&units=metric`
          );

          console.log("Previous day response:", responsePreviousDay.data);

          setWeatherData({
            temperatureToday: responseCurrentDay.data.current.temp,
            humidityToday: responseCurrentDay.data.current.humidity,
            location: responseCurrentDay.data.timezone,
            temperatureYesterday:
              responsePreviousDay.data.temperature?.afternoon || "N/A",
            humidityYesterday:
              responsePreviousDay.data.humidity?.afternoon || "N/A",
          });
        } catch (err) {
          console.error("Error fetching weather data:", err);
          setError("Failed to fetch weather data");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
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
    <div className="weather-data">
      <div className="temperatures">
        <div className="heading">
        <h2>Temperature in {weatherData.location}</h2>
        <img className="more-info-icon" src="/more info icon.svg" alt="more info icon"/>
        </div>
        <div className="weather-cards-container">
          <div className="weather-card">
            <p>Today</p>
            <div className="weather-card-data">
              <img
                src="/icon-park-outline_thermometer.svg"
                alt="thermometer icon"
              />
              <p>{weatherData.temperatureToday} °C</p>
            </div>
          </div>

          <div className="weather-card">
            <p>Yesterday</p>
            <div className="weather-card-data">
              <img
                src="/icon-park-outline_thermometer.svg"
                alt="thermometer icon"
              />
              <p>{weatherData.temperatureYesterday} °C</p>
            </div>
          </div>
        </div>
      </div>
      <div className="temperatures">
        <h2>Humidity in {weatherData.location}</h2>
        <div className="weather-cards-container">
          <div className="weather-card">
            <p>Today</p>
            <div className="weather-card-data">
              <img
                src="/humidity icon.svg"
                alt="humidty icon"
              />
              <p>{weatherData.humidityToday} % </p>
            </div>
          </div>

          <div className="weather-card">
            <p>Yesterday</p>
            <div className="weather-card-data">
              <img
                src="/humidity icon.svg"
                alt="humidty icon"
              />
              <p>{weatherData.humidityYesterday} °C</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WeatherComponent;
