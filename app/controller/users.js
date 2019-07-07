const jwt = require('jsonwebtoken')
const {secret}  = require('../config')
const Users = require('../models/users')
const Questions = require('../models/questions')
const Anwser = require('../models/anwsers')

class UsersCtl {
    //用户只能变更自己的资料
    async checkOwner(ctx,next){ 
        if(ctx.state.user._id !== ctx.params.id){
            ctx.throw(403,'no access')
        }
        await next()
    }
    async find(ctx){ 
        const {per_page = 2} = ctx.query
        const page =Math.max(ctx.query.page*1,1)
        const perPage =Math.max(per_page,1)
        ctx.body =await Users
        .find({name:new RegExp(ctx.query.q)})
        .limit(perPage).skip((page-1)*perPage)
    }
    async findById(ctx){   
        const {fields=''} = ctx.query
        // ?fileds =v1;v2;v3..
        const selectFields = fields.split(";").filter(f=>f).map(f=>" +"+f).join('')
        const populateStr = fields.split(";").filter(f=>f).map(f=>{
            if(f==='employments')
               return 'employments.company employments.job'
            if(f==='educations')
                return 'educations.schol educations.major'  
            return f     
        }).join(' ')
        const user =await Users.findById(ctx.params.id).select(selectFields).populate(populateStr)
        if(!user)   {ctx.throw(404,'user not found')}
        ctx.body = user
    }
    async create(ctx){  
        ctx.verifyParams({
            name:{type:'string',required:true},
            age:{type:'number',required:false},
            avatar_url:{type:'string',required:false},
            locations:{type:'array',itemType:'string',required:false},
            employments:{type:'array',itemType:'object',required:false}
        })
        const {name} = ctx.request.body
        const repeatedUser = await Users.findOne({name})
        if(repeatedUser){
            ctx.throw(409,'user already exists')
        }

        const user =await new Users(ctx.request.body).save()
        ctx.body = user
    }
    async update(ctx){ 
        ctx.verifyParams({
            locations:{type:'array',itemType:'string',required:false}
        })
        const user = await Users.findByIdAndUpdate(ctx.params.id,ctx.request.body)
        if(!user)   {ctx.throw(404)}
        ctx.body =user    
    }
    async delete(ctx){  
        const user = await Users.findByIdAndRemove(ctx.params.id)
        if(!user)   {ctx.throw(404,'user not found (delete)')}
        ctx.status =204
    }
    async login(ctx){
        ctx.verifyParams({
            name:{type:'string',required:true},
            password:{type:'string',required:true},
        })
        const user = await Users.findOne(ctx.request.body)
        if(!user)   {ctx.throw(401,'username or password invalid')}
        //login success  generate & return token
        const token = jwt.sign({name:user.name,_id:user._id},secret,{expiresIn:'1d'})
        ctx.body=token
    }
    async listFollowing(ctx){
        const user = await Users.findById(ctx.params.id).select('+following').populate('following')
        if(!user){ctx.throw(404)}
        ctx.body =user.following
    }
    async listFollowers(ctx){
        const users = await Users.find({following:ctx.params.id})
        ctx.body = users
    }
    async checkUserExist(ctx,next){
        const user =await Users.findById(ctx.params.id)
        if(!user)   {ctx.throw(404,'user is not exist!')}
        await next()
    }
    async follow(ctx){
        const me =await Users.findById(ctx.state.user._id).select('+following')
        if(!me.following.map(x=>x.toString()).includes(ctx.params.id)){
         me.following.push(ctx.params.id)
         me.save()
        }
        ctx.status=204
    }
    async unfollow(ctx){
        const me =await Users.findById(ctx.state.user._id).select('+following')
        const index=me.following.map(x=>x.toString()).indexOf(ctx.params.id)
        if(index!==-1){
            me.following.splice(index,1)
            me.save()
        }
        ctx.status=204
    }
    async followTopic(ctx){
        const me =await Users.findById(ctx.state.user._id).select('+followingTopics')
        if(!me.followingTopics.map(x=>x.toString()).includes(ctx.params.id)){
         me.followingTopics.push(ctx.params.id)
         me.save()
        }
        ctx.status=204
    }
    async unfollowTopic(ctx){
        const me =await Users.findById(ctx.state.user._id).select('+followingTopics')
        const index=me.followingTopics.map(x=>x.toString()).indexOf(ctx.params.id)
        if(index!==-1){
            me.followingTopics.splice(index,1)
            me.save()
        }
        ctx.status=204
    }
    async listFollowingTopic(ctx){
        const user = await Users.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
        if(!user){ctx.throw(404,'用户不存在')}
        ctx.body =user.followingTopics
    }
    //该用户提出的问题
    async listQuestions(ctx){
        const questions = await Questions.find({questioner:ctx.params.id})
        ctx.body = questions
    }

