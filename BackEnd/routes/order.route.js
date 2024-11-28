const express = require('express');
const auth = require('../middleware/auth.middleware');
const checkAuthorization = require('../middleware/check.authorization');
const orderModel = require('../models/order.model');
const userModel = require('../models/user.model');
const mongoose = require('mongoose')

const orderRoute = express.Router();

orderRoute.get('/get-allOrder', auth, checkAuthorization(['admin']), async(req, res)=>{
    try {
        const placedOrder = await orderModel.find();
        if(!placedOrder){
            return res.status(201).json({msg:"No any placed order"})
        }
        res.status(200).json({placedOrder})
    } catch (error) {
        res.status(400).json({"Error in get-order":error.message})
    }
})

orderRoute.get('/get-ownOrder',auth, checkAuthorization(['buyer']), async(req, res)=>{
    try {
        const placedOrder = await orderModel.find({userId:req.loggedUser.userId}).populate("orderItems.productId")
        if(!placedOrder){
            return res.status(201).json({msg:"You have not placed any order"})
        }
        res.status(200).json({placedOrder})
    } catch (error) {
        res.status(400).json({"Error in get-ownOrder":error.message})
    }
})

orderRoute.get('/get-singleOrder/:orderId',auth, checkAuthorization(['buyer','admin']), async(req, res)=>{
    try {
        const orderId =new mongoose.Types.ObjectId(req.params.orderId)
        const placedOrder = await orderModel.findOne({_id:orderId})
        if(!placedOrder){
            return res.status(201).json({msg:"You have not placed any order"})
        }
        res.status(200).json({placedOrder})
    } catch (error) {
        res.status(400).json({"Error in get-ownOrder":error.message})
    }
})

orderRoute.post('/create-order',auth, checkAuthorization(['buyer']), async(req, res)=>{
    try {
        const loggedUserId = new mongoose.Types.ObjectId(req.loggedUser.userId)
        const orderItem = await userModel.findOne({_id:loggedUserId});

        const { deliveryAddress, contactInfo } = req.body;
        const order = { deliveryAddress, contactInfo, userId:req.loggedUser.userId, orderItems:orderItem.cart }
        const toSave =new orderModel(order)
        await userModel.findByIdAndUpdate(req.loggedUser.userId,{cart:[]})
        await toSave.save()
        res.json({"product":toSave})
    } catch (error) {
        res.status(400).json({"Error in create-order":error.message})
    }
})

orderRoute.patch('/update-ownOrder/:orderId',auth, checkAuthorization(['buyer','admin']), async(req, res)=>{
    try {
        const order = await orderModel.findByIdAndUpdate(req.params.orderId, req.body)
        res.status(201).json({msg:"Order update successfully", order})
    } catch (error) {
        res.status(500).json({ "Error in update-ownOrder":error.message })
    }
})

orderRoute.patch('/update-orderStatus/:orderId', auth, checkAuthorization(['admin']), async(req, res)=>{
    try {
        const order = await orderModel.findByIdAndUpdate(req.params.orderId, req.body)
        res.status(201).json({msg:"Order update successfully", order}) 
    } catch (error) {
        res.status(500).json({"Error in update-orderStatus":error.message})
    }
})

orderRoute.delete('/delete-order/:orderId', auth, checkAuthorization(['buyer','admin']), async(req, res)=>{
    try {
        const cart = await orderModel.findByIdAndDelete(req.params.orderId);
        res.status(204).json({msg:"order delete successfully", cart})
    } catch (error) {
        res.status(400).json({"Error in delete-order":error.message})
    }
})
module.exports = orderRoute;