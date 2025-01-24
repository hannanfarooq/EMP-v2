'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      profilePic: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resetToken: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true
      },
      resetTokenExpires: {
        type: DataTypes.DATE,
        defaultValue: null,
        allowNull: true
      },
      userRewards: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      readPolicies: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
      },
      verifyToken: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true
      },
      questionnaire: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: true
      },
      gamification: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: true
      },
      points: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      role: {
        type: DataTypes.ENUM(
          'super-super-admin',
          'admin',
          'manager',
          'lead',
          'user',
          'company-super-admin'
        ),
        defaultValue: 'user'
      },
      companyId: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      is_function_head: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      is_department_head: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      is_team_lead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      teamId: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        allowNull: true
      },
      ageRange: {
        type: DataTypes.ENUM('18-24', '25-34', '35-44', '45-54', '55-64', '65+'),
        allowNull: true
      },
      childrenDOBs: {
        type: DataTypes.ARRAY(DataTypes.DATE),
        allowNull: true
      },
      childrenNames: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true
      },
      hasChild: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true
      },
      numChildren: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true
      },
      spouseName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      spouseDOB: {
        type: DataTypes.DATE,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      departmentId:{
        type: DataTypes.INTEGER,
        allowNull: true
      },
      teamid:{
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      defaultScope: {
        attributes: { exclude: ['password', 'verifyToken'] }
      },
      scopes: {
        withSecretColumns: {
          attributes: { include: ['password', 'verifyToken'] }
        }
      }
    }
  );

  User.beforeDestroy(async (user, options) => {
    if (user.companyId) {
      const company = await sequelize.models.Company.findByPk(user.companyId);
      if (!company) {
        // If the company doesn't exist, just return
        return;
      }
      // Set isVerified to false before deleting the company
      user.isVerified = false;
      await user.save();
    }
  });
  User.associate = function (models) {
    User.belongsTo(models.Company, {
      foreignKey: 'companyId',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    User.belongsTo(models.Team, {
      foreignKey: 'teamId',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
    User.hasMany(models.Message, {
      foreignKey: 'senderId'
    });
  };

  return User;
};
