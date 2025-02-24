'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const buyAndSells = await queryInterface.sequelize.query(
      'SELECT * FROM "buyAndSells";'
    );

    for (const buyAndSell of buyAndSells[0]) {
      const updatedPhotos = [buyAndSell.photo];
      await queryInterface.sequelize.query(
        `UPDATE "buyAndSells" SET "newPhoto" = ARRAY[:updatedPhotos]::VARCHAR[] WHERE id = :id;`,
        {
          replacements: { id: buyAndSell.id, updatedPhotos },
        }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Implement the reverse migration if needed
  },
};
