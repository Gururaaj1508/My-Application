const { sequelize, Sequelize } = require(".");

module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        first_name: Sequelize.STRING,
        last_name: Sequelize.STRING,
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        username: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        resetPasswordToken: Sequelize.STRING,
        resetPasswordExpires: Sequelize.DATE,
    });
    return Users;
};