import dotenv from './.env';

dotenv.config();

const api = {
  key: process.env.API_KEY,
  base: 'http://api.openweathermap.org/data/2.5/'
};
  /**
 * Validar si un string es valido
 *
 * @type {boolean}
 */
const validar= require ("./validarString");
  /**
 * Método que obtiene el clima de una ciudad llamando a la API
 *
 * @param {string} search Ciudad de la que se quiere obtener el clima
 * @returns {object} json con la información del clima
 */
export const fetchWeather = (search) => {
    if(validar.validarString(search)){
      return fetch(`${api.base}weather?q=${search}&units=metric&appid=${api.key}&lang=es`)
      .then((response) => response.json());
    }

  };

  /**
 * Metodo que obtiene el clima de una ciudad llamando a la API a partir de la longitud y latitud
 *
 * @param {string} latitude
 * @param {string} longitude
 * @returns {object} json con la información del clima
 */
export const fetchWeatherLat = (latitude,longitude) => {
      return fetch(`${api.base}weather?lat=${latitude}&lon=${longitude}&appid=${api.key}&units=metric&lang=es`)
      .then((response) => response.json());
    

  };