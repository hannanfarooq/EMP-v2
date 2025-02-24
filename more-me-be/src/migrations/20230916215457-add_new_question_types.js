'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    //   await queryInterface.sequelize.query('ALTER TABLE "Questions" DROP COLUMN IF EXISTS "type"');
    //   await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_questions_type');
    //   await queryInterface.sequelize.query('DROP TYPE IF EXISTS enum_new_Question_type');

    // await queryInterface.sequelize.query(`
    //   CREATE TYPE EXISTS "enum_new_Question_type" AS ENUM (
    //     'multiple-choice',
    //     'single-choice',
    //     'input',
    //     'emoji',
    //     'yes-no'
    //   );
    // `);

    //   await queryInterface.addColumn('Questions', 'type', {
    //     type: 'enum_new_Question_type',
    //     defaultValue: 'multiple-choice',
    //     allowNull: false,
    //   });
  },
  
  down: async (queryInterface, Sequelize) => {
    // await queryInterface.changeColumn('Questions', 'type', {
    //   type: Sequelize.ENUM('multiple-choice', 'single-choice', 'input'),
    //   defaultValue: 'multiple-choice',
    //   allowNull: false,
    // });
  },
};
