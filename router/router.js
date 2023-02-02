const express = require('express')
const controller = require('../controller/controller')
const token = require('../middleware/token')
const image_validation = require('../middleware/image_validation')
const {validate} = require('../middleware/validation')


let router = express.Router()

router
    .get('/login', controller.OPEN_LOGIN)
    .get('/elon_berish',  controller.OPEN_ELON_BERISH)
    .post('/adminga_elon_yuborish', validate, image_validation, controller.SENT_ELON)
    .get('/elonlar', controller.ELONLAR)
    .get('/', controller.ELONLAR)
    .post('/login_admin',  controller.LOGIN_ADMIN)
    .get('/logout', controller.LOGOUT)
    .get('/admin_panel', token, controller.LOAD_ADMIN_PANEL)
    .get('/tasdiqlash/:id', controller.TASDIQLASH)
    .get('/bekor_qilish/:id', controller.BEKOR_QILISH)
    .get('/admin_panel/qabul_qilinganlar', token, controller.LOAD_ADMIN_PANEL_QABUL)
    .get('/admin_panel/rad_etilgan', token, controller.LOAD_ADMIN_PANEL_RAD)
    .post('/filter_elonlar', controller.FILTER_ELONLAR)

module.exports=router;

