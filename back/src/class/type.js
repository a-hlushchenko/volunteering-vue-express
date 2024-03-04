const { TypeModel } = require('../models/types')

class Type {
  static async get() {
    try {
      const types = await TypeModel.findAll()
      return types || null
    } catch (error) {
      return null
    }
  }
}

module.exports = {
  Type,
}
