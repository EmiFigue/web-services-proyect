//Se importa metodo de validarString.js
const validar= require ("./validarString");
/*
Prueba que determina si una cadena es valida (solo letras y números)
Parametro: México 
Resultado Esperado: true
*/
test('validarString test', () =>{
    const result= validar.validarString("México")
    expect(result).toBe(true);
})
