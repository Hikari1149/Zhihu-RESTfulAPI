const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const error = require('koa-json-error')
const parameter = require('koa-parameter')
const mongoose =require('mongoose')
const {connectionStr} =require('./config')

const app = new Koa() //instance
const routing = require("./router")

//connect mongoDB
mongoose.connect(connectionStr, { useNewUrlParser: true } ,()=>{console.log("MongoDB connection successful")})
mongoose.connection.on('error',()=>{console.error("error occured")})

//error handler
app.use(error({
    postFormat:((e,{stack,...rest})=>{
        return process.env.NODE_ENV === 'production'?rest:{stack,...rest}
    })
}))
//ctx.requests.body
app.use(bodyParser())
/// check parameter
app.use(parameter(app))
routing(app)
app.listen(3000,()=>{
    console.log("starting")
})
