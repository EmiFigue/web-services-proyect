
import { fetchWeather, fetchWeatherLat } from "./getApi";

function searchInArray (search, ticket){
  let lat = "";
  let lon = "";
  for (let i=0; i<ticket.length;i++){
    if (search === ticket[i].ticket){
      lat = ticket[i].destination_latitude;
      lon = ticket[i].destination_longitude;
      return {lat,lon}
    }
  }
  return {lat:null,lon:null};
}

export function searchTicket (search, ticket){
  if (isTicket(search)){
    let lat = searchInArray(search, ticket).lat;
    let lon = searchInArray(search, ticket).lon;
    if (lat && lon) {
      return fetchWeatherLat(lat, lon);
    } else {
      console.error("No matching coordinates found.");
      return Promise.reject("No matching coordinates found.");
    }
  }
  else{
    return fetchWeather(search);
  }
}

function isTicket(search) {
  const isAlphaNumeric = /^[A-Za-z0-9]{6}$/.test(search);
  const hasLetter = /[A-Za-z]/.test(search);
  const hasNumber = /[0-9]/.test(search);
  
  return isAlphaNumeric && hasLetter && hasNumber && search.length==6;
}

export default isTicket;