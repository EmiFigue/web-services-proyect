//Se importa el archivo interpreteSearch
const interpret= require ("./interpretSearch");
/*
Prueba que determina si un String es valido en el formato de ticket
Parametro: KXJ9980 (Formato invalido)
Resultado Esperado: false
*/
test('isTicket invalido test', () =>{
    const result=  interpret.isTicket("KXJ9980")
    expect(result).toBe(false)
})
/*
Prueba que determina si un String es valido en el formato de ticket
Parametro: KXJ998+ (Formato invalido)
Resultado Esperado: false
*/
test('isTicket invalido 2 test', () =>{
    const result=  interpret.isTicket("KXJ998+")
    expect(result).toBe(false)
})
/*
Prueba que determina si un String es valido en el formato de ticket
Parametro: KXJ998 (Formato valido)
Resultado Esperado: true
*/
test('isTicket valido test', () =>{
    const result=  interpret.isTicket("KXJ998")
    expect(result).toBe(true)
})