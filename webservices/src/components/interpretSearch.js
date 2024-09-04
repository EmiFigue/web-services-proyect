
import { fetchWeather, fetchWeatherLat } from "./getApi";

export function searchTicket (search, ticket){
  if (isTicket(search)){
    return fetchWeatherLat(searchInArray(search,ticket));
  }
  else{
    return fetchWeather(search);
  }
  return "";
}

function searchInArray (search,ticket){
  let lat = "";
  let lon = "";
  for (let i=0; i<ticket.lenght;i++){
    if (search.isEqual(search, ticket[i]) == true){
      lat = ticket[i-1]
      lon = ticket[i-2]
      return (lat,lon)
    }
  }
}
function containsNumber(str) {
  return !isNaN(parseFloat(str)) && isFinite(str);
}
function isTicket(search) {
  return (search.lenght == 6 && containsNumber(search) == true);
}