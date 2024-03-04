const nodemailer = require('nodemailer')

class Form {
  //надсилання форми
  static async send({
    name,
    email,
    phone,
    message,
    type,
    time,
    checkbox,
  }) {
    const firstEmail = ''
    const secondEmail = ''
    const toEmail = checkbox ? firstEmail : secondEmail

    let mailTransporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: '',
        pass: '',
      },
    })

    let mailDetails = {
      from: '',
      to: toEmail,
      subject: `${type}. ${name}`,
      html: `<p>${message}<br /><br />${time}<br /><br />Контакти:${phone}<br />${email}</p>`,
    }

    try {
      const result = await mailTransporter.sendMail(
        mailDetails,
      )
      return !!result.accepted.length
    } catch (error) {
      return false
    }
  }
}

module.exports = {
  Form,
}
