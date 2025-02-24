'use strict';
module.exports = (sequelize, DataTypes) => {
  const buyAndSell = sequelize.define('buyAndSell', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    photo: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      
      allowNull: true,
      defaultValue: []
    },
    price: {
      type: DataTypes.INTEGER,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sellerPhone: {
      type: DataTypes.TEXT,
    },
    soldOut: {
      type: DataTypes.BOOLEAN,
    },
    category: {
      type: DataTypes.STRING,
    },
  }, {});
  buyAndSell.associate = function (models) {
    buyAndSell.belongsTo(models.User, {
      foreignKey: 'sellerId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    buyAndSell.belongsTo(models.Company, {
      foreignKey: 'companyId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  };
  return buyAndSell;
};