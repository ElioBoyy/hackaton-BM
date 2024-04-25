/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'

// User routes
router.get('/api/users', UsersController.index)
router.get('/api/users/:id', UsersController.show)
router.post('/api/users', UsersController.store)
router.put('/api/users/:id', UsersController.update)
router.delete('/api/users/:id', UsersController.destroy)
