import './assets/App.css';
import { useState } from "react";

const api = {
  key:'39942a3074e7466c372775ab00ba986d',
  base:'http://api.openweathermap.org/data/2.5/'
};
function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const searchPressed = () => {
    fetch(`${api.base}weather?q=${search}&units=metric&appid=${api.key}&lang=es`)
    .then((result) => result.json())
    .then((res) => (setWeather(res)))
    .catch((error) => console.error('Error al obtener los datos del clima:', error));
    
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
