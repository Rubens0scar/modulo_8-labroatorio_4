const fs = require("fs");
const { Cart } = require("../models");
const { CartOrders } = require("../models");
const jwt = require("../utils/jwt");
const catchAsync = require("../utils/catchAsync");
const { decode } = require("punycode");
const { Product } = require("../models");

exports.payCart =  catchAsync(async (req, res) => {
    let token;
    
    token = req.headers.authorization.split(" ")[1];
    const decoded = await jwt.verifyToken(token);
    const idUser = decoded.id;
    const amount = req.body.amount;

    const result = await Cart.findAll({ where: { user: idUser, status: 'PENDING' } });
    if(result.length != 0){
        const foundCart = await Cart.findOne({ where: { user: idUser } });
        const resultOrders = await CartOrders.findOne({ where: { id_cart: foundCart.id } });

        if(resultOrders){
            const sum = await CartOrders.sum('price_sale', { where: { id_cart: foundCart.id } });

            if(sum === amount){
                Cart.findByPk(foundCart.id).then(function(foundCart) {
                    foundCart.update({
                        status: 'PAID'
                    });
                });

                res.status(200).json({
                    status: "The cart was paid successfully.",
                });
            }else{
                res.status(404).json({
                    status: "The sum of your order is " + sum + ", you must pay in full..",
                });
            }
        }else{
            res.status(404).json({
                status: "You do not have any products in the cart, please select one..",
            });
        }
    }else {
        res.status(404).json({
            status: "The user's cart is not pending payment.",
        });
    }    
});

exports.cartProduct =  catchAsync(async (req, res) => {
    if(req.body.length > 0){
        let token;
    
        token = req.headers.authorization.split(" ")[1];
        const decoded = await jwt.verifyToken(token);
        const idUser = decoded.id;

        const foundCart = await Cart.findOne({ where: { user: idUser, status: 'PENDING' } });
        let idcart;
        if(foundCart){
            //si existe cart y esta en estado pendding, adicionamos los productos
            idcart=foundCart.id;
        }else{
            //si no existe cart creamos el cart y adicionamos los productos
            let newCart = Cart.build({ user: idUser, status: "PENDING" });
            newCart = await newCart.save();
            idcart=newCart.id;
        }
        let erro="";
        req.body.forEach(async element => {
            const foundProduct = await Product.findOne({ where: { productName: element.product } });
            if(foundProduct){
                let newCartOrders = CartOrders.build({ id_cart: idcart, id_product: foundProduct.id, price_sale: foundProduct.price*element.quantity, quantity: element.quantity });
                newCartOrders = await newCartOrders.save();
                erro = erro + "Product " + element.product + " was successfully registered.\n";
            }else{
                erro = erro + "No existe el producto " + element.product + "\n";
            }
        });
        console.log(erro);
        res.status(200).json({
            status: "Product processed correctly",
        });
    } else {
        res.status(404).json({
            status: "You must select at least one product...",
        });
    }
});

exports.deleteProductCart =  catchAsync(async (req, res) => {
    let token;
    
    token = req.headers.authorization.split(" ")[1];
    const decoded = await jwt.verifyToken(token);
    const idUser = decoded.id;
    const idProduct = req.params.id;

    const foundCart = await Cart.findOne({ where: { user: idUser, status: 'PENDING' } });

    if(foundCart){
        //exite el cart pendiente para buscar el producto y eliminarlo
        const foundCartOrder = await CartOrders.findOne({ where: { id: foundCart.id, id_product: idProduct } });

        if(foundCartOrder){
            //existe el producto en car, se procede a borrarlo
            CartOrders.findByPk(foundCartOrder.id).then(function(foundProduct) {
                foundProduct.destroy();
            });

            res.status(200).json({
                status: "Product removed successfully.",
            });
        }else{
            //no existe el producto en el cart, manda mensaje de error
            res.status(404).json({
                status: "The product does not exist in the cart, process finished....",
            });
        }
        
    }else{
        //no existe ninguno cart pendiente no se puede eliminar el producto.
        res.status(404).json({
            status: "There is no cart that is pending from the user, the product cannot be removed....",
        });
    }
});

