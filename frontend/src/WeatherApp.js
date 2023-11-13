import React, { useState, useEffect } from 'react';
import { API_URL } from './config';

const WeatherApp = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [city, setCity] = useState('')

  const fetchPlaces = () => {
    setLoading(true);
    fetch(`${API_URL}/places`)
      .then((response) => response.json())
      .then((data) => {
        const options = data.map((item) => ({
          value: item.code,
          label: item.name,
        }));
        setPlaces(options);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
  
    const selected = places.find((place) => place.label === inputValue);
    if (!selected) {
      alert("Please select a city");
      setWeather('');
      return;
    }
  
    setLoading(true);
  
    const targetHours = [2, 5, 8, 11, 14, 17, 20, 23];
    const targetDays = 3;
  
    fetch(`${API_URL}/weather/${selected.value}`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.place) {
          const city = data.place.name;
          const filteredWeather = data.forecastTimestamps.filter((item) => {
            const forecastHour = new Date(item.forecastTimeUtc).getHours();
            return targetHours.includes(forecastHour);
          });
  
          const weatherByDay = filteredWeather.reduce((acc, item) => {
            const forecastDay = new Date(item.forecastTimeUtc).toLocaleDateString();
            if (!acc[forecastDay]) {
              acc[forecastDay] = [];
            }
            acc[forecastDay].push(item);
            return acc;
          }, {});
  
          const nextThreeDays = Object.keys(weatherByDay).slice(0, targetDays);
          const finalWeather = nextThreeDays.reduce((acc, day) => acc.concat(weatherByDay[day]), []);

          setCity(city)
          setWeather(finalWeather);
          setSelectedPlace(selected);
          setLoading(false);
        } else {
          setWeather(null);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };
  

  return (
    <div className="weather-app">
      <h1>Weather App</h1>
      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          list="places"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={() => {
            const selected = places.find((place) => place.label === inputValue);
            setSelectedPlace(selected || null);
          }}
        />
        <datalist id="places">
          {places.map((place) => (
            <option key={place.value} value={place.label} />
          ))}
        </datalist>
        <button type="submit">Get Weather</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : weather && weather.length > 0 ? (
        weather.map((item, index) => (
          <div key={index} className="weather-data">
            <h2>{city}</h2>
            <p>{item.airTemperature} °C</p>
            <p>{item.windSpeed}</p>
            <p>{item.conditionCode}</p>
            <p>{item.forecastTimeUtc}</p>
          </div>
        ))
      ) : (
        <div>No weather data available</div>
      )}
    </div>
  );
};

export default WeatherApp;
