const Sequelize = require("sequelize");
const { STRING, BOOLEAN, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/acme_car_sales_db"
);

const User = conn.define("user", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  name: STRING,
});

const Car = conn.define("car", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  name: STRING,
});

const Sale = conn.define("sale", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  extendedWarranty: {
    type: BOOLEAN,
    defaultValue: false,
  },
});

Sale.belongsTo(User);
Sale.belongsTo(Car);

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const [moe, lucy, larry] = await Promise.all(
    ["moe", "lucy", "larry"].map((name) => User.create({ name }))
  );
  const [ford, toyota, audi] = await Promise.all(
    ["Ford", "Toyota", "Audi"].map((name) => Car.create({ name }))
  );
  const sales = await Promise.all([
    Sale.create({ userId: moe.id, carId: ford.id }),
    Sale.create({ userId: moe.id, carId: ford.id, extendedWarranty: true }),
  ]);
};

module.exports = {
  models: {
    User,
    Car,
    Sale,
  },
  conn,
  syncAndSeed,
};
