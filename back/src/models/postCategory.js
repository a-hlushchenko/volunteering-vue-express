const { Model, DataTypes } = require('sequelize')
const {
  sequelize,
} = require('../database/sequelize.config')
const { PostModel } = require('./posts')
const { CategoryModel } = require('./categories')

class PostCategoryModel extends Model {}

PostCategoryModel.init(
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
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: CategoryModel,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'post_category',
    tableName: 'post_category',
    timestamps: false,
  },
)

module.exports = { PostCategoryModel }
