const { Model, DataTypes } = require('sequelize')
const {
  sequelize,
} = require('../database/sequelize.config')

class CityModel extends Model {}

CityModel.init(
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
    modelName: 'cities',
    timestamps: false,
  },
)

module.exports = {
  CityModel,
}
