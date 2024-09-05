const api = {
    key:'39942a3074e7466c372775ab00ba986d',
    base:'http://api.openweathermap.org/data/2.5/'
  };
const validar= require ("./validarString");
  export const fetchWeather = (search) => {
    let controller= new AbortController();
    let signal = controller.signal;
    if(validar.validarString(search)){
      return fetch(`${api.base}weather?q=${search}&units=metric&appid=${api.key}&lang=es`, {signal})
      .then((response) => response.json());
    }

  };