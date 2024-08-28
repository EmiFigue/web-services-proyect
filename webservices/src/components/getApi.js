const api = {
    key:'39942a3074e7466c372775ab00ba986d',
    base:'http://api.openweathermap.org/data/2.5/'
  };
  export const fetchWeather = (search) => {
    return fetch(`${api.base}weather?q=${search}&units=metric&appid=${api.key}&lang=es`)
      .then((response) => response.json());
  };