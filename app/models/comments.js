const mongoose = require('mongoose')

const {Schema,model} =mongoose

const commentSchema = new Schema({
    __v:{type:Number,select:false},
    content:{type:String,required:true},
    commentator:{type:Schema.Types.ObjectId,ref:'Users',required:true,select:false},
    questionId:{type:String,required:true},
    answerId:{type:String,required:true},
    rootCommentId:{type:String},
    replyTo:{type:Schema.Types.ObjectId,ref:'Users'}
},{timestamps:true})

module.exports = model('Comment',commentSchema)