const { mkdir } = require('fs')
const multer = require('multer')
const path = require('path')

const imageStorage = multer.diskStorage({
    destination: function(req, file, cb){
        const productName = req.body.name
        if(!productName){
            return cb(new Error('Nome do produto não encontrado!'))
        }
        const folder = `public/imagesProducts/${productName}`
        
        mkdir(folder, {recursive: true}, (error)=>{
            if(error){
                return cb(error)
            }
            cb(null, folder)
        })
    },
    filename: function(req, file, cb){
        const extname = path.extname(file.originalname)
        const fileName = `${Date.now()}${extname}`
        cb(null, fileName)
    }
})
const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return cb(new Error('Enviei apenas arquivos png ou jpg!'))
        }
        cb(null, true)
    }
})

module.exports =  imageUpload
