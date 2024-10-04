import './assets/App.css';
import { useState, useEffect } from "react";
import { searchTicket } from './components/interpretSearch';
import Papa from 'papaparse';
import csvStr from'./assets/tickets.csv';
import { validarString } from './components/validarString';
import iataStr from './assets/ciudades_iata.csv';

/**
 * Función principal de la aplicación, maneja el estado y las funciones de la aplicación.
 *
 * @returns {JSX.Element} La aplicación
 */
function App() {
  const [search, setSearch] = useState("");
  const [weatherDeparture, setWeatherDeparture] = useState(null);
  const [weatherDestination, setWeatherDestination] = useState(null);
  const [isMetric, setIsMetric] = useState(true); // Unit toggle
  const [isDayTimeDeparture, setIsDayTimeDeparture] = useState(true);
  const [isDayTimeDestination, setIsDayTimeDestination] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode toggle
  const [showPreferences, setShowPreferences] = useState(false); // Preferences modal
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [tickets, setTickets] = useState({});
  const [iata, setIata] = useState({});
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

  useEffect(() => {
    Papa.parse(iataStr, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setIata(result.data);
      },
    });
  }, []);


  const handleInputChange = (e) => {
    setSearch(e.target.value.toUpperCase());
  };

  const searchPressed = () => {
    setErrorMessage(''); // Reinicia el mensaje de error

    const result = searchTicket(search, tickets, iata);
    const valida = search
    if(!validarString(valida)) {
      setErrorMessage('Input contiene caracteres inválidos, intente denuevo únicamente con letras y números');
      setWeatherDeparture(null);
      setWeatherDestination(null);
      return;
    } else if (!result) {
      setErrorMessage('No existe el ticket buscado.');
      setWeatherDeparture(null);
      setWeatherDestination(null);
      return;
    }
    else {
      searchTicket(search, tickets,iata)
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
          setErrorMessage('La ciudad no existe o esta mal escrita. Intente de nuevo.'); 
        });
    }
  };

  const calculateDayTime = (weather, setDayTime) => {
    const currentTimeUTC = weather.dt;
    const timezoneOffset = weather.timezone;
    const localTime = currentTimeUTC + timezoneOffset;

    const sunrise = weather.sys.sunrise + timezoneOffset;
    const sunset = weather.sys.sunset + timezoneOffset;
    const isDay = localTime >= sunrise && localTime < sunset;
    setDayTime(isDay);
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

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'} ${isLargeFont ? 'large-font' : ''}`}>
      <div className="circle-bg-1"></div>
      <div className="circle-bg-2"></div>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <header className="App-header">
        <h1>AICM Clima</h1>
      </header>

      <button onClick={openPreferences} 
      className="preferences-button"
      aria-label='Abrir el menú de preferencias'
      >
        Preferencias</button>
      

      <input
       
        id='city-or-ticket'  
        name='searchPlaceHolder'
        type='text'
        placeholder='Introduce ciudad o ticket'
        onChange={handleInputChange}
        aria-label='Introduce el nombre de la ciudad, el código del aeropuerto (IATA), o el número de ticket para buscar el clima'
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            searchPressed();
          }
        }}
        className={isLargeFont ? 'large-font-input' : ''}
      />

      <button onClick={searchPressed}>
        Search</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {weatherDeparture && weatherDeparture.weather && weatherDeparture.weather[0] ? (weatherDeparture && <p>  </p> ) : (weatherDeparture && <p> La ciudad o IATA no existe o esta mal escrita. Intente de nuevo. </p>)}
      <h4 className={isLargeFont ? 'large-font' : ''}>Busca el clima con el nombre de la ciudad, el código del aeropuerto (IATA) o por número de vuelo.</h4>

      <div className="weather-container"></div>
      {/* Salida*/}
      {weatherDeparture && weatherDeparture.weather && weatherDeparture.weather[0] ? (
        <div className="weather-info">
          <h3>Ciudad de salida: {weatherDeparture.name}</h3>
          <p>{weatherDeparture.weather[0].description}</p>
          <p>Temperatura: {weatherDeparture.main ? (isMetric ? weatherDeparture.main.temp : (weatherDeparture.main.temp * 9 / 5 + 32).toFixed(2)) : 'N/A'}°{isMetric ? 'C' : 'F'}</p>
          <p>Sensación térmica: {weatherDeparture.main ? (isMetric ? weatherDeparture.main.feels_like : (weatherDeparture.main.feels_like * 9 / 5 + 32).toFixed(2)) : 'N/A'}°{isMetric ? 'C' : 'F'}</p>

          {showDetailedInfo && (
            <div className="detailed-weather-info">
              <p>Humedad: {weatherDeparture.main.humidity}%</p>
              <p>Presión atmosférica: {weatherDeparture.main.pressure ? (isMetric ? `${weatherDeparture.main.pressure} hPa` : `${(weatherDeparture.main.pressure * 0.0145038).toFixed(2)} PSI`) : 'N/A'}</p>
              <p>Viento: {weatherDeparture.wind.speed ? (isMetric ? `${weatherDeparture.wind.speed} m/s` : `${(weatherDeparture.wind.speed * 2.23694).toFixed(2)} mph`) : 'N/A'}, Dirección: {weatherDeparture.wind.deg}°</p>
              <p>Nubosidad: {weatherDeparture.clouds.all}%</p>
              <p>Visibilidad: {weatherDeparture.visibility / 1000} km</p>
            </div>
          )}


          <div className={`weather-icon-container ${isDayTimeDeparture ? 'day' : 'night'}`}>
            <img
              src={`https://openweathermap.org/img/wn/${weatherDeparture.weather[0].icon}@2x.png`}
              alt="Weather Icon"
              className="weather-icon"
            />
          </div>
        </div>
      ) : (
        weatherDeparture && <p>  </p> 
      )}

      {/* Llegada */}
      {weatherDestination && weatherDestination.weather && weatherDestination.weather[0] ? (
        <div className={`weather-info ${isLargeFont ? 'large-font' : ''}`}>
          <h3>Ciudad de destino: {weatherDestination.name}</h3>
          <p>{weatherDestination.weather[0].description}</p>
          <p>Temperatura: {weatherDestination.main ? (isMetric ? weatherDestination.main.temp : (weatherDestination.main.temp * 9 / 5 + 32).toFixed(2)) : 'N/A'}°{isMetric ? 'C' : 'F'}</p>
          <p>Sensación térmica: {weatherDestination.main ? (isMetric ? weatherDestination.main.feels_like : (weatherDestination.main.feels_like * 9 / 5 + 32).toFixed(2)) : 'N/A'}°{isMetric ? 'C' : 'F'}</p>

          {showDetailedInfo && (
            <div className="detailed-weather-info">
              <p>Humedad: {weatherDestination.main.humidity}%</p>
              <p>Presión atmosférica: {weatherDestination.main.pressure ? (isMetric ? `${weatherDestination.main.pressure} hPa` : `${(weatherDestination.main.pressure * 0.0145038).toFixed(2)} PSI`) : 'N/A'}</p>
              <p>Viento: {weatherDestination.wind.speed ? (isMetric ? `${weatherDestination.wind.speed} m/s` : `${(weatherDestination.wind.speed * 2.23694).toFixed(2)} mph`) : 'N/A'}, Dirección: {weatherDestination.wind.deg}°</p>
              <p>Nubosidad: {weatherDestination.clouds.all}%</p>
              <p>Visibilidad: {weatherDestination.visibility / 1000} km</p>
            </div>
          )}

          <div className={`weather-icon-container ${isDayTimeDestination ? 'day' : 'night'}`}>
            <img
              src={`https://openweathermap.org/img/wn/${weatherDestination.weather[0].icon}@2x.png`}
              alt="Weather Icon"
              className="weather-icon"
            />
          </div>
        </div>
      ) : (
        weatherDestination && <p>  </p>

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

            <div className="preference-item">
              <span className="preference-label">Información detallada</span>
              <label className="switch">
                <input type="checkbox" checked={showDetailedInfo} onChange={() => setShowDetailedInfo(prev => !prev)} />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="preference-item">
              <span className="preference-label">Letra grande</span>
              <label className="switch">
                <input type="checkbox" checked={isLargeFont} onChange={() => setIsLargeFont(prev => !prev)} />
                <span className="slider round"></span>
              </label>
            </div>

            <button onClick={closePreferences}
            className="close-button"
            aria-label='Cerrar el menú de preferencias'
            >
              Cerrar</button>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;