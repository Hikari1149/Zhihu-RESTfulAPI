const Comment = require('../models/comments')
class CommentCtl{
    async find(ctx){
        const {per_page = 10} = ctx.query
        const page =Math.max(ctx.query.page*1,1)
        const perPage =Math.max(per_page,1)
        const q = new RegExp(ctx.query.q)
        const {questionId,answerId} = ctx.params
        const {rootCommentId} = ctx.query
        ctx.body = await Comment
        .find({content:q,questionId,answerId})
        .limit(perPage).skip((page-1)*perPage)
        .populate('commentator')
    }
    async findById(ctx){
        const {fields =''} = ctx.query
        const selectFields = fields.split(';').filter(f=>f).map(f=>' +'+f).join('')
        const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator')
        ctx.body = comment
    }
    async create(ctx){
        ctx.verifyParams({
            content:{type:'string',required:true},
            rootCommentId:{type:'string',required:false},
            replyTo:{type:'string',required:false}
        })
        const comment = await new Comment({...ctx.request.body,     commentator:ctx.state.user._id,questionId:ctx.params.questionId,
        answerId:ctx.params.answerId 
        }).save()
        ctx.body = comment
    }
    async update(ctx){
        ctx.verifyParams({
            content:{type:'string',required:false},
        })
        const {content} = ctx.request.body
        const Comment =await Comment.findByIdAndUpdate(ctx.params.id,{content})
        ctx.body = Comment
    }
    async delete(ctx){
        await Comment.findByIdAndRemove(ctx.params.id)
        ctx.status=204
    }
    async checkCommentExist(ctx,next){
        const comment =await Comment.findById(ctx.params.id).select('+commentator')
        ctx.state.Comment = comment
        if(!comment)   {ctx.throw(404,'Comment is not exist!')}
        if(ctx.params.questionId && comment.questionId !== ctx.params.questionId){
            ctx.throw(404,'no comment in question')
        }
        if(ctx.params.anwserId && comment.anwserId !== ctx.params.anwserId){
            ctx.throw(404,'no comment in ans')
        }
        await next()
    }
    async checkCommentator(ctx,next){
        const {Comment} = ctx.state
        if(Comment.commentator.toString()!==ctx.state.user._id){
            ctx.throw(403,'no auth')
        }
        await next()

    }
}
module.exports = new CommentCtl()