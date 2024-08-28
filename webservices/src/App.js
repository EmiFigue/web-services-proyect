import './assets/App.css';
import { useState } from "react";
import { fetchWeather } from './components/getApi';

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const searchPressed = () => {
    fetchWeather(search)
    .then ((res) => (setWeather(res)))
  };
  return (
    <div className="App">
      <header className="App-header">
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
        <p> Ciudad destino {weather.name} </p>
        <p> {weather.weather[0].description} </p>
        <p> Temperatura {weather.main.temp}°C </p>
        <p> Sensacion termica {weather.main.feels_like}°C</p>
        <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
              alt="Icon" 
        />
      </div>)
      }
      </header>   
    </div>
  );
}

export default App;
