const { Sequelize } = require('sequelize');


const database = new Sequelize({
    dialect:'sqlite',
    storage:'authdb.sqlite3'
});

database.authenticate(
    console.log(`Database connected`)
)

module.exports = database;

