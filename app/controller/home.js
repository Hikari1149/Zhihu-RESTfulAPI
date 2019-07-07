const path = require('path')
class HomeCtl {
    index(ctx){
        ctx.body = 'home page'
    }
    upload(ctx){
        const file = ctx.request.files.file
        ctx.body = `${ctx.origin}/uploads/${path.basename(file.path)}` 
    }
}
module.exports =new HomeCtl()