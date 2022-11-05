// Import important parts of sequelize library
const { Model, DataTypes } = require('sequelize');
// Import our database connection from config.js
const sequelize = require('../config/connection');

// Initialize Product Tag model (table) by extending off Sequelize's Model class
class ProductTag extends Model {}

// Set up fields and rules for Product Tag model
ProductTag.init(
  {},
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
