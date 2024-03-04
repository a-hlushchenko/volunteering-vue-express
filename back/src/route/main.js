const express = require('express')
const router = express.Router()

const { Form } = require('../class/form')
const { City } = require('../class/city')
const { Category } = require('../class/category')
const { Type } = require('../class/type')
const { Post } = require('../class/post')

//відправка форми
router.post('/form', async (req, res) => {
  const {
    name,
    email,
    phone,
    message,
    type,
    time,
    checkbox,
  } = req.body

  try {
    if (
      !name ||
      !email ||
      !phone ||
      !message ||
      !type ||
      !time
    ) {
      return res
        .status(400)
        .json({ message: 'Заповніть всі поля!' })
    }

    const isSent = await Form.send({
      name,
      email,
      phone,
      message,
      type,
      time,
      checkbox,
    })

    if (!isSent) {
      return res.status(400).json({
        message: 'Помилка. Дані не відправлено!',
      })
    }

    return res.status(200).json({
      message: 'Відправлено!',
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Помилка: ${error}` })
  }
})

//отримання списку міст
router.get('/location', async (req, res) => {
  try {
    const locationList = await City.get()

    if (!locationList) {
      return res.status(400).json({
        message: 'Помилка отримання списку локацій!',
      })
    }

    return res.status(200).json({
      message: 'Список локацій отримано успішно!',
      list: locationList,
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Помилка: ${error}` })
  }
})

//отримання списку категорій
router.get('/category', async (req, res) => {
  try {
    const categoryList = await Category.get()

    if (!categoryList) {
      return res.status(400).json({
        message: 'Помилка отримання списку категорій!',
      })
    }

    return res.status(200).json({
      message: 'Список категорій отримано успішно!',
      list: categoryList,
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Помилка: ${error}` })
  }
})

//отримання списку типів(пропозиції, прохання)
router.get('/type', async (req, res) => {
  try {
    const typeList = await Type.get()

    if (!typeList) {
      return res.status(400).json({
        message:
          'Помилка отримання списку типів повідомлень!',
      })
    }

    return res.status(200).json({
      message: 'Список типів повідомлень отримано успішно!',
      list: typeList,
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Помилка: ${error}` })
  }
})

//отримання списку всіх постів
router.post('/post', async (req, res) => {
  const { locations, categories, typeId } = req.body
  try {
    const postList = await Post.get(
      locations,
      categories,
      typeId ? typeId : [1, 2],
    )

    if (!postList) {
      return res.status(400).json({
        message: `Помилка отримання даних. Спробуйте оновити сторінку.`,
      })
    }

    return res.status(200).json({
      message: 'Список повідомлень отримано успішно!',
      postList,
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Помилка: ${error}` })
  }
})

module.exports = router
