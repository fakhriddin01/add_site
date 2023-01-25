const express = require('express')
const controller = require('../controller/controller')

let router = express.Router()

router
    .get('/login', controller.OPEN_LOGIN)
    .get('/elon_berish', controller.OPEN_ELON_BERISH)
    .post('/adminga_elon_yuborish', controller.SENT_ELON)



module.exports=router;