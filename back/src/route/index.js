// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()

// Підключіть файли роутів
const admin = require('./admin')
const main = require('./main')
// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
router.use('/admin', admin)
router.use('/', main)
// Використовуйте інші файли роутів, якщо є

router.get('/', (req, res) => {
  res.status(200).json('Hello World')
})

// Експортуємо глобальний роутер
module.exports = router
