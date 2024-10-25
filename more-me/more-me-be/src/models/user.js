  // // module.exports = (sequelize, DataTypes) => {
  // //   const User = sequelize.define(
  // //     "User",
  // //     {
  // //       firstName: {
  // //         type: DataTypes.STRING,
  // //       },
  // //       lastName: {
  // //         type: DataTypes.STRING,
  // //       },
  // //       email: {
  // //         type: DataTypes.STRING,
  // //         allowNull: false,
  // //         unique: true,
  // //       },
  // //       password: {
  // //         type: DataTypes.STRING,
  // //       },
  // //       profilePic: {
  // //         type: DataTypes.STRING,
  // //       },
  // //       resetToken: {
  // //         type: DataTypes.STRING,
  // //         defaultValue: null,
  // //       },
  // //       resetTokenExpires: {
  // //         type: DataTypes.DATE,
  // //         defaultValue: null,
  // //       },
  // //       userRewards: {
  // //         type: DataTypes.INTEGER, // Integer type
  // //         allowNull: true,
  // //       },
  // //       readPolicies: {
  // //         type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of integers
  // //         allowNull: true,
  // //       },
  // //       verifyToken: {
  // //         type: DataTypes.STRING,
  // //         defaultValue: null,
  // //       },
  // //       questionnaire: {
  // //         type: DataTypes.JSON,
  // //         defaultValue: {},
  // //         allowNull: true,
  // //       },
  // //       gamification: {
  // //         type: DataTypes.JSON,
  // //         defaultValue: {},
  // //         allowNull: true,
  // //       },
  // //       points: {
  // //         type: DataTypes.INTEGER,
  // //         defaultValue: 0,
  // //         allowNull: true,
  // //       },
  // //       isVerified: {
  // //         type: DataTypes.BOOLEAN,
  // //         defaultValue: false,
  // //       },
  // //       role: {
  // //         type: DataTypes.ENUM("admin", "super-admin", "user"),
  // //         defaultValue: "user",
  // //       },
  // //       companyId: {
  // //         type: DataTypes.INTEGER,
  // //         defaultValue: null,
  // //       },
  // //       is_function_head: {
  // //         type: DataTypes.BOOLEAN,
  // //         defaultValue: false,
  // //       },
  // //       is_department_head: {
  // //         type: DataTypes.BOOLEAN,
  // //         defaultValue: false,
  // //       },
  // //       is_team_lead: {
  // //         type: DataTypes.BOOLEAN,
  // //         defaultValue: false,
  // //       },
  // //       teamId: {
  // //         type: DataTypes.INTEGER,
  // //         defaultValue: null,
  // //       },
  // //       // This is not present in any migration file, so commenting for now
  // //       // departmentId: {
  // //       //   type: DataTypes.INTEGER,
  // //       //   allowNull: true,
  // //       // },
  // //     },
  // //     {
  // //       defaultScope: {
  // //         attributes: { exclude: ["password", "verifyToken"] },
  // //       },
  // //       scopes: {
  // //         withSecretColumns: {
  // //           attributes: { include: ["password", "verifyToken"] },
  // //         },
  // //       },
  // //     }
  // //   );
  // //   User.associate = function (models) {
  // //     User.belongsTo(models.Company, {
  // //       foreignKey: "companyId",
  // //       onDelete: "SET NULL",
  // //       onUpdate: "CASCADE",
  // //     });
  // //     User.belongsTo(models.Team, {
  // //       foreignKey: "teamId",
  // //       onDelete: "SET NULL",
  // //       onUpdate: "CASCADE",
  // //     });
  // //     // User.belongsTo(models.Department, { 
  // //     //   foreignKey: "departmentId" ,
  // //     //   onDelete: "SET NULL",
  // //     //   onUpdate: "CASCADE",
  // //     // });
  // //     User.hasMany(models.Message, {
  // //       foreignKey: "senderId",
  // //     });
  // //   };
  // //   return User;
  // // };


  // module.exports = (sequelize, DataTypes) => {
  //   const User = sequelize.define(
  //     "User",
  //     {
  //       firstName: {
  //         type: DataTypes.STRING,
  //       },
  //       lastName: {
  //         type: DataTypes.STRING,
  //       },
  //       email: {
  //         type: DataTypes.STRING,
  //         allowNull: false,
  //         unique: true,
  //       },
  //       password: {
  //         type: DataTypes.STRING,
  //       },
  //       profilePic: {
  //         type: DataTypes.STRING,
  //       },
  //       resetToken: {
  //         type: DataTypes.STRING,
  //         defaultValue: null,
  //       },
  //       resetTokenExpires: {
  //         type: DataTypes.DATE,
  //         defaultValue: null,
  //       },
  //       userRewards: {
  //         type: DataTypes.INTEGER, // Integer type
  //         allowNull: true,
  //       },
  //       readPolicies: {
  //         type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of integers
  //         allowNull: true,
  //       },
  //       verifyToken: {
  //         type: DataTypes.STRING,
  //         defaultValue: null,
  //       },
  //       questionnaire: {
  //         type: DataTypes.JSON,
  //         defaultValue: {},
  //         allowNull: true,
  //       },
  //       gamification: {
  //         type: DataTypes.JSON,
  //         defaultValue: {},
  //         allowNull: true,
  //       },
  //       points: {
  //         type: DataTypes.INTEGER,
  //         defaultValue: 0,
  //         allowNull: true,
  //       },
  //       isVerified: {
  //         type: DataTypes.BOOLEAN,
  //         defaultValue: false,
  //       },
  //       role: {
  //         type: DataTypes.ENUM("admin", "super-admin", "user"),
  //         defaultValue: "user",
  //       },
  //       companyId: {
  //         type: DataTypes.INTEGER,
  //         defaultValue: null,
  //       },
  //       is_function_head: {
  //         type: DataTypes.BOOLEAN,
  //         defaultValue: false,
  //       },
  //       is_department_head: {
  //         type: DataTypes.BOOLEAN,
  //         defaultValue: false,
  //       },
  //       is_team_lead: {
  //         type: DataTypes.BOOLEAN,
  //         defaultValue: false,
  //       },
  //       teamId: {
  //         type: DataTypes.INTEGER,
  //         defaultValue: null,
  //       },
  //       // This is not present in any migration file, so commenting for now
  //       // departmentId: {
  //       //   type: DataTypes.INTEGER,
  //       //   allowNull: true,
  //       // },
  //       ageRange: {
  //         type: DataTypes.ENUM("18-24", "25-34", "35-44", "45-54", "55-64", "65+"),
  //         allowNull: true,
  //       },
  //       childrenDOBs: {
  //         type: DataTypes.ARRAY(DataTypes.DATE),
  //         allowNull: true,
  //       },
  //       childrenNames: {
  //         type: DataTypes.ARRAY(DataTypes.STRING),
  //         allowNull: true,
  //       },
  //       dateOfBirth: {
  //         type: DataTypes.DATE,
  //         allowNull: true,
  //       },
  //       gender: {
  //         type: DataTypes.STRING,
  //         allowNull: true,
  //       },
  //       hasChildren: {
  //         type: DataTypes.STRING, // Storing as string ("yes" or "no")
  //         allowNull: true,
  //       },
  //       numChildren: {
  //         type: DataTypes.INTEGER,
  //         allowNull: true,
  //       },
  //       spouseName: {
  //         type: DataTypes.STRING,
  //         allowNull: true,
  //       },
  //       spouseDOB: {
  //         type: DataTypes.DATE,
  //         allowNull: true,
  //       },
  //       address: {
  //         type: DataTypes.STRING,
  //         allowNull: true,
  //       },
  //       city: {
  //         type: DataTypes.STRING,
  //         allowNull: true,
  //       },
  //       country: {
  //         type: DataTypes.STRING,
  //         allowNull: true,
  //       },
  //       phoneNumber: {
  //         type: DataTypes.STRING,
  //         allowNull: true,
  //       },
  //     },
  //     {
  //       defaultScope: {
  //         attributes: { exclude: ["password", "verifyToken"] },
  //       },
  //       scopes: {
  //         withSecretColumns: {
  //           attributes: { include: ["password", "verifyToken"] },
  //         },
  //       },
  //     }
  //   );
  
  //   User.associate = function (models) {
  //     User.belongsTo(models.Company, {
  //       foreignKey: "companyId",
  //       onDelete: "SET NULL",
  //       onUpdate: "CASCADE",
  //     });
  //     User.belongsTo(models.Team, {
  //       foreignKey: "teamId",
  //       onDelete: "SET NULL",
  //       onUpdate: "CASCADE",
  //     });
  //     // User.belongsTo(models.Department, { 
  //     //   foreignKey: "departmentId" ,
  //     //   onDelete: "SET NULL",
  //     //   onUpdate: "CASCADE",
  //     // });
  //     User.hasMany(models.Message, {
  //       foreignKey: "senderId",
  //     });
  //   };
  
  //   return User;
  // };
  
  // models/user.js

// models/user.js

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
        type: DataTypes.ENUM('admin', 'super-admin', 'user'),
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