    //点赞
    async likeAnwser(ctx,next){
        const me =await Users.findById(ctx.state.user._id).select('+likingAnwsers')
        if(!me.likingAnwsers.map(x=>x.toString()).includes(ctx.params.id)){
         me.likingAnwsers.push(ctx.params.id)
         me.save()
         await Anwser.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:1}})
        }
        await next()
        ctx.status=204
    }
    async unlikeAnwser(ctx){
        const me =await Users.findById(ctx.state.user._id).select('+likingAnwsers')
        const index=me.likingAnwsers.map(x=>x.toString()).indexOf(ctx.params.id)
        if(index!==-1){
            me.likingAnwsers.splice(index,1)
            me.save()
            await Anwser.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:-1}})
        }
        ctx.status=204
    }
    async listLikingAnwsers(ctx){
        const user = await Users.findById(ctx.params.id).select('+likingAnwsers').populate('likingAnwsers')
        if(!user){ctx.throw(404,'用户不存在')}
        ctx.body =user.likingAnwsers
    }

    //反对
    async dislikeAnwser(ctx,next){
        const me =await Users.findById(ctx.state.user._id).select('+dislikingAnwsers')
        if(!me.dislikingAnwsers.map(x=>x.toString()).includes(ctx.params.id)){
         me.dislikingAnwsers.push(ctx.params.id)
         me.save()
         await Anwser.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:1}})
        }
        await next()
        ctx.status=204
    }
    async undislikeAnwser(ctx){
        const me =await Users.findById(ctx.state.user._id).select('+dislikingAnwsers')
        const index=me.dislikingAnwsers.map(x=>x.toString()).indexOf(ctx.params.id)
        if(index!==-1){
            me.dislikingAnwsers.splice(index,1)
            me.save()
            await Anwser.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:-1}})
        }
        ctx.status=204
    }
    async listdisLikingAnwsers(ctx){
        const user = await Users.findById(ctx.params.id).select('+dislikingAnwsers').populate('dislikingAnwsers')
        if(!user){ctx.throw(404,'用户不存在')}
        ctx.body =user.dislikingAnwsers
    }
    

    //收藏答案
    async collectAnwser(ctx,next){
        const me =await Users.findById(ctx.state.user._id).select('+collectingAnwsers')
        if(!me.collectingAnwsers.map(x=>x.toString()).includes(ctx.params.id)){
         me.collectingAnwsers.push(ctx.params.id)
         me.save()
         await Anwser.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:1}})
        }
        await next()
        ctx.status=204
    }
    async unCollectAnwser(ctx){
        const me =await Users.findById(ctx.state.user._id).select('+collectingAnwsers')
        const index=me.collectingAnwsers.map(x=>x.toString()).indexOf(ctx.params.id)
        if(index!==-1){
            me.collectingAnwsers.splice(index,1)
            me.save()
            await Anwser.findByIdAndUpdate(ctx.params.id,{$inc:{voteCount:-1}})
        }
        ctx.status=204
    }
    async listCollectAnwsers(ctx){
        const user = await Users.findById(ctx.params.id).select('+collectingAnwsers').populate('collectingAnwsers')
        if(!user){ctx.throw(404,'用户不存在')}
        ctx.body =user.collectingAnwsers
    }


}
module.exports=new UsersCtl()