import './assets/App.css';
import { useEffect, useState } from "react";
import { searchTicket } from './components/interpretSearch';
import Papa from 'papaparse';
import csvStr from'./assets/tickets.csv';


function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [tickets, setTickets] = useState({}); 
  const csv = useEffect( () => (Papa.parse(csvStr, {
   download: true ,
   delimiter: "", // auto-detect 
   newline: "", // auto-detect 
   quoteChar: '"', 
   escapeChar: '"', 
   header: true, // creates array of {head:value} 
   dynamicTyping: false, // convert values to numbers if possible
   skipEmptyLines: true,
   complete: ((result) => {setTickets(result.data)})
 }))); 

  const searchPressed = () => {
    searchTicket(search, tickets)
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
