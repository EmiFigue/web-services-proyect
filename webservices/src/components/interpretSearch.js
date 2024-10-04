
import { fetchWeather, fetchWeatherLat } from "./getApi";

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
      return false
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

function isTicket(search) {
  const isAlphaNumeric = /^[A-Za-z0-9]{6}$/.test(search);
  const hasLetter = /[A-Za-z]/.test(search);
  const hasNumber = /[0-9]/.test(search);
  
  return isAlphaNumeric && hasLetter && hasNumber && search.length === 6;
}

function isIata(search) {
  const hasLetter = /[A-Za-z]/.test(search);
  return hasLetter && search.length === 3;
}

export default isTicket;