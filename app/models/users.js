const mongoose = require('mongoose')

const {Schema,model} = mongoose

const userSchema = new Schema({
    __v:{type:Number,select:false},
    name:String,
    password:{type:String,Required:true,select:false}

})
const Users =model('Users',userSchema)
module.exports= Users
 