require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        dialect: "mysql",
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }
);

const models = {
    sequelize,
    User: require('./User')(sequelize),
    Item: require('./Item')(sequelize)
}

Object.keys(models).forEach((modelName) => {
    if("associate" in models[modelName]){
        models[modelName].associate(models);
    }
});

module.exports = models;
