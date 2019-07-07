const Question = require('../models/questions')
class QuestionCtl{
    async find(ctx){
        const {per_page = 2} = ctx.query
        const page =Math.max(ctx.query.page*1,1)
        const perPage =Math.max(per_page,1)
        const q = new RegExp(ctx.query.q)
        ctx.body = await Question
        .find({$or:[{title:q},{description:q}]})
        .limit(perPage).skip((page-1)*perPage)
    }
    async findById(ctx){
        const {fields =''} = ctx.query
        const selectFields = fields.split(';').filter(f=>f).map(f=>' +'+f).join('')
        const topic = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topics')
        ctx.body = topic
    }
    async create(ctx){
        ctx.verifyParams({
            title:{type:'string',required:true},
            description:{type:'string',required:false},
        })
        const question = await new Question({...ctx.request.body,questioner:ctx.state.user._id}).save()
        ctx.body = question
    }
    async update(ctx){
        ctx.verifyParams({
            title:{type:'string',required:true},
            description:{type:'string',required:false},
        })
        const question =await Question.findByIdAndUpdate(ctx.params.id,ctx.request.body)
        ctx.body = question
    }
    async delete(ctx){
        await Question.findByIdAndRemove(ctx.params.id)
        ctx.status=204
    }
    async checkQuestionExist(ctx,next){
        const question =await Question.findById(ctx.params.id).select('+questioner')
        ctx.state.question = question
        if(!question)   {ctx.throw(404,'Question is not exist!')}
        await next()
    }
    async checkQuestioner(ctx,next){
        const {question} = ctx.state
        if(question.questioner.toString()!==ctx.state.user._id){
            ctx.throw(403,'no auth')
        }
        await next()

    }
}
module.exports = new QuestionCtl()