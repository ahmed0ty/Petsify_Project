const orderModel = require("../models/order_model");
const cartModel = require("../models/cart_model")
const ErrorAPI = require("../utils/ErrorAppi");
const {
  createOne,
  deleteOne,
  updateOne,
  getOne,
  getAll,
} = require("./factory_handler");

const createOrder = createOne(orderModel, "Order");
const deleteOrder = deleteOne(orderModel, "Order");
const getOrderById = getOne(orderModel, "Order");


const checkoutOrder = async (req, res, next) => {
  try {
    const getCart = await cartModel.getCartByUserId(req.body.userId)
    if (!getCart || getCart.length === 0) {
      return next(new ErrorAPI("No Cart found", 404));
    }

    console.log(getCart);

    const delevery_fees = 50; // initilized constant and after integrate an extern api
    let totalAmount = 0;
    let cartIds = []
    for (const row of getCart) {
      cartIds.push({id:row.id, discount_buy:row.discount})
      const priceAfter = row.discountedPrice;
      totalAmount += priceAfter;
    }
    if (totalAmount <= 0) {
      return next(new ErrorAPI("Error in price calculate of this order", 404));
    }
    const orderId = await orderModel.create({
      "total_price": totalAmount,
      "delevery_fees": delevery_fees,
      "userId": req.body.userId,
      "addresse":  req.body.address,
    })
    if (!orderId) {
      return next(new ErrorAPI("Error Creating Order in database", 404));
    }
    let checkUpdate = 0
    for (const cartId of cartIds) {
      const updateCart = await cartModel.update(cartId.id, {orderId})
      if (updateCart) {
        checkUpdate++;
      }
    }
    if (checkUpdate !== cartIds.length) {
      return next(new ErrorAPI("Error clean cart in database", 404));
    }
    return res.status(200).json({
      status: "success",
      message: "success checkout order",
      orderId: orderId[0]
    })
  } catch (err) {
    next(err);
  }
}



const confirmOrder = async(req,res,next)=>{
  try {
    const isConfirmed = await orderModel.update(req.params.orderId, {status:"accepted"})
    if(!isConfirmed){
      return next (new ErrorAPI("can't update status order"))
    }
    return res.status(200).json({
      status:'success',
      message:'order accepted',
    })
  } catch (error) {
    next(error)
  }
}

const orderDetails = async (req, res, next) => {
  try {
    const result = await orderModel.getOrderDetails(req.params.id);

    if (!result || result.length === 0) {
      return next(new ErrorAPI("No Order found", 404));
    }


    let totalAmountAfterDiscount = 0;
    let totalAmountBeforeDiscount = 0;

    const round = (n) => Number(n.toFixed(2));
    const data = {};
    const products = [];
    let totalAmount = 0;
    const customer = {
      name: result[0].fullName,
      phone: result[0].phone,
      email: result[0].email,
    };

    for (let row of result) {
      const discount = row.product_discount ?? 0;

      const priceBefore = row.price * row.cart_quantity;
      const priceAfter = row.price * (1 - discount / 100) * row.cart_quantity;
      // load product info
      const product = {
        productId: row.productId,
        name: row.name,
        description: row.description,
        quantity: row.cart_quantity,
        picture: row.picture,
        discount: row.product_discount,
        total_price_before_discount: round(priceBefore),
        total_price_after_discount: round(priceAfter),
      };
      products.push(product);

      // calculate total amount
      totalAmountBeforeDiscount += priceBefore;
      totalAmountAfterDiscount += priceAfter;
    }
    // finalize data
    data.orderId = result[0].id;
    data.status = result[0].status;
    data.createdAt = result[0].created_at;
    data.delevery_fees = result[0].delevery_fees
    data.updatedAt = result[0].updatedAt;
    data.totalAmount = totalAmount + result[0].total_price;
    data.customer = customer;
    data.products = products;
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (err) {
    next(err);
  }
}

const getOrdersForSeller = async (req, res, next) => {
  try {
    const result = await orderModel.getOrdersForseller(req.params.sellerId);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  deleteOrder,
  getOrderById,
  checkoutOrder,
  confirmOrder,
  orderDetails,
  getOrdersForSeller

};
