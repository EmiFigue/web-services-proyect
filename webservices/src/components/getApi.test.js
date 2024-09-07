const getApi= require ("./getApi");
/*
Prueba que determina si al hacer la llamada a la api, lo que se recibe es un objeto
Parametro: Paris 
Resultado Esperado: un object
*/
test('getApi test', () =>{
    const result= getApi.fetchWeather('Paris')
    expect(result).toBe('object');
})
