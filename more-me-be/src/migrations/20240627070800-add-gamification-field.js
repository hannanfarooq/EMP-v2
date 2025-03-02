'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    
    queryInterface.addColumn('Users', 'gamification', {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: [],
      allowNull: true, // or false, depending on your requirements
    }),
    queryInterface.addColumn('Users', 'points', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    }),
    
   
    // add table gamifications

    queryInterface.createTable('Gamifications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      text: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      options: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('multiple-choice', 'single-choice', 'input', 'emoji', 'yes-no', 'multiple-img-choice','column-matching'),
        defaultValue: 'multiple-choice',
        allowNull: false,
      },
      correctOption: {
        type: Sequelize.ARRAY(Sequelize.STRING),  // Change this to store multiple correct options
        allowNull: false,
      },
      media: {
        type: Sequelize.STRING,
        allowNull: true,
        
      },

      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Companies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      questionCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'QuestionCategories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      image: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      columnA: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      columnB: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      columnMatching: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })    
  ]),

  async down (queryInterface, Sequelize) {
    
  }
};
