const CartProduct = require('../models/CartProduct')
const Product = require('../models/Product')
const getUserByToken = require('../helpers/getUserByToken')
const CartUser = require('../models/CartUser')
const AddressUser = require('../models/AddressUser')

module.exports = class CartProductController{
    static async addProductInCart(req, res){
        const qty = parseInt(req.body.qty, 10)
        try{
            const user = await getUserByToken(req, res)
            const cart = await CartUser.findOne({where: {UserId: user.id}})
            const product = await Product.findOne({where: {id: req.params.productId}})
            if(!product){
                res.status(404).json({message: 'Produto não encontrado!'})
                return
            }
            if(!/^[0-9]+$/.test(qty)){
                res.status(400).json({message: 'Quantidade inválida, digite apenas números!'})
                return
            }
            if(qty <= 0){
                res.status(400).json({message: 'Quantidade inválida!'})
                return
            }
            if(product.qty - qty < 0){
                res.status(200).json({message: `Produto indisponível na quantidade selecionada! Quantidade disponível = ${product.qty}`})
                return
            }
            let price
            if(product.onDiscount){
                price = product.priceDiscount
            }else{
                price = product.price
            }
            let totalAmountProduct = qty * price

            const productsInCart = await CartProduct.findOne({where: {CartUserId: cart.id, ProductId: product.id, sold: false}})

            if(productsInCart){
                const newQty = qty + productsInCart.qty
                totalAmountProduct = newQty * price
                await CartProduct.update({qty: newQty, totalAmountProduct: totalAmountProduct}, {where: {CartUserId: cart.id, ProductId: product.id}})
            }else{
                await CartProduct.create({CartUserId: cart.id, ProductId: product.id, qty: qty, totalAmountProduct: totalAmountProduct, price: price})
            }
            res.status(201).json({message: 'Produto adicionado ao carrinho'})

        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async removeProduct(req, res){
        try{
            const user = await getUserByToken(req, res)
            const cart = await CartUser.findOne({where: {UserId: user.id}})
            const product = await Product.findOne({where: {id: req.params.productId}})
            if(!product){
                res.status(404).json({message: 'Produto não encontrado!'})
                return
            }
            await CartProduct.destroy({where: {CartUserId: cart.id, ProductId: product.id}})
            res.status(200).json({message: 'Produto deletado do carrinho!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async addQty(req, res){
        try{
            const user = await getUserByToken(req, res)
            const cart = await CartUser.findOne({where: {UserId: user.id}})
            const product = await Product.findOne({where: {id: req.params.productId}})
            const productsInCart = await CartProduct.findOne({where: {ProductId: product.id, CartUserId: cart.id}})
            if(!productsInCart){
                res.status(404).json({message: 'Produto não encontrado em seu carrinho!'})
                return
            }
            const newQty = productsInCart.qty + 1
            const totalAmountProduct = newQty * productsInCart.price
            await CartProduct.update({qty: newQty, totalAmountProduct: totalAmountProduct}, {where: {ProductId:product.id, CartUserId: cart.id}})
            res.status(200).json({message: 'Carrinho atualizado!'})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async decreaseQty(req, res){
        try{
            const user = await getUserByToken(req, res)
            const cart = await CartUser.findOne({where: {UserId: user.id}})
            const product = await Product.findOne({where: {id: req.params.productId}})
            const productsInCart = await CartProduct.findOne({where: {ProductId: product.id, CartUserId: cart.id}})
            if(!productsInCart){
                res.status(404).json({message: 'Produto não encontrado em seu carrinho!'})
                return
            }
            const newQty = productsInCart.qty - 1 
            const totalAmountProduct = newQty * productsInCart.price
            if(productsInCart.qty - 1 == 0){
                CartProduct.destroy({where: {ProductId:product.id, CartUserId: cart.id}})
                res.status(200).json({message: 'Produto deletado do carrinho!'})
            }else{
                await CartProduct.update({qty: newQty, totalAmountProduct: totalAmountProduct}, {where: {ProductId:product.id, CartUserId: cart.id}})
                res.status(200).json({message: 'Carrinho atualizado!'})
            }
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async editQty(req, res){
        try{
            const qty = req.body.qty
            const user = await getUserByToken(req, res)
            const cart = await CartUser.findOne({where: {UserId: user.id}})
            const product = await Product.findOne({where: {id: req.params.productId}})
            if(qty && product.qty < qty){
                res.status(200).json({message: `Produto indisponível na quantidade selecionada! Quantidade disponível = ${product.qty}`})
                return

            }
            const productsInCart = await CartProduct.findOne({where: {ProductId: product.id, CartUserId: cart.id}})
            if(qty && qty !== productsInCart.qty){
                await CartProduct.update({qty: qty}, {where: {CartUserId: cart.id, ProductId: req.params.productId }})
            }
            res.status(200).json({message: 'Carrinho atualizado!'})
        }catch(error){
            console.log(error)
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async getCart(req, res){
        try{
            const user = await getUserByToken(req, res)
            const cart = await CartUser.findOne({where: {UserId: user.id}})
            const cartProduct = await CartProduct.findAll({where: {CartUserId: cart.id}})

            const itemProduct = []
            for(const i of cartProduct){
                const product =  await Product.findOne({where: {id: i.ProductId}})
                let price
                if(product.onDiscount){
                    price = product.priceDiscount
                }else{
                    price = product.price
                }

                const item = {
                    productInCart: {
                        product: {
                            product
                        },
                        qtyInCart: i.qty,
                        price: price,
                        totalAmountProduct: i.qty * price
                    }
                }
                itemProduct.push(item)
            }
            res.status(200).json({message: 'Detalhes no carrinho', itemProduct })
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async selectItems(req, res){
        try{
            const user = await getUserByToken(req, res)
            const cart = await CartUser.findOne({where: {UserId: user.id}})
            const product = await Product.findOne({where: {id: req.params.productId}})
            console.log(product.qty)
            const cartProduct = await CartProduct.findOne({where: {CartUserId: cart.id, ProductId: product.id}})
            console.log(cartProduct.qty)
            if(!cartProduct || cartProduct.qty > product.qty){
                res.status(400).json({message: 'Não é possível selecionar items com quantidade em estoque inferior a quantidade desejada!'})
                return
            }
            await CartProduct.update({selected: true}, {where: {CartUserId: cart.id, ProductId: req.params.productId}})
            res.status(200).json({ message: 'Estado de seleção atualizado com sucesso.' })
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
    static async checkout(req, res){
        try{
            const user = await getUserByToken(req, res)
            const addressExists = await AddressUser.findAll({where: {UserId: user.id}})
            console.log(addressExists)
            if(addressExists.length === 0){
                res.status(400).json({message: 'Antes de ir para a venda, você deve ter um endereço cadastrado!'})
                return
            }
            const cart = await CartUser.findOne({where: {UserId: user.id}})
            const selectedProducts = await CartProduct.findAll({where: {CartUserId: cart.id, selected: true}})

            const totalAmountCart = selectedProducts.reduce((totalAmount, product) => totalAmount + product.totalAmountProduct, 0);

            const products = []
            for(const p of selectedProducts){
                const product = await Product.findOne({where: {id: p.ProductId}})

                const itemProduct = {
                    product: {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        qtyInStock: product.qty,
                        image: product.image,
                        price: product.price,
                        onDiscount: product.onDiscount,
                    },
                    productsInCart: {
                        qty: p.qty,
                        price: p.price,
                        totalAmountProduct: p.totalAmountProduct
                    }
                }
                products.push(itemProduct)
            }
            res.status(200).json({message: 'Carrinhoo', product: products, totalAmountCart: totalAmountCart})
        }catch(error){
            res.status(500).json({message: 'Erro em processar a sua solicitação', error: error})
        }
    }
}