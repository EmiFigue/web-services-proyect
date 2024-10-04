/**
 * Valida que el input ingresado sea valido, solo acepta letras y números
 *
 * @param {string} palabra a validar
 * @returns {boolean} Regresa true si es valido, false si no
 */
export const validarString = (palabra) =>{
    try {
        //Posibles caracteres validos
        var abc = " 0123456789áéíóúAaÁáBbCcDdEeÉéFfGgHhIiÍíJjKkLlMmNnÑñOoóóPpQqRrSsTtUuÚúVvWwXxYyZz"
        var len=palabra.length
        for (var i=0;i<len;i++){
            //Si el resultado de abc.search(letra)==-1 significa que el caracter no es valido y lanza un error
            let letra=palabra.charAt(i)
            if (abc.search(letra)==-1){
                return false
            }
        }
        return true
    } catch (error) {
        return false
    }
};