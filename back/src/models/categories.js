const { Model, DataTypes } = require('sequelize')
const {
  sequelize,
} = require('../database/sequelize.config')

class CategoryModel extends Model {}

CategoryModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'categories',
    timestamps: false,
  },
)

module.exports = { CategoryModel }
