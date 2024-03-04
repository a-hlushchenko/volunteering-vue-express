const { CategoryModel } = require('../models/categories')

class Category {
  //отримання списку категорій
  static async get() {
    try {
      const categories = await CategoryModel.findAll()
      return categories || null
    } catch (error) {
      return null
    }
  }
}

module.exports = {
  Category,
}
