// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 

const User = sequelize.define('User', {
  username: DataTypes.STRING,
  passwordHash: DataTypes.STRING,
  
});

module.exports = User;
