const express = require("express");
const productModel = require("../models/product.model");
const checkAuthorization = require("../middleware/check.authorization")
const cloudinary = require("cloudinary").v2;
const auth = require('../middleware/auth.middleware');
const { default: mongoose } = require("mongoose");
require("dotenv").config();

// Configure Cloudinary once at the start

cloudinary.config({
    cloud_name: "dawxefegz",
    api_key: '114711923992553',
    api_secret:'VMsnrf0UIKig04IUs3S7fT-EFcc'
})


const productRoute = express.Router();

productRoute.get('/get-product',async(req, res)=>{
    try {
        const product = await productModel.find();
        if(!product){
            return res.status(200).json({msg:"Product not found"})
        }
        res.status(200).json({product})
    } catch (error) {
        res.status(400).json({"Error in product":error.message})
    }
})

productRoute.get('/get-product/:productId',auth, async(req, res)=>{
    const productId = new mongoose.Types.ObjectId(req.params.productId)
    try {
        const product = await productModel.findOne({_id:productId});
        if(!product){
            return res.status(200).json({msg:"Product not found"})
        }
        res.json({product})
    } catch (error) {
        res.status(400).json({"Error in product":error.message})
    }
})


productRoute.post('/add-product',auth, checkAuthorization(["admin"]), async (req, res) => {
    try {
        if (!req.files || !req.files.photo) {
            return res.status(400).json({ error: "Photo is required" });
        }

        const file = req.files.photo;

       
        const result = await cloudinary.uploader.upload(file.tempFilePath);

        const { name, pricePerUnit } = req.body;

       
        const product = {
            name,
            url: result.url,
            pricePerUnit
        };
        const setProduct = new productModel(product);
        await setProduct.save();
        return res.status(201).json({
            msg: "Product created successfully",
            product: setProduct,
        });
    } catch (error) {        
        return res.status(500).json({"Error in add-product":error.message });
    }
});


productRoute.patch('/update-product/:id',auth,checkAuthorization(['admin']),async(req, res)=>{
    try {        
        const product = await productModel.findOne({_id:req.params.id})
        if(!product){
            return res.status(200).json({msg:"Product not found"})
        }
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).json({msg:"product Update successfully",updatedProduct})
    } catch (error) {
        res.status(400).json({"Error in product":error.message});
    }
})

productRoute.delete('/delete-product/:id',auth,checkAuthorization(['admin']),async(req, res)=>{
    try {        
        const product = await productModel.findOne({_id:req.params.id})
        if(!product){
            return res.status(200).json({msg:"Product not found"})
        }
        const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
        res.status(200).json({msg:"product delete successfully",deletedProduct})
    } catch (error) {
        res.status(400).json({"Error in product":error.message});
    }
})


module.exports = productRoute;