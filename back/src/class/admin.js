const { AdminModel } = require('../models/admins')

class Admin {
  //отримання адміна за логіном з бд
  static async getByLogin(login) {
    try {
      const admin = await AdminModel.findOne({
        where: { login },
      })

      return admin
    } catch (e) {
      return null
    }
  }
}

module.exports = {
  Admin,
}
