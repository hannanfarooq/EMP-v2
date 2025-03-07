

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Users',
    [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@gmail.com',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        isAdmin: true,
        isVerified:true,
        role: 'super-super-admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'User',
        lastName: 'User',
        email: 'user@gmail.com',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        isAdmin: false,
        isVerified:true,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};
