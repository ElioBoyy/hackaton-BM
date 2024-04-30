/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import UsersController from '#controllers/users_controller'
import GridsController from '#controllers/grids_controller'
import router from '@adonisjs/core/services/router'
import PixelHistoriesController from '#controllers/pixel_histories_controller'
import PixelsController from '#controllers/pixels_controller'
import UserBonusesController from '#controllers/user_bonuses_controller'
import BonusesController from '#controllers/bonuses_controller'
import AuthController from '#controllers/auth_controller'
import { middleware } from './kernel.js'

router.group(() => {
    // User routes
    router.get('/users', UsersController.index)
    router.get('/users/:id', UsersController.show)
    router.put('/users/:id', UsersController.update)
    router.delete('/users/:id', UsersController.destroy)

    // Grid routes
    router.get('/grids', GridsController.index)
    router.get('/grids/:id', GridsController.show)
    router.get('/grids/user/:id', GridsController.showGridOwner)
    router.get('/grids/url/:url', GridsController.showGridByUrl)
    router.post('/grids', GridsController.store)
    router.put('/grids/:id/title', GridsController.updateTitle)
    router.put('/grids/:id/status', GridsController.updateStatus)
    router.delete('/grids/:id', GridsController.destroy)

    // Pixel history routes
    router.get('/pixelhistories', PixelHistoriesController.index)
    router.get('/pixelhistories/:id', PixelHistoriesController.show)
    router.post('/pixelhistories', PixelHistoriesController.store)
    router.delete('/pixelhistories/:id', PixelHistoriesController.destroy)

    // Pixel routes
    router.get('/pixels', PixelsController.index)
    router.get('/pixels/:id', PixelsController.show)
    router.get('/pixels/grid/:gridId', PixelsController.pixelByGridShow)
    router.get('/pixels/grid/:x/:y/:gridId', PixelsController.pixelByGridXYShow)
    router.post('/pixels', PixelsController.store)
    router.delete('/pixels/:id', PixelsController.destroy)
    router.delete('/pixels/grid/:x/:y/:gridId', PixelsController.destroyByGridXY)

    // user bonuses routes
    router.get('/userbonuses', UserBonusesController.index)
    router.get('/userbonuses/:id', UserBonusesController.show)
    router.post('/userbonuses', UserBonusesController.store)
    router.delete('/userbonuses/:id', UserBonusesController.destroy)

    // Bonus routes
    router.get('/bonuses', BonusesController.index)
    router.get('/bonuses/:id', BonusesController.show)
    router.post('/bonuses', BonusesController.store)
    router.delete('/bonuses/:id', BonusesController.destroy)



    // Auth routes
    router.group(() => {
      router.post('/register', AuthController.register)
      router.post('/login', AuthController.login)
      router.post('/logout', AuthController.logout).use(middleware.auth())
    }).prefix('user')
    
    router.get('/me', async ({ auth, response }) => {
      try {
        const user = auth.getUserOrFail()
        return response.ok(user)
      } catch (error) {
        return response.unauthorized({ error: 'User not found' })
      }
    })
    .use(middleware.auth())

}).prefix('api')