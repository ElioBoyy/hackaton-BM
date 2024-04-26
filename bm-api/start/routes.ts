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

// User routes
router.get('/api/users', UsersController.index)
router.get('/api/users/:id', UsersController.show)
router.post('/api/users', UsersController.store)
router.put('/api/users/:id', UsersController.update)
router.delete('/api/users/:id', UsersController.destroy)

// Grid routes
router.get('/api/grids', GridsController.index)
router.get('/api/grids/:id', GridsController.show)
router.post('/api/grids', GridsController.store)
router.put('/api/grids/:id/title', GridsController.updateTitle)
router.put('/api/grids/:id/status', GridsController.updateStatus)
router.delete('/api/grids/:id', GridsController.destroy)

// Pixel history routes
router.get('/api/pixelhistories', PixelHistoriesController.index)
router.get('/api/pixelhistories/:id', PixelHistoriesController.show)
router.post('/api/pixelhistories', PixelHistoriesController.store)
router.delete('/api/pixelhistories/:id', PixelHistoriesController.destroy)

// Pixel routes
router.get('/api/pixels', PixelsController.index)
router.get('/api/pixels/:id', PixelsController.show)
router.post('/api/pixels', PixelsController.store)
router.delete('/api/pixels/:id', PixelsController.destroy)

// user bonuses routes
router.get('/api/userbonuses', UserBonusesController.index)
router.get('/api/userbonuses/:id', UserBonusesController.show)
router.post('/api/userbonuses', UserBonusesController.store)
router.delete('/api/userbonuses/:id', UserBonusesController.destroy)

// Bonus routes
router.get('/api/bonuses', BonusesController.index)
router.get('/api/bonuses/:id', BonusesController.show)
router.post('/api/bonuses', BonusesController.store)
router.delete('/api/bonuses/:id', BonusesController.destroy)
