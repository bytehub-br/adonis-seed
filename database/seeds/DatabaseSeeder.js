'use strict'

/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const User = use('App/Models/User')
const Role = use('Role')

class DatabaseSeeder {
  async run () {
    const user = await User.create({
      username: 'John Doe',
      email: 'john@doe.com',
      password: '123456'
    })

    const permissions = await user.permissions().createMany([
      {
        name: 'Create User',
        slug: 'pm-create-user',
        description: 'Permission to create a user'
      },
      {
        name: 'Update User',
        slug: 'pm-update-user',
        description: 'Permission to update a user'
      },
      {
        name: 'View User',
        slug: 'pm-view-user',
        description: 'Permission to view a user'
      },
      {
        name: 'Delete User',
        slug: 'pm-delete-user',
        description: 'Permission to delete a user'
      }
    ])

    const permissionsIds = permissions.map((perm) => perm.id)

    const role = await Role.create({
      name: 'Moderator',
      slug: 'rl-moderator',
      description: 'Role Moderator'
    })

    await role.permissions().attach(permissionsIds)

    await user.roles().attach([role.id])
  }
}

module.exports = DatabaseSeeder
