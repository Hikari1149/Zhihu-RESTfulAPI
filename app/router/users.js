const jwt =  require('koa-jwt')
const Router = require('koa-router')
const {secret} = require('../config')
const router = new Router({prefix:'/users'})
const {find,findById,create,delete:del,update
    ,login,checkOwner,
    listFollowing,follow,unfollow,listFollowers,checkUserExist,
    followTopic,unfollowTopic,listFollowingTopic,
    listQuestions,
    listLikingAnwsers,likeAnwser,unlikeAnwser,dislikeAnwser,undislikeAnwser,listdisLikingAnwsers,
    collectAnwser,unCollectAnwser,listCollectAnwsers
} = require('../controller/users')
const {checkTopicExist} = require('../controller/topics')
const {checkAnwserExist} =require('../controller/anwsers')
const auth =jwt({secret})

router.get('/',find)
router.post('/',create)

router.get('/:id',findById)
router.patch('/:id',auth,checkOwner,update)
router.delete('/:id',auth,checkOwner,del)
router.post('/login',login)


//获取某个用户关注list 
router.get("/:id/following",listFollowing)
//获取某个用户粉丝
router.get("/:id/followers",listFollowers)


//关注某个用户
router.put('/following/:id',auth,checkUserExist,follow)
router.delete('/unfollowing/:id',auth,checkUserExist,unfollow)

//关注话题
router.put('/followingTopic/:id',auth,checkTopicExist,followTopic)
router.delete('/unfollowingTopic/:id',auth,checkTopicExist,unfollowTopic)

//
router.get("/:id/followingTopic",listFollowingTopic)

router.get("/:id/questions",listQuestions)

//点赞
//点赞后在执行取消反对
router.put('/likingAnwser/:id',auth,checkAnwserExist,likeAnwser,undislikeAnwser)
router.delete('/likingAnwser/:id',auth,checkAnwserExist,unlikeAnwser)
router.get("/:id/likingAnwser",listLikingAnwsers)
//反对
router.put('/dislikingAnwser/:id',auth,checkAnwserExist,dislikeAnwser,unlikeAnwser)
router.delete('/dislikingAnwser/:id',auth,checkAnwserExist,undislikeAnwser)
router.get("/:id/dislikingAnwser",listdisLikingAnwsers)


router.put('/collectAnwser/:id',auth,checkAnwserExist,collectAnwser,)
router.delete('/collectAnwser/:id',auth,checkAnwserExist,unCollectAnwser)
router.get("/:id/collectAnwser",listCollectAnwsers)
module.exports = router
