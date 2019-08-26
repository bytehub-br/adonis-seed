'user strict'
const moment = require('moment')
const User = use('App/Models/User')
const crypto = require('crypto')
const APIException = use('App/Exceptions/APIException')
const Kue = use('Kue')
const JobMail = use('App/Jobs/Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')

      const user = await User.findBy('email', email)

      if (!user) throw new APIException('Email não encontrado', 'EMAIL_NOT_FOUND', 404)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      const emailConfig = {
        template: 'emails.forgot_password',
        data: {
          email,
          token: user.token,
          link: `${request.input('redirect_url')} &token=${user.token}`
        },
        from: 'bruno.campos@bytehub.com.br',
        from_alias: 'Bruno Campos | Bytehub',
        to: user.email,
        subject: 'Recuperação de senha'
      }

      Kue.dispatch(JobMail.key, emailConfig, { attempts: 3 })
    } catch (error) {
      return response.status(error.status).send({
        message: error.message,
        code: error.code
      })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findBy('token', token)

      if (!user) throw new APIException('User não encontrado', 'USER_NOT_FOUND', 404)

      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)

      if (tokenExpired) {
        return response.status(401).send({ message: 'O token de recuperação expirou' })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()
    } catch (error) {
      return response.status(error.status || 500).send({
        message: error.message,
        code: error.code || 'SERVER_ERROR'
      })
    }
  }
}

module.exports = ForgotPasswordController
