const { Model, DataTypes } = require('sequelize')
const {
  sequelize,
} = require('../database/sequelize.config')
const { AdminModel } = require('./admins')

class SessionModel extends Model {}

SessionModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admin_login: {
      type: DataTypes.STRING,
      references: {
        model: AdminModel,
        key: 'login',
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'sessions',
    timestamps: false,
  },
)

module.exports = { SessionModel }
