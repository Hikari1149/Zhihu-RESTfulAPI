const mongoose = require('mongoose')

const {Schema,model} =mongoose

const anwserSchema = new Schema({
    __v:{type:Number,select:false},
    content:{type:String,required:true},
    answerer:{type:Schema.Types.ObjectId,ref:'Users',required:true},
    questionId:{type:String,required:true},
    voteCount:{type:Number,required:true,default:0},
})

module.exports = model('Anwser',anwserSchema)