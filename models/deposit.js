// models/Deposit.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const Deposit = sequelize.define('Deposit', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: DataTypes.FLOAT,
  date: DataTypes.DATEONLY,
}, {
  tableName: 'Deposits',
});

  

module.exports = Deposit;
    