const { DataTypes } = require('sequelize');
const database = require('../config/db');

const User = database.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  googleId: {
    type: DataTypes.STRING
  },
  googleAccessToken: {
    type: DataTypes.STRING
  },
  googleRefreshToken: {
    type: DataTypes.STRING
  }
});

module.exports = User;
