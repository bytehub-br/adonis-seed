'use strict'
const User = use('App/Models/User')
const Database = use('Database')
const APIException = use('App/Exceptions/APIException')

class UserController {
  async index ({ request, response }) {
    try {
      let { page } = request.get()

      page = Number(page) ? Number(page) : 1

      const users = await Database.from('users').paginate(page, 10)

      return users
    } catch (error) {
      return response.status(error.status || 500).send({
        message: error.message,
        code: error.code || 'SERVER_ERROR'
      })
    }
  }

  async store ({ request, response }) {
    const { permissions, roles, ...data } = request.only([
      'username',
      'email',
      'password',
      'permissions',
      'roles'
    ])

    const user = await User.create(data)

    if (roles) {
      await user.roles().attach(roles)
    }

    await user.loadMany(['roles'])

    return user
  }

  async show ({ params, response }) {
    try {
      const user = await User.find(params.id)

      if (!user) throw new APIException('User not found', 'USER_NOT_FOUND', 404)

      await user.load('roles')

      return user
    } catch (error) {
      return response.status(error.status || 500).send({
        message: error.message,
        code: error.code || 'SERVER_ERROR'
      })
    }
  }

  async update ({ request, response, params }) {
    try {
      const { permissions, roles, ...data } = request.only([
        'username',
        'email',
        'password',
        'permissions',
        'roles'
      ])

      const user = await User.find(params.id)

      if (!user) throw new APIException('User not found', 'USER_NOT_FOUND', 404)

      user.merge(data)

      await user.save()

      if (roles) {
        await user.roles().sync(roles)
      }

      await user.loadMany(['roles'])

      return user
    } catch (error) {
      console.log(error)
      return response.status(error.status).send({
        message: error.message,
        code: error.code
      })
    }
  }
}

module.exports = UserController
