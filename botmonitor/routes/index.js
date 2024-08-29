const Router = require('express')
const router = new Router()

const managerController = require('../controllers/managerController')


//get MANAGERS
router.get("/managers/chat/:id", managerController.managersChatId); // UUID менеджера по его tgID

module.exports = router