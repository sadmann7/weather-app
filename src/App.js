import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [city, setCity] = useState('');
  const [apiKey, setApiKey] = useState('d908c492c9fc99fefb68a7a57c4faaa3');
  const [unit, setUnit] = useState('metric');
  const [iconSnippet, setIconSnippet] = useState('');
  const [weatherData, setWeatherData] = useState({});
  const searchBar = useRef('');

  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  const iconURL = `http://openweathermap.org/img/wn/${iconSnippet}@2x.png`;

  const fetchWeather = async () => {
    try {
      if (city) {
        const res = await fetch(apiURL);
        const data = await res.json();
        const { status } = res;

        res.status !== 404
          ? toast.success(
              `Weather information for ${
                city.charAt(0).toUpperCase() + city.slice(1)
              }`
            )
          : toast.error('Weather information not found');

        if (data) {
          const {
            coord: { lon, lat },
            weather,
            main: { temp, feels_like, humidity },
            wind: { speed },
            sys: { sunrise, sunset },
            name,
          } = data;
          const { main, icon } = weather[0];
          const newWeatherData = {
            lon,
            lat,
            main,
            icon,
            temp,
            feels_like,
            humidity,
            speed,
            sunrise,
            sunset,
            name,
            status,
          };
          setIconSnippet(icon);
          setWeatherData(newWeatherData);
        } else {
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const {
    lon,
    lat,
    main,
    icon,
    temp,
    feels_like,
    humidity,
    speed,
    sunrise,
    sunset,
    name,
    status,
  } = weatherData;

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchWeather();
    searchBar.current.value = '';
  };

  useEffect(() => {
    fetchWeather();
  }, [unit]);

  useEffect(() => {
    searchBar.current.focus();
  }, []);

  return (
    <div className="app">
      <div className="search">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter city"
            ref={searchBar}
            onChange={() => setCity(searchBar.current.value)}
          />
        </form>
      </div>
      <div className="container">
        <div className="top">
          {temp && (
            <div className="temp-converter">
              <button
                className={`${unit === 'metric' ? 'btn btn-active' : 'btn'}`}
                onClick={() => setUnit('metric')}
              >
                Metric
              </button>
              <button
                className={`${unit === 'imperial' ? 'btn btn-active' : 'btn'}`}
                onClick={() => setUnit('imperial')}
              >
                Imperial
              </button>
            </div>
          )}

          <div className="location">
            <p>{name}</p>
          </div>
          <div className="temp">
            {temp && (
              <h1>
                {temp.toFixed(2)} {unit === 'metric' ? '°C' : '°F'}
              </h1>
            )}
          </div>
          <div className="description">
            {iconSnippet && <img src={iconURL} alt="current weather icon" />}
            <p>{main}</p>
          </div>
        </div>
        {temp && (
          <div className="bottom">
            <div className="feels">
              <p className="bold">
                {feels_like.toFixed(2)}
                {unit === 'metric' ? '°C' : '°F'}
              </p>
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              <p className="bold">{humidity}%</p>
              <p>Humidity</p>
            </div>
            <div className="wind">
              <p className="bold">
                {speed.toFixed(2)} {unit === 'metric' ? 'm/s' : 'mph'}
              </p>
              <p>Wind Speed</p>
            </div>
          </div>
        )}
      </div>
      <ToastContainer
        theme="colored"
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
