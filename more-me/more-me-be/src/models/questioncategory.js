module.exports = (sequelize, DataTypes) => {
  const QuestionCategory = sequelize.define(
    "QuestionCategory",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
  );
  QuestionCategory.associate = (models) => {
    QuestionCategory.belongsTo(models.Company, {
      foreignKey: 'companyId',
      as: 'company',
    });
  };
  return QuestionCategory;
};
