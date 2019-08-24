'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.get('users', 'UserController.index').middleware(['auth'])
Route.get('users/:id', 'UserController.show').middleware(['auth'])
Route.post('users', 'UserController.store').validator('User').middleware(['auth'])
Route.put('users/:id', 'UserController.update').middleware(['auth', 'is:(rl-moderator)'])

Route.post('session', 'SessionController.store').validator('Session')

Route.post('forgot_password', 'ForgotPasswordController.store').validator('ForgotPassword')
Route.put('reset_password', 'ForgotPasswordController.update').validator('ResetPassword')

Route.get('permission', 'PermissionController.index').middleware(['auth'])
Route.get('permission/:id', 'PermissionController.show').middleware(['auth'])
Route.post('permission', 'PermissionController.store').validator('Permission').middleware(['auth', 'is(rl-moderator)'])
Route.put('permission/:id', 'PermissionController.update').middleware(['auth', 'is(rl-moderator)'])
Route.delete('permission/:id', 'PermissionController.destroy').middleware(['auth', 'is(rl-moderator)'])

Route.get('roles', 'RoleController.index').middleware(['auth'])
Route.get('roles/:id', 'RoleController.show').middleware(['auth'])
Route.post('roles', 'RoleController.store').middleware(['auth', 'is(rl-moderator)'])
Route.put('roles/:id', 'RoleController.update').middleware(['auth', 'is(rl-moderator)'])
Route.delete('roles/:id', 'RoleController.destroy').middleware(['auth', 'is(rl-moderator)'])
