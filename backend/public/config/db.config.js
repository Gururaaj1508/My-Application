module.exports = {
    HOST: "mydatabase", // warpdb Replace it with your own host address
    USER: "root", // Replace with your own username
    PASSWORD: "root", // Replace with your own password
    DB: "mydatabase",
    dialect: "mysql",
    port: "3306",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
};