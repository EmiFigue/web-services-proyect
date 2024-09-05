import './assets/App.css';
import { useState } from "react";
import { fetchWeather } from './components/getApi';

const api = {
  key: '39942a3074e7466c372775ab00ba986d',
  base: 'http://api.openweathermap.org/data/2.5/'
};


function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [isDayTime, setIsDayTime] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMetric, setIsMetric] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);

  const searchPressed = () => {
    fetchWeather(search)
      .then((res) => {
        if (res && res.sys && typeof res.timezone !== "undefined") {


          (setWeather(res));


          const currentTimeUTC = res.dt;
          const timezoneOffset = res.timezone;
          const localTime = currentTimeUTC + timezoneOffset;

          const sunrise = res.sys.sunrise + timezoneOffset;
          const sunset = res.sys.sunset + timezoneOffset;

          // Determina si es de día o de noche
          const isDay = localTime >= sunrise && localTime < sunset;
          console.log("Es de día?", isDay);
          setIsDayTime(isDay);
        } else {
          console.error("Datos insuficientes para determinar si es de día o de noche", res);
        }
      })
      .catch((error) => {
        console.error("Error fetching weather data: ", error);
      });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const toggleUnits = () => {
    setIsMetric(prevUnits => !prevUnits);
  };

  const openPreferences = () => {
    setShowPreferences(true);
  };

  const closePreferences = () => {
    setShowPreferences(false);
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
        placeholder='Introduce ciudad'
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={searchPressed}>search</button>
      {typeof weather.main == "undefined" ?
        ("") :
        (


          <div class="row">
            <div class="column">
              <p> Ciudad llegada: {weather.name} </p>
              <p> {weather.weather[0].description} </p>
              <p> Temperatura: {isMetric ? weather.main.feels_like : (weather.main.feels_like * 9 / 5 + 32).toFixed(2)}°{isMetric ? 'C' : 'F'}</p>
              <p> Sensación térmica: {isMetric ? weather.main.feels_like : (weather.main.feels_like * 9 / 5 + 32).toFixed(2)}°{isMetric ? 'C' : 'F'}</p>
              <div className={`weather-icon-container ${isDayTime ? 'day' : 'night'}`}>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="Icon"
                  className="weather-icon"
                />
              </div>
            </div>
            <div class="column">
              <p> Ciudad destino: {weather.name} </p>
              <p> {weather.weather[0].description} </p>
              <p> Temperatura: {isMetric ? weather.main.feels_like : (weather.main.feels_like * 9 / 5 + 32).toFixed(2)}°{isMetric ? 'C' : 'F'}</p>
              <p> Sensación térmica: {isMetric ? weather.main.feels_like : (weather.main.feels_like * 9 / 5 + 32).toFixed(2)}°{isMetric ? 'C' : 'F'}</p>
              <div className={`weather-icon-container ${isDayTime ? 'day' : 'night'}`}>
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="Icon"
                  className="weather-icon"
                />
              </div>
            </div>
          </div>


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
