module.exports = (sequelize, DataTypes) => {
  const Maker = sequelize.define("maker", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordhash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Maker;
};
