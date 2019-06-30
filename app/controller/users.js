const Users = require('../models/users')

class UsersCtl {
    async find(ctx){ 
        ctx.body =await Users.find()
    }
    async findById(ctx){   
        const user =await Users.findById(ctx.params.id) 
        if(!user)   {ctx.thorw(404,'user not found')}
        ctx.body = user
    }
    async create(ctx){  
        ctx.verifyParams({
            name:{type:'string',required:true},
            age:{type:'number',required:false}
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
        const user = await Users.findByIdAndUpdate(ctx.params.id,ctx.request.body)
        if(!user)   {ctx.throw(404)}
        ctx.body =user    
    }
    async delete(ctx){  
        const user = await Users.findByIdAndRemove(ctx.params.id)
        if(!user)   {ctx.throw(404,'user not found (delete)')}
        ctx.status =204
    }
}
module.exports=new UsersCtl()