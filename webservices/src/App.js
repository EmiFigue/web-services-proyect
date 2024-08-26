import './assets/App.css';
import { useState } from "react";

const api = {
  key:'39942a3074e7466c372775ab00ba986d',
  base:'https://openweathermap.org/'
};
function App() {
  const [search, setSearch] = useState("");
  const searchPressed = () => {
    fetch('${api.base}weather?q=${search}&units=metric&APPID=${api.key}')
    .then((result) => {console.log(result);});
  }
  return (
    <div className="App">
      <header className="App-header">
      <input type='text' placeholder='Introduce ciudad'
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={searchPressed}>search</button>
      <p> Mexico City</p>
      </header>
    </div>
  );
}

export default App;
