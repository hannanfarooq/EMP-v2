'use strict';
module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define(
    'Board',
    {

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      projectId: { // Updated to camelCase for consistency
        type: DataTypes.INTEGER,
        allowNull: false, 
      }

    },
    {
      tableName: 'Board',
      timestamps: true,
    }
  );



  Board.associate = (models) => {
    // Associate Board with Task
    Board.hasMany(models.Task, {
      foreignKey: 'boardId',
      as: 'tasks', // Alias for eager loading
    });


  
  };

  return Board;
  };

 



