const { Model, DataTypes } = require('sequelize')
const {
  sequelize,
} = require('../database/sequelize.config')

class TypeModel extends Model {}

TypeModel.init(
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
    modelName: 'types',
    timestamps: false,
  },
)

module.exports = { TypeModel }
