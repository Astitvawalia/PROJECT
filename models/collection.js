const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Collection = sequelize.define('Collection', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Collections'
});

module.exports = Collection;
