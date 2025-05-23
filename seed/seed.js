const db = require('../models');
const bcrypt = require('bcrypt');

async function seed() {
  await db.sequelize.sync({ force: true });

  const hashedPassword = await bcrypt.hash('admin123', 10);
  await db.User.create({ username: 'admin', passwordHash: hashedPassword });


  await Promise.all(
    ['Alice', 'Bob', 'Charlie', 'Daisy', 'Evan'].map((name, i) =>
      db.Employee.create({ name, employeeId: `EMP00${i + 1}` })
    )
  );
  
  console.log('Seed complete');
  process.exit();
}

seed();
