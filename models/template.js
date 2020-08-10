const sequelize = require("../db");

module.exports = (sequelize, DataTypes) => {
  const Temp = sequelize.define("temp", {
    subjLine: { type: DataTypes.STRING, allowNull: false },
    msgBody: { type: DataTypes.STRING, allowNull: false },
    tag1: { type: DataTypes.STRING, allowNull: false }, //at least one tag required
    tag2: { type: DataTypes.STRING, allowNull: true },
    tag3: { type: DataTypes.STRING, allowNull: true },
    owner: { type: DataTypes.INTEGER, allowNull: false },
  });
  return Temp;
};