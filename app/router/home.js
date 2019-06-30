const Router = require('koa-router')
const router = new Router()
const {index} = require('../controller/home')

router.get('/',index)

module.exports =   router
