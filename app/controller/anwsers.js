const Anwser = require('../models/anwsers')
class QuestionCtl{
    async find(ctx){
        const {per_page = 2} = ctx.query
        const page =Math.max(ctx.query.page*1,1)
        const perPage =Math.max(per_page,1)
        const q = new RegExp(ctx.query.q)
        ctx.body = await Anwser
        .find({content:q,questionId:ctx.params.questionId})
        .limit(perPage).skip((page-1)*perPage)
    }
    async findById(ctx){
        const {fields =''} = ctx.query
        const selectFields = fields.split(';').filter(f=>f).map(f=>' +'+f).join('')
        const topic = await Anwser.findById(ctx.params.id).select(selectFields).populate('answerer')
        ctx.body = topic
    }
    async create(ctx){
        ctx.verifyParams({
            content:{type:'string',required:true},
        })
        console.log("in2")
        const anwser = await new Anwser({...ctx.request.body,answerer:ctx.state.user._id,questionId:ctx.params.questionId}).save()
        ctx.body = anwser
    }
    async update(ctx){
        ctx.verifyParams({
            content:{type:'string',required:false},
        })
        const Anwser =await Anwser.findByIdAndUpdate(ctx.params.id,ctx.request.body)
        ctx.body = Anwser
    }
    async delete(ctx){
        await Anwser.findByIdAndRemove(ctx.params.id)
        ctx.status=204
    }
    async checkAnwserExist(ctx,next){
        const anwser =await Anwser.findById(ctx.params.id).select('+anwserer')
        ctx.state.anwser = anwser
        if(!anwser)   {ctx.throw(404,'Anwser is not exist!')}
        if(ctx.params.questionId && anwser.questionId !== ctx.params.questionId){
            ctx.throw(404,'no anwser')
        }
        await next()
    }
    async checkAnwserer(ctx,next){
        const {anwser} = ctx.state
        if(anwser.anwserer.toString()!==ctx.state.user._id){
            ctx.throw(403,'no auth')
        }
        await next()

    }
}
module.exports = new QuestionCtl()