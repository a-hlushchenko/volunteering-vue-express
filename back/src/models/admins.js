const { Model, DataTypes } = require('sequelize')
const {
  sequelize,
} = require('../database/sequelize.config')

class AdminModel extends Model {}

AdminModel.init(
  {
    login: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'admins',
    timestamps: false,
  },
)

module.exports = { AdminModel }
