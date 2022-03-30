const fs = require('fs');

const FILE_NAME = "db.json"

function getPrevApartments(){
  let rawdata = fs.readFileSync(FILE_NAME);
  let apartments = JSON.parse(rawdata);
  return apartments
}

function addApartment(newApartment){
  const prevApartments = getPrevApartments()
  prevApartments.push(newApartment)
  const data = JSON.stringify(prevApartments, null, 2);
  fs.writeFileSync(FILE_NAME, data);
}

module.exports = {
  getPrevApartments,
  addApartment
}