const { Model, DataTypes } = require('sequelize')
const {
  sequelize,
} = require('../database/sequelize.config')
const { PostModel } = require('./posts')
const { CityModel } = require('./cities')

class PostCityModel extends Model {}

PostCityModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: PostModel,
        key: 'id',
      },
    },
    city_id: {
      type: DataTypes.INTEGER,
      references: {
        model: CityModel,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'post_city',
    tableName: 'post_city',
    timestamps: false,
  },
)

module.exports = { PostCityModel }
