const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models AFTER sequelize is available
db.User = require('./user');
db.Employee = require('./employee');
db.Collection = require('./collection');
db.Deposit = require('./deposit');

// Ensure all associations are declared AFTER models are initialized
// Use correct associations
db.Employee.hasMany(db.Collection, {
  foreignKey: 'employeeId',
  sourceKey: 'employeeId',
  as: 'collections',
});

db.Employee.hasMany(db.Deposit, {
  foreignKey: 'employeeId',
  sourceKey: 'employeeId',
  as: 'deposits',
});

db.Collection.belongsTo(db.Employee, {
  foreignKey: 'employeeId',
  targetKey: 'employeeId',
  as: 'employee',
});

db.Deposit.belongsTo(db.Employee, {
  foreignKey: 'employeeId',
  targetKey: 'employeeId',
  as: 'employee',
});

module.exports = db;
