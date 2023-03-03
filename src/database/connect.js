const db = require('mongoose');
db.set('strictQuery', true)
db.connect('mongodb://angeles:muysuperior04@192.168.10.141:27017/voters?ssl=false&authSource=admin')
    .then(data => console.log('Database has been connected'))
    .catch( e => console.log(e));

module.exports = db