
import { fetchWeather, fetchWeatherLat } from "./getApi";

/**
 * Busca longitud y latitud en un array parseado de un csv
 *
 * @param {string} search El ticket a buscar
 * @param {array} tickets El array de tickets
 * @returns {{ latDep: string; lonDep: string; latDest: string; lonDest: string; }\}
 */
function searchInArray (search, tickets){
  let latDep = "";
  let lonDep = "";
  let latDest = "";
  let lonDest = "";

  for (let i = 0; i < tickets.length; i++) {
    if (search === tickets[i].ticket || search === tickets[i].origin || search === tickets[i].destination) {
      latDep = tickets[i].origin_latitude;
      lonDep = tickets[i].origin_longitude;
      latDest = tickets[i].destination_latitude;
      lonDest = tickets[i].destination_longitude;

      return { latDep, lonDep, latDest, lonDest };
    }
  }

  return { latDep: null, lonDep: null, latDest: null, lonDest: null };
}


/**
 * Busca la iata y regresa la ciudad correspondiente
 *
 * @param {string} search La iata a buscar
 * @param {array} iata El array de iata
 * @returns {(string | { ciudad: any; })\}
 */
function searchIata (search,iata){
  let ciudad = "";

  for (let i = 0; i<iata.length; i++){
    if (search === iata[i].iata){
      ciudad = iata[i].ciudad
      return ciudad;
    }
  }
  return {ciudad: null}
}

/**
 * Procesa la busqueda de un ticket, ciudad o iata
 *
 * @export
 * @param {string} search la busqueda
 * @param {array} tickets el array de los tickets
 * @param {array} iata el array de iata 
 * @returns {json} Objeto con la información del clima o null si no se encuentra
 */
export function searchTicket(search, tickets, iata) {
  if (isTicket(search)) {
    const { latDep, lonDep, latDest, lonDest } = searchInArray(search, tickets);

    if (latDep && lonDep && latDest && lonDest) {
      return Promise.all([
        fetchWeatherLat(latDep, lonDep),
        fetchWeatherLat(latDest, lonDest)
      ]);
    } else {
      return null;
    }
  } else if (isIata(search)){
    const ciudad = searchIata(search, iata);
    if (ciudad){
      return fetchWeather(ciudad);
    }else{
      return null;
    }
  }else {
    const { latDep, lonDep, latDest, lonDest } = searchInArray(search, tickets);
    if (latDep && lonDep) {
      return fetchWeatherLat(latDep, lonDep);
    } else {
      return fetchWeather(search);
    }
  }
}

/**
 * Revisa si la busqueda es un ticket
 *
 * @param {string} search La busqueda
 * @returns {boolean} True si es un ticket, false si no
 */
function isTicket(search) {
  const isAlphaNumeric = /^[A-Za-z0-9]{6}$/.test(search);
  const hasLetter = /[A-Za-z]/.test(search);
  const hasNumber = /[0-9]/.test(search);
  
  return isAlphaNumeric && hasLetter && hasNumber && search.length === 6;
}

/**
 * Revisa si la busqueda es una iata
 *
 * @param {string} search La busqueda
 * @returns {boolean} True si es una iata, false si no
 */
function isIata(search) {
  const hasLetter = /[A-Za-z]/.test(search);
  return hasLetter && search.length === 3;
}

export default isTicket;