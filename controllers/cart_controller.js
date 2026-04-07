const cartModel = require("../models/cart_model")
const {
  createOne,
  deleteOne,
  getAll,
} = require("./factory_handler");
const ErrorAPI = require("../utils/ErrorAppi");


const createCart = createOne(cartModel, "Cart");
const deleteCart = deleteOne(cartModel, "Cart");
const getAllCarts = getAll(cartModel, "Cart");



const getCartForUser = async (req, res, next) => {
  try {
    const result = await cartModel.getCartByUserId(req.params.userId,);

    if (!result || result.length === 0) {
      return next(new ErrorAPI("No Cart found", 404));
    }
    console.log(result)
    let products = [];
    let totalAmountAfterDiscount = 0;
    let totalAmountBeforeDiscount = 0;
    const round = (n) => Number(n.toFixed(2));

    for (const row of result) {
      const discount = row.discount ?? 0;
      const product = {
        id: row.productId,
        cartId : row.id,
        created_at: row.created_at,
        name: row.name,
        description: row.description,
        quantity: row.quantity,
        discount_percentage: discount,
        price:row.price,
        total_price_before_discount: row.totalPrice,
        total_price_after_discount: row.discountedPrice,
        selling_price: row.selling_price,
        picture: row.picture
      
      };
      products.push(product);
      totalAmountBeforeDiscount += row.totalPrice;
      totalAmountAfterDiscount += row.discountedPrice;
    }

    return res.status(200).json({
      status: "success",
      products,
      total_amount_before_discount: round(totalAmountBeforeDiscount),
      total_amount_after_discount: round(totalAmountAfterDiscount),
    });
  } catch (err) {
    next(err);
  }
};


const incrementNumberOfProduct = async (req,res,next)=>{
  try{
    const cart = await cartModel.getById(req.body.cartId)
    if(cart.orderId !== null){
      return next(new ErrorAPI("This cart has already been checked out. You can’t modify the items.", 404));
    }
    const newQuantity = cart.quantity + 1
    const updateQuantity = await cartModel.update(cart.id, {"quantity":newQuantity})
    if(!updateQuantity){
      return next(new ErrorAPI("Error updating quantity", 404));
    }
    return res.status(200).json({
      status:"success",
      message : "Quanitiy of product as updated",
      newQuantity
    })
  }catch(err){
    next(err)
  }
}


const decrementNumberOfProduct = async (req,res,next)=>{
   try{
    const cart = await cartModel.getById(req.body.cartId)
    if(cart.orderId !== null){
      return next(new ErrorAPI("This cart has already been checked out. You can’t modify the items.", 404));
    }
    const newQuantity = cart.quantity - 1
    if(newQuantity <= 0){
      return next(new ErrorAPI("Error updating quantity", 404));
    }
    const updateQuantity = await cartModel.update(cart.id, {"quantity":newQuantity})
    if(!updateQuantity){
      return next(new ErrorAPI("Error updating quantity", 404));
    }
    return res.status(200).json({
      status:"success",
      message : "Quanitiy of product as updated",
      newQuantity
    })
  }catch(err){
    next(err)
  }
}

module.exports = {
  createCart,
  deleteCart,
  getAllCarts,
  getCartForUser,
  incrementNumberOfProduct,
  decrementNumberOfProduct,
};
