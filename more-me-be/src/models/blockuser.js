'use strict';

module.exports = (sequelize, DataTypes) => {
    const BlockedUser = sequelize.define('BlockedUser', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        blockerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        blockedId: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,
        },
    }, {
        timestamps: true // Enable timestamps
    });
    return BlockedUser;
};
