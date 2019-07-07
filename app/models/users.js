const mongoose = require('mongoose')

const {Schema,model} = mongoose

const userSchema = new Schema({
    __v:{type:Number,select:false},
    name:String,
    password:{type:String,Required:true,select:false},
    avatar_url:{type:String},
    gender:{type:String,enum:['male','female'],default:'male',required:true},
    headline:{type:String},
    //存的时候是id 该字段可以通过populate替换成一个Topic对象
    locations:{type:[{type:Schema.Types.ObjectId,ref:'Topic'} ],select:false},
    business:{type:Schema.Types.ObjectId,ref:'Topic',select:false},
    employments:{
        type:[{
            company:{type:Schema.Types.ObjectId,ref:'Topic'},
            job:{type:Schema.Types.ObjectId,ref:'Topic'}
        }],
        select:false
    },
    educations:{
        type:[{
            school:{type:Schema.Types.ObjectId,ref:'Topic'},
            major:{type:Schema.Types.ObjectId,ref:'Topic'},
            diploma:{type:Number,enum:[1,2,3,4,5]},
            entrance_year:{type:Number},
            graducation:{type:Number}
        }],
        select:false
    },
    following:{
        type:[{type:Schema.Types.ObjectId,ref:'Users'}],
        select:false
    },
    followingTopics:{
        type:[{type:Schema.Types.ObjectId,ref:'Topic'}],
        select:false
    },
    likingAnwsers:{
        type:[{type:Schema.Types.ObjectId,ref:'Anwser'}],
        select:false
    },
    dislikingAnwsers:{
        type:[{type:Schema.Types.ObjectId,ref:'Anwser'}],
        select:false
    },
    collectingAnwsers:{
        type:[{type:Schema.Types.ObjectId,ref:'Anwser'}],
        select:false
    }
})
const Users =model('Users',userSchema)
module.exports= Users
 