//підключення до бази даних

const Sequelize = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '',
  database: '',
  username: '',
  password: '',
})

module.exports = {
  sequelize,
}
