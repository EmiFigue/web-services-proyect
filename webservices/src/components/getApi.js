const api = {
    key:'39942a3074e7466c372775ab00ba986d',
    base:'http://api.openweathermap.org/data/2.5/'
  };
  const validar= require ("./validarString");
  export const fetchWeather = (search) => {
    if(validar.validarString(search)){
      return fetch(`${api.base}weather?q=${search}&units=metric&appid=${api.key}&lang=es`)
      .then((response) => response.json());
    }

  };

  export const fetchWeatherLat = (latitude,longitude) => {
      return fetch(`${api.base}weather?lat=${latitude}&lon=${longitude}&appid=${api.key}&units=metric&lang=es`)
      .then((response) => response.json());
    

  };