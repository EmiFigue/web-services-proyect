import './assets/App.css';
import { useState } from "react";
import { fetchWeather } from './components/getApi';

const api = {
  key:'39942a3074e7466c372775ab00ba986d',
  base:'http://api.openweathermap.org/data/2.5/'
};
function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [isDayTime, setIsDayTime] = useState(true);

  const searchPressed = () => {
    fetchWeather(search)
    .then ((res) => {
      if (res && res.sys && typeof res.timezone !== "undefined") {

      
      (setWeather(res));
  

      const currentTimeUTC = res.dt; // Hora actual en formato UNIX, UTC
          const timezoneOffset = res.timezone; // Desplazamiento en segundos desde UTC
          const localTime = currentTimeUTC + timezoneOffset; // Hora local en formato UNIX

          const sunrise = res.sys.sunrise + timezoneOffset; // Amanecer en hora local
          const sunset = res.sys.sunset + timezoneOffset; // Atardecer en hora local

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


  
  return (
    <div className="App">
      <div className="circle-bg"></div>
      <div className="circle-bg-orange"></div>
      <header className="App-header">
        
        <h2>AICM Clima</h2>  
      </header>   
      
        <input 
          type='text'  
          placeholder='Introduce ciudad'
          onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={searchPressed}>search</button>
      {typeof weather.main == "undefined" ? 
      ("") : 
      (
      <div>
        <p> Ciudad destino: {weather.name} </p>
        <p> {weather.weather[0].description} </p>
        <p> Temperatura: {weather.main.temp}°C </p>
        <p> Sensación térmica: {weather.main.feels_like}°C</p>
        <div className={`weather-icon-container ${isDayTime ? 'day' : 'night'}`}>
        <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt="Icon" 
              className="weather-icon"
        />
        
        </div>
      </div>)
      }
      
    </div>
  );
}

export default App;
