const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const { Admin } = require('../class/admin')
const { Session } = require('../class/session')
const { Post } = require('../class/post')

//обробка входу адміна
router.post('/login', async (req, res) => {
  const { login, password } = req.body

  try {
    if (!login || !password) {
      return res
        .status(400)
        .json({ message: 'Заповніть всі поля!' })
    }

    const admin = await Admin.getByLogin(login)

    if (!admin) {
      return res
        .status(400)
        .json({ message: 'Дані вказано не вірно!' })
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      admin.password_hash,
    )

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: 'Дані вказано не вірно!' })
    }

    const token = await Session.create(login)

    if (!token) {
      return res
        .status(400)
        .json({ message: 'Помилка створення сесії!' })
    }

    return res.status(200).json({
      message: 'Успішний вхід!',
      session: token,
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Помилка: ${error}` })
  }
})

//перевірка наявності токену адміна
router.post('/checktoken', async (req, res) => {
  const { token } = req.body

  try {
    if (!token) {
      return res
        .status(400)
        .json({ message: 'Токен відсутній!' })
    }

    const session = Session.get(token)

    if (!session) {
      return res
        .status(400)
        .json({ message: 'Сесія відсутня!' })
    }

    return res.status(200).json({
      message: 'Сесія наявна!',
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Помилка: ${error}` })
  }
})

//додавання нового посту
router.post('/add', async (req, res) => {
  const {
    title,
    description,
    phone,
    phone2,
    email,
    type,
    date,
    locations,
    categories,
    token,
  } = req.body

  try {
    if (
      !title ||
      !description ||
      !phone ||
      !date ||
      !type ||
      locations.length === 0 ||
      categories.length === 0
    ) {
      return res
        .status(400)
        .json({ message: `Обов'язкові поля відсутні` })
    }

    const session = await Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: `Сесія відсутня!`,
        isAdmin: !!session,
      })
    }

    const result = await Post.add({
      title,
      description,
      phone,
      phone2,
      email,
      type,
      date,
      locations,
      categories,
    })

    if (!result) {
      return res.status(400).json({
        message: 'Помилка. Повідомлення не опубліковано!',
      })
    }

    return res.status(200).json({
      message: 'Опубліковано успішно!',
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Помилка: ${error}` })
  }
})

//видалення посту
router.post('/deletepost', async (req, res) => {
  const { postId, token } = req.body

  try {
    if (!token || !postId) {
      return res
        .status(400)
        .json({ message: `Обов'язкові дані відсутні` })
    }

    const session = await Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: `Сесія відсутня!`,
        isAdmin: !!session,
      })
    }

    const result = await Post.del(postId)

    if (!result) {
      return res.status(400).json({
        message: 'Помилка. Повідомлення не видалено!',
      })
    }

    return res.status(200).json({
      message: 'Видалено успішно!',
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Помилка: ${error}` })
  }
})

//отримання посту
router.post('/getpost', async (req, res) => {
  const { postId } = req.body

  try {
    if (!postId) {
      return res
        .status(400)
        .json({ message: `Обов'язкові дані відсутні!` })
    }

    const post = await Post.getById(postId)

    if (!post) {
      return res.status(400).json({
        message:
          'Помилка ортимання даних. Спробуйте оновити сторінку!',
      })
    }

    return res.status(200).json({
      message: 'Дані отримано успішно!',
      post,
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Помилка: ${error}` })
  }
})

//редагування посту
router.post('/update', async (req, res) => {
  const {
    id,
    title,
    description,
    phone,
    phone2,
    email,
    type,
    locations,
    categories,
    token,
  } = req.body

  try {
    if (
      !title ||
      !description ||
      !phone ||
      !id ||
      !type ||
      locations.length === 0 ||
      categories.length === 0
    ) {
      return res
        .status(400)
        .json({ message: `Обов'язкові поля відсутні` })
    }

    const session = await Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: `Сесія відсутня!`,
        isAdmin: !!session,
      })
    }

    const result = await Post.updateById({
      id,
      title,
      description,
      phone,
      phone2,
      email,
      type,
      locations,
      categories,
    })

    if (!result) {
      return res.status(400).json({
        message: 'Помилка. Повідомлення не оновлено!',
      })
    }

    return res.status(200).json({
      message: 'Оновлено успішно!',
      isAdmin: true,
    })
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Помилка: ${error}` })
  }
})

module.exports = router
