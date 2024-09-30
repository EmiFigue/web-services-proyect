import './assets/App.css';
import { useState, useEffect } from "react";
import { searchTicket } from './components/interpretSearch';
import Papa from 'papaparse';
import csvStr from'./assets/tickets.csv';
import { validarString } from './components/validarString';

function App() {
  const [search, setSearch] = useState("");
  const [weatherDeparture, setWeatherDeparture] = useState(null);
  const [weatherDestination, setWeatherDestination] = useState(null);
  const [isMetric, setIsMetric] = useState(true); // Unit toggle
  const [isDayTime, setIsDayTime] = useState(true); // Day/night toggle
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode toggle
  const [showPreferences, setShowPreferences] = useState(false); // Preferences modal
  const [tickets, setTickets] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    Papa.parse(csvStr, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setTickets(result.data);
      },
    });
  }, []);


  const handleInputChange = (e) => {
    setSearch(e.target.value.toUpperCase());
  };

  const searchPressed = () => {
    setErrorMessage(''); // Reset error message before new search

    const result = searchTicket(search, tickets);
    const valida = search
    if(validarString(valida)==false) {
      setErrorMessage('Input contiene caracteres inválidos, intente denuevo únicamente con letras y números');
      setWeatherDeparture(null);
      setWeatherDestination(null);
    }
    else if (result == undefined) {
      setErrorMessage('No existe el ticket buscado.');
      setWeatherDeparture(null);
      setWeatherDestination(null);
    } else {
      searchTicket(search, tickets)
        .then((res) => {
          if (Array.isArray(res)) {
            const [departureWeather, destinationWeather] = res;
            setWeatherDeparture(departureWeather);
            setWeatherDestination(destinationWeather);
          } else {
            setWeatherDeparture(res);
            setWeatherDestination(null);
          }
        })
        .catch((error) => {
          console.error("Error fetching weather data: ", error);
          setErrorMessage('Error fetching weather data.'); // Handle any other errors
        });
    }
  };
  const toggleUnits = () => {
    setIsMetric(!isMetric);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const openPreferences = () => {
    setShowPreferences(true);
  };

  const closePreferences = () => {
    setShowPreferences(false);
  };

  const calculateDayTime = (weather) => {
    const currentTimeUTC = weather.dt;
    const timezoneOffset = weather.timezone;
    const localTime = currentTimeUTC + timezoneOffset;

    const sunrise = weather.sys.sunrise + timezoneOffset;
    const sunset = weather.sys.sunset + timezoneOffset;
    setIsDayTime(localTime >= sunrise && localTime < sunset);
  };

  const renderWeather = (weather, locationName) => {
    if (!weather || !weather.main || !weather.weather || !weather.weather[0]) return null;


    calculateDayTime(weather);

    return (
      <div className="weather-info">
        <h3>{locationName}: {weather.name}</h3>
        <p>{weather.weather[0].description}</p>
        <p>
          Temperatura: {isMetric ? weather.main.temp : (weather.main.temp * 9 / 5 + 32).toFixed(2)}°{isMetric ? 'C' : 'F'}
        </p>
        <p>
          Sensación térmica: {isMetric ? weather.main.feels_like : (weather.main.feels_like * 9 / 5 + 32).toFixed(2)}°{isMetric ? 'C' : 'F'}
        </p>
        <div className={`weather-icon-container ${isDayTime ? 'day' : 'night'}`}>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather Icon"
            className="weather-icon"
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="circle-bg-1"></div>
      <div className="circle-bg-2"></div>
      <header className="App-header">
        <h2>AICM Clima</h2>
      </header>

      <button onClick={openPreferences} className="preferences-button">Preferencias</button>

      <input
        type='text'
        placeholder='Introduce ciudad o ticket'
        onChange={handleInputChange} 
      />
      <button onClick={searchPressed}>Search</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Salida*/}
      {weatherDeparture && weatherDeparture.weather && weatherDeparture.weather[0] ? (
        <div>
          <h3>Ciudad de salida: {weatherDeparture.name}</h3>
          <p>{weatherDeparture.weather[0].description}</p>
          <p>Temperatura: {weatherDeparture.main ? (isMetric ? weatherDeparture.main.temp : (weatherDeparture.main.temp * 9 / 5 + 32).toFixed(2)) : 'N/A'}°{isMetric ? 'C' : 'F'}</p>
          <p>Sensación térmica: {weatherDeparture.main ? (isMetric ? weatherDeparture.main.feels_like : (weatherDeparture.main.feels_like * 9 / 5 + 32).toFixed(2)) : 'N/A'}°{isMetric ? 'C' : 'F'}</p>
          <div className={`weather-icon-container ${isDayTime ? 'day' : 'night'}`}>
            <img
              src={`https://openweathermap.org/img/wn/${weatherDeparture.weather[0].icon}@2x.png`}
              alt="Weather Icon"
              className="weather-icon"
            />
          </div>
        </div>
      ) : (
        weatherDeparture && <p>No existe ciudad buscada.</p>
      )}

      {/* Llegada */}
      {weatherDestination && weatherDestination.weather && weatherDestination.weather[0] ? (
        <div>
          <h3>Ciudad de destino: {weatherDestination.name}</h3>
          <p>{weatherDestination.weather[0].description}</p>
          <p>Temperatura: {weatherDestination.main ? (isMetric ? weatherDestination.main.temp : (weatherDestination.main.temp * 9 / 5 + 32).toFixed(2)) : 'N/A'}°{isMetric ? 'C' : 'F'}</p>
          <p>Sensación térmica: {weatherDestination.main ? (isMetric ? weatherDestination.main.feels_like : (weatherDestination.main.feels_like * 9 / 5 + 32).toFixed(2)) : 'N/A'}°{isMetric ? 'C' : 'F'}</p>
          <div className={`weather-icon-container ${isDayTime ? 'day' : 'night'}`}>
            <img
              src={`https://openweathermap.org/img/wn/${weatherDestination.weather[0].icon}@2x.png`}
              alt="Weather Icon"
              className="weather-icon"
            />
          </div>
        </div>
      ) : (
        weatherDestination && <p>No se pudo obtener el clima de destino.</p>
      )}

      {showPreferences && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Preferencias</h3>

            <div className="preference-item">
              <span className="preference-label">Claro</span>
              <label className="switch">
                <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
                <span className="slider round"></span>
              </label>
              <span className="preference-label">Oscuro</span>
            </div>

            <div className="preference-item">
              <span className="preference-label">Métrico</span>
              <label className="switch">
                <input type="checkbox" checked={!isMetric} onChange={toggleUnits} />
                <span className="slider round"></span>
              </label>
              <span className="preference-label">Imperial</span>
            </div>

            <button onClick={closePreferences} className="close-button">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
