const { validationResult } = require('express-validator')
const Product = require('../models/Product')
const Category = require('../models/CategoryProduct')
const getEnterpriseByToken = require('../helpers/getEnterpriseByToken')
const sequelize = require('sequelize')
const Op = sequelize.Op

module.exports = class ProductController{
    static async createProduct(req, res){
        const errors = validationResult(req, res)
        if(!errors.isEmpty()){
            res.status(400).json({message: 'Erro em processar a sua solicitação!', error: errors})
            return
        }
        const {name, description, price, qty, onDiscount, category, priceDiscount} = req.body
        const images = req.files
        const enterprise = await getEnterpriseByToken(req, res)
        if(!enterprise){
            res.status(404).json({message: 'Erro em processar a sua solicitação!'})
            return
        }
        if(onDiscount){
            if(!priceDiscount){
                res.status(400).json({message: 'Já que o produto está em desconto, deve ser informado o preço do produto em oferta!'})
                return
            }
        }
        const productExists = await Product.findOne({where: {name: name}})
        if(productExists){
            res.status(400).json({message: 'Já existe um produto com o mesmo nome cadastrado, modifique o nome e tente novamente!'})
            return
        }
        try{
            let categoryIntance = null
            const categoryExists = await Category.findOne({where: {name: category}})
            
            if(!categoryExists){
                categoryIntance = await Category.create({name: category})
            }else{
                categoryIntance = categoryExists
            }
            const product = {
                name,
                description: description,
                price,
                priceDiscount: priceDiscount || null,
                qty,
                CategoryId: categoryIntance.id,
                images: [],
                onDiscount: onDiscount || false,
                EnterpriseId: enterprise.id
            }
            images.map((image)=>{
                product.images.push(image.filename)
            })

            await Product.create(product)
            res.status(201).json({message: 'Produto cadastrado!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error: error})
            return
        }
    }
    static async editProduct(req,res){
        const id = req.params.id
        const {name, description, price, qty, onDiscount, category, priceDiscount} = req.body
        const images = req.files
        if(onDiscount){
            if(!priceDiscount){
                res.status(400).json({message: 'Já que o produto está em desconto, deve ser informado o preço do produto em oferta!'})
                return
            }
        }
        
        const productExists = await Product.findOne({where: {id: id}})
        if(!productExists){
            res.status(404).json({message: 'Produto não encontrado!'})
            return
        }

        if(name){
            const nameProductExists = await Product.findOne({where: {name: name}})
            if(nameProductExists){
                res.status(400).json({message: 'Já existe um produto com o mesmo nome cadastrado, modifique o nome e tente novamente!'})
                return
            }
        }
        try{
            let categoryIntance = null
            if(category){
                const categoryExists = await Category.findOne({where: {name: category}})
            
                if(!categoryExists){
                categoryIntance = await Category.create({name: category})
                }else{
                    categoryIntance = categoryExists
                }
            }
            const product = {
                name: name || productExists.name,
                description: productExists.description,
                price: price || productExists.price,
                priceDiscount: priceDiscount || productExists.priceDiscount,
                qty: qty | productExists.qty,
                CategoryId: categoryIntance ? categoryIntance.id : productExists.CategoryId,
                images: [],
                onDiscount: onDiscount || productExists.onDiscount,
                EnterpriseId: productExists.EnterpriseId
            }
            if(images){
                images.map((image)=>{
                product.images.push(image.filename)
            })}else{
                productExists.images.map((image)=>{
                    product.images.push(image)
                }) 
            }
            if(onDiscount !== true){
                product.onDiscount = false
            }
            await Product.update(product, {where: {id: id}})
            res.status(201).json({message: 'Produto editado!'})
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error: error})
        }
    }
    static async deleteProduct(req, res){
        const id = req.params.id
        try{
            const productExists = await Product.findOne({where: {id: id}})
            if(!productExists){
                res.status(404).json({message: 'Produto não encontrado!'})
                return
            }
            await Product.destroy({where: {id: id}})
            res.status(200).json({message: 'Produto excluído!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error: error})   
        }
    }
    static async getAllProducts(req, res){
        try{
            const productsCatalog = await Product.findAll()
            res.status(200).json({message: 'Produtos cadastrados', products: productsCatalog})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error: error}) 
        }
    }
    static async areProductsOnOffer(req, res){
        try{
            const productsOnOffer = await Product.findAll({where: {onDiscount: true}})
            if(!productsOnOffer){
                return res.status(400).json({message: 'Infelizmente no  momento não há produtos em oferta!'})
            }
            res.status(200).json({message: 'Produtos em oferta', products: productsOnOffer})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error: error}) 
        }
    }
    static async getProductById(req, res){
        const id = req.params.id
        try{
            const productExists = await Product.findOne({where: {id: id}})
            if(!productExists){
                return res.status(404).json({message: 'Produto não encontrado. Tente novamente!'})
            }
            return res.status(200).json({message: 'Produto', product: productExists})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error: error})
        }
    }
    static async searchProducts(req, res){
        const query = req.query.q
        try{
            const products = await Product.findAll({where: {
                name: {
                    [Op.like]: `%${query}%`
                }
            }})
            if(products.length ===0){
                return res.status(404).json({message: `Nenhum produto encontrado com base no termo buscado`})
            }
            return res.status(200).json({message: 'Produtos encontrados', products: products})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação!', error: error})
        }
    }
}