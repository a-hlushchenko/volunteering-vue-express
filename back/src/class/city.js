const { CityModel } = require('../models/cities')

class City {
  //отримання списку міст
  static async get() {
    try {
      const cities = await CityModel.findAll()
      return cities || null
    } catch (error) {
      return null
    }
  }
}

module.exports = {
  City,
}
