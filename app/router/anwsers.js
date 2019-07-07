const jwt =require('koa-jwt')
const Router = require('koa-router')
const router =new Router({prefix:'/questions/:questionId/anwsers'})
const {
    find,findById,create,update,delete:del,
    checkAnwserExist,checkAnwserer
}= require('../controller/anwsers')
const {secret} = require('../config')

const auth =jwt({secret})

router.get('/',find)
router.post('/',auth,create)
router.get('/:id',checkAnwserExist,findById)
router.patch('/:id',auth,checkAnwserExist,checkAnwserer,update)
router.delete('/:id',auth,checkAnwserExist,checkAnwserer,del)
module.exports=router