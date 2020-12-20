const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Item = sequelize.define("item", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            unique: true,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })

    Item.associate = (models) => {
        Item.belongsTo(models.User);
    }

    return Item;
}
