const { Op } = require('sequelize')
const { PostModel } = require('../models/posts')
const { PostCityModel } = require('../models/postCity')
const {
  PostCategoryModel,
} = require('../models/postCategory')
const { CityModel } = require('../models/cities')
const { CategoryModel } = require('../models/categories')
const sequelize = require('sequelize')

class Post {
  //створення посту
  static async add({
    title,
    description,
    phone,
    phone2 = null,
    email = null,
    type,
    date,
    locations,
    categories,
  }) {
    try {
      const post = await PostModel.create({
        title,
        description,
        phone,
        phone2,
        email,
        post_end: date,
        type_id: type,
      })

      if (post) {
        const categoryResult = categories.map(
          async (categoryId) => {
            await Post.#addPostCategory({
              postId: post.id,
              categoryId,
            })
          },
        )

        const cityResult = locations.map(async (cityId) => {
          await Post.#addPostCity({
            postId: post.id,
            cityId,
          })
        })

        if (categoryResult && cityResult) {
          return true
        }
      }

      return null
    } catch (error) {
      return null
    }
  }

  //додавання списку категорій поста в бд
  static async #addPostCategory({ postId, categoryId }) {
    try {
      const post = await PostCategoryModel.create({
        post_id: postId,
        category_id: categoryId,
      })
    } catch (error) {}
  }

  //додавання списку міст поста в бд
  static async #addPostCity({ postId, cityId }) {
    try {
      const post = await PostCityModel.create({
        post_id: postId,
        city_id: cityId,
      })
    } catch (error) {}
  }

  //отримання списку постів
  static async get(locationIds, categoryIds, typeId) {
    try {
      const currentDate = new Date()
      let locationList =
        locationIds.length > 0
          ? locationIds.join(',')
          : null
      let categoryList =
        categoryIds.length > 0
          ? categoryIds.join(',')
          : null

      const posts = await PostModel.findAll({
        where: {
          post_end: {
            [Op.and]: [
              { [Op.gte]: currentDate },
              sequelize.literal(
                locationList
                  ? `EXISTS ( SELECT * FROM post_city WHERE post_city.city_id IN (${locationList}) AND post_city.post_id=posts.id)`
                  : '',
              ),
              sequelize.literal(
                categoryList
                  ? `EXISTS ( SELECT * FROM post_category WHERE post_category.category_id IN (${categoryList}) AND post_category.post_id=posts.id)`
                  : '',
              ),
            ],
          },
          type_id: typeId,
        },
        include: [
          {
            model: CityModel,
            as: 'city',
          },

          {
            model: CategoryModel,
            as: 'category',
          },
        ],
      })

      return posts
    } catch (error) {
      return error
    }
  }

  //видалення посту
  static async del(postId) {
    try {
      await PostCityModel.destroy({
        where: { post_id: postId },
      })

      await PostCategoryModel.destroy({
        where: { post_id: postId },
      })

      const result = await PostModel.destroy({
        where: { id: postId },
      })

      return result ? true : null
    } catch (error) {
      return null
    }
  }

  //отримання одного поста
  static async getById(postId) {
    try {
      const post = await PostModel.findByPk(postId, {
        include: [
          {
            model: CityModel,
            as: 'city',
          },
          {
            model: CategoryModel,
            as: 'category',
          },
        ],
      })

      return post
    } catch (error) {
      return null
    }
  }

  //редагування поста
  static async updateById({
    id,
    title,
    description,
    phone,
    phone2 = null,
    email = null,
    type,
    locations,
    categories,
  }) {
    try {
      const post = await PostModel.update(
        {
          title,
          description,
          phone,
          phone2,
          email,
          type_id: type,
        },
        {
          where: {
            id: id,
          },
        },
      )

      await PostCityModel.destroy({
        where: { post_id: id },
      })

      await PostCategoryModel.destroy({
        where: { post_id: id },
      })

      categories.map(async (categoryId) => {
        await Post.#addPostCategory({
          postId: id,
          categoryId,
        })
      })

      locations.map(async (cityId) => {
        await Post.#addPostCity({
          postId: id,
          cityId,
        })
      })

      return true
    } catch (error) {
      return null
    }
  }
}

module.exports = {
  Post,
}
