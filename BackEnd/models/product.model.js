const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pricePerUnit: { type: Number, required: true },
    url:{ type: String, required:true },
});

const productModel = mongoose.model("Product", productSchema)

module.exports = productModel;