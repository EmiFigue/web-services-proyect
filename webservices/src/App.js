import './assets/App.css';

const weather_api = {
  key:'39942a3074e7466c372775ab00ba986d',
  base:'http://api.openweathermap.org/data/2.5/'
};
function App() {
  return (
    <div className="App">
      <header className="App-header">
      <input type='text' placeholder='Introduce ciudad'/>
      
      </header>
    </div>
  );
}

export default App;
