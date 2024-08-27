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
    fetch(`${api.base}weather?q=${search}&units=metric&appid=${api.key}`)
    .then((result) => result.json())
    .then((result) => {console.log(result);})
    .then ((result) => {setWeather(result);})
  };
  return (
    <div className="App">
      <header className="App-header">
      <input type='text' placeholder='Introduce ciudad'
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={searchPressed}>search</button>
      </header>
    </div>
  );
}

export default App;
