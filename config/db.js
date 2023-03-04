const { Sequelize } = require('sequelize');


const database = new Sequelize({
    dialect:'sqlite',
    storage:'authdb.sqlite3'
});

database.sync();

module.exports = database;

