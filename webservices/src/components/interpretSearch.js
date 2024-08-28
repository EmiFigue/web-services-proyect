export function searchOnData(database) {
    checkDatabase(database);
}

function checkDatabase(database){
    const fileInput = document.getElementById(database);
    const reader = new FileReader();

    reader.onload = function(event) {   
        const text = event.target.result;
        processData(text);
    };       
}
function processData(csvData) {
    const lines = csvData.split('\\n');
    const result = [];
  
    const headers = lines[0].split(',');
  
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const currentline = lines[i].split(',');
  
      headers.forEach((header, index) => {
        obj[header] = currentline[index];
      });
  
      result.push(obj);
    }
  
    console.log(result);
  }