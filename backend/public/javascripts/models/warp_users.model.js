const {sequelize, Sequelize} = require(".");

module.exports = (sequelize, Sequelize) => {
    const WarpUsers = sequelize.define("warp_api_users", {
        user_id:{
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        password:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        email_id:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        admin:Sequelize.BOOLEAN,
    });
    return WarpUsers;
};