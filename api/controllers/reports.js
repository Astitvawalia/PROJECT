const  Employee  = require('../../models/employee');
const  Deposit  = require('../../models/deposit');
const  Collection  = require('../../models/collection');
const moment = require('moment');

exports.getOutstandingReport = async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      include: [
        { model: Collection, as: 'collections' },
        { model: Deposit, as: 'deposits' }
      ]
    });

    const report = employees.map(emp => {
      const totalCollected = emp.collections.reduce((sum, c) => sum + c.amount, 0);
      const totalDeposited = emp.deposits.reduce((sum, d) => sum + d.amount, 0);

      const allDates = [...emp.collections, ...emp.deposits]
        .map(txn => moment(txn.date))
        .sort((a, b) => b.diff(a)); // descending

      return {
        id: emp.id,
        name: emp.name,
        netCollection: totalCollected,
        totalDeposited,
        difference: totalCollected - totalDeposited,
        mostRecentTransactionDate: allDates.length > 0 ? allDates[0].format('YYYY-MM-DD') : null
      };
    });

    res.send(200, report);
  } catch (err) {
    console.error(err);
    res.send(500, { message: 'Server error', error: err.message });
  }
  return next();
};

exports.getPaymentReport = async (req, res, next) => {
  try {
    const employees = await Employee.findAll({
      include: [
        { model: Collection, as: 'collections', order: [['date', 'ASC']] },
        { model: Deposit, as: 'deposits', order: [['date', 'ASC']] }
      ]
    });

    const result = [];

    for (const emp of employees) {
      const pending = []; // track balance across dates

      const collections = emp.collections.sort((a, b) => new Date(a.date) - new Date(b.date));
      const deposits = emp.deposits.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Build outstanding queue (FIFO)
      collections.forEach(c => {
        pending.push({ date: c.date, amount: c.amount });
      });

      deposits.forEach(d => {
        let remaining = d.amount;
        while (remaining > 0 && pending.length > 0) {
          let top = pending[0];
          const deduct = Math.min(remaining, top.amount);

          result.push({
            employeeId: emp.employeeId,
            employeeName: emp.name,
            collectionAmount: top.amount,
            collectionDate: top.date,
            depositAmount: deduct,
            depositDate: d.date,
            difference: top.amount - deduct,
            outstandingAfterAllocation: top.amount - deduct
          });

          top.amount -= deduct;
          remaining -= deduct;

          if (top.amount <= 0) {
            pending.shift();
          }
        }
      });

      // Remaining unpaid
      for (const rem of pending) {
        result.push({
          employeeId: emp.employeeId,
          employeeName: emp.name,
          collectionAmount: rem.amount,
          collectionDate: rem.date,
          depositAmount: 0,
          depositDate: null,
          difference: rem.amount,
          outstandingAfterAllocation: rem.amount
        });
      }
    }

    res.send(200, result);
  } catch (err) {
    console.error(err);
    res.send(500, { message: 'Server error', error: err.message });
  }

  return next();
};
