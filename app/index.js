const Koa = require('koa')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const path = require('path')
const mongoose =require('mongoose')
const {connectionStr} =require('./config')

const app = new Koa() //instance
const routing = require("./router")

//connect mongoDB
mongoose.connect(connectionStr, { useNewUrlParser: true } ,()=>{console.log("MongoDB connection successful")})
mongoose.connection.on('error',()=>{console.error("error occured")})


//static-server
//can access /public file via http request
app.use(koaStatic(path.join(__dirname,'public')))



//ctx.request.body
app.use(koaBody({
    multipart:true,// support file
    formidable:{
        uploadDir:path.join(__dirname,'/public/uploads'),//上传文件保存路径
        keepExtensions:true //保留文件扩展名
    }    
}))

//error handler
app.use(error({
    postFormat:((e,{stack,...rest})=>{
        return process.env.NODE_ENV === 'production'?rest:{stack,...rest}
    })
}))
/// check parameter
app.use(parameter(app))
routing(app)
app.listen(3000,()=>{
    console.log("starting")
})
