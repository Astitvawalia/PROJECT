const  Employee = require('../../models/employee');
const Collection = require('../../models/collection');
const Deposit = require('../../models/deposit');
const moment =require('moment')


// List all employees
exports.listEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.findAll();
    res.send(200, employees);
  } catch (err) {
    res.send(500, { message: 'Server error', error: err.message });
  }
  return next();
};

exports.addCollection = async (req, res, next) => {
  const { id } = req.params;
  const { amount, date } = req.body;
  if (!amount || !date) {
    res.send(400, { message: 'Amount and date are required' });
    return next();
  }
  try {
    const formattedDate = (moment(date, moment.ISO_8601).utc()).toISOString();
    const employee = await Employee.findOne({ where: { employeeId: id } });
    if (!employee) {
      res.send(404, { message: 'Employee not found' });
      return next();
    }
    const collection = await Collection.create({
      employeeId: id,
      amount,
      date: formattedDate,
    });
    res.send(201, collection);
  } catch (err) {
    res.send(500, { message: 'Server error', error: err.message });
  }
  return next();
};


exports.addDeposit = async (req, res, next) => {
  const { id } = req.params;
  const { amount, date } = req.body;

  if (!amount || !date) {
    res.send(400, { message: 'Amount and date are required' });
    return next();
  }
  const formattedDate = (moment(date, moment.ISO_8601).utc()).toISOString();
  
  if (isNaN(amount) || Number(amount) <= 0) {
    res.send(400, { message: 'Amount must be a positive number' });
    return next();
  }

  try {
    const employee = await Employee.findOne({ where: { employeeId: id } });
    if (!employee) {
      res.send(404, { message: 'Employee not found' });
      return next();
    }
    const deposit = await Deposit.create({
      employeeId: id,
      amount,
      date: formattedDate,
    });

    res.send(201, {
      id: deposit.id,
      employeeId: deposit.employeeId,
      amount: deposit.amount,
      date: deposit.date,
    });
  } catch (err) {
    res.send(500, { message: 'Server error', error: err.message });
  }
  return next();
};

