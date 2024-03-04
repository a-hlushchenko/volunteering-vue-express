const { Model, DataTypes } = require('sequelize')
const {
  sequelize,
} = require('../database/sequelize.config')
const { TypeModel } = require('./types')
const { CityModel } = require('./cities')
const { CategoryModel } = require('./categories')
const { PostCategoryModel } = require('./postCategory')
const { PostCityModel } = require('./postCity')

class PostModel extends Model {}

PostModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    post_end: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    type_id: {
      type: DataTypes.INTEGER,
      references: {
        model: TypeModel,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'posts',
    timestamps: false,
  },
)

CityModel.belongsToMany(PostModel, {
  through: PostCityModel,
  as: 'post',
  foreignKey: 'city_id',
})

PostModel.belongsToMany(CityModel, {
  through: PostCityModel,
  as: 'city',
  foreignKey: 'post_id',
})

CategoryModel.belongsToMany(PostModel, {
  through: PostCategoryModel,
  as: 'post',
  foreignKey: 'category_id',
})

PostModel.belongsToMany(CategoryModel, {
  through: PostCategoryModel,
  as: 'category',
  foreignKey: 'post_id',
})

module.exports = { PostModel }
