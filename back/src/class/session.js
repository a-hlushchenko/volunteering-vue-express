const { SessionModel } = require('../models/sessions')

class Session {
  static generateToken = () => {
    const length = 32
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    let result = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(
        Math.random() * characters.length,
      )

      result += characters[randomIndex]
    }

    return result
  }

  static create = async (adminLogin) => {
    try {
      const token = this.generateToken()

      const res = await SessionModel.create({
        admin_login: adminLogin,
        token,
      })

      return res ? token : null
    } catch (err) {
      return null
    }
  }

  static get = async (token) => {
    try {
      const session = await SessionModel.findOne({
        where: { token },
      })

      return session ? session : null
    } catch (err) {
      return null
    }
  }
}

module.exports = {
  Session,
}
