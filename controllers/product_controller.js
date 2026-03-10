const productModel = require("../models/product_model");
const asyncHandler = require("express-async-handler");
const ErrorAPI = require("../utils/ErrorAppi");

const {
    createOne,
    deleteOne,
    updateOne,
    getOne,
    getAll,
} = require("./factory_handler");

const createProduct = createOne(productModel, "Product");
const deleteProduct = deleteOne(productModel, "Product");
const updateProduct = updateOne(productModel, "Product");
const getProductById = getOne(  productModel, "Product");
const getAllProducts = getAll(  productModel, "Product");


const getPetProductsBySellerId = asyncHandler(async (req, res, next) => {
    const sellerId = req.params.sellerId;
    const products = await productModel.getProductBySellerId(sellerId);
    if(!products) {
        return next(new ErrorAPI("No products found for this sellerId", 404));
    }
    res.status(200).json({ status: "success", data: products });
});
module.exports = {
    getAllProducts,
    getProductById,
    updateProduct,
    createProduct,
    deleteProduct,
    getPetProductsBySellerId
}