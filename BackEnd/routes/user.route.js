const express = require('express')
const bcrypt = require('bcrypt')
const userModel = require('../models/user.model')
const userRouter = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth.middleware')
const checkAuthorization = require('../middleware/check.authorization')
const mongoose = require('mongoose')


userRouter.post("/register", async (req, res) => {
    const { name, email, password, role='buyer' } = req.body; 
    try {
      bcrypt.hash(password, 5, async (err, hash) => { 
        if (err) {
          return res.status(500).json({ message: "Internal Server Error" }); 
        }
        const user = new userModel({
          name,
          email,
          password: hash, // Storing the hashed password
          role
        });
        await user.save(); 
        res.status(201).json({ message: "User registered successfully" }); 
      });
    } catch (error) {
      res.status(500).json({ message: `Error while registering user ${error}` }); 
    }
  });

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body; 
    try {
      const user = await userModel.findOne({ email }); 
      if (!user) {
        return res.status(400).json({ message: "User not found" }); 
      }
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => { 
          if (err) {
            return res.status(500).json({ message: "Internal Server Error" }); 
          }
          if (result) {
            const token = jwt.sign({ userId: user._id, role:user.role, name:user.name }, 'AgroFix'); 
            return res.status(200).json({ message: "User logged in successfully", 
                                          token, 
                                          loggedUser:{ userId: user._id, role:user.role, name:user.name } 
                                        }); 
          } else {
            return res.status(401).json({ message: "Invalid Password" }); 
          }
        });
      }
    } catch (error) {
      res.status(500).json({ message: `Error while logging in user ${error}` }); 
    }
});

userRouter.get('/get-user', auth, async(req, res)=>{
  try {
    const userId = new mongoose.Types.ObjectId(req.loggedUser.userId)
    const user = await userModel.findOne({_id:userId})
    if(!user){
      return res.status(200).json({msg:"User not found"})
    }
    res.status(200).json({user})
  } catch (error) {
    res.status(400).json({"Error in get-user":error.message})
  }
})

userRouter.patch('/update-user', auth, async(req, res)=>{
  try {
    const userId = new mongoose.Types.ObjectId(req.loggedUser.userId)
    const user = await userModel.findByIdAndUpdate(userId, req.body)
    if(!user){
      return res.status(200).json({msg:"user not found"})
    }
    res.status(200).json({user})
  } catch (error) {
    res.status(400).json({"Error in update-user":error.message})
  }
})

userRouter.patch('/add-toCart/:productId', auth, checkAuthorization(['buyer']), async (req, res) => {
    const  productId  =new mongoose.Types.ObjectId(req.params.productId);
    const { quantity } = req.body;
    try {
      const user = await userModel.findById(req.loggedUser.userId);

      const existingItem = user.cart.find((item) => item.productId.equals(productId));
  
      if (existingItem) {
        existingItem.quantity += quantity; //This directly modifies the in-memory representation of the user document.
      } else {
        user.cart.push({ productId, quantity });
      }

      await user.save();
      res.json(user.cart);
    } catch (error) {
      res.status(500).json({ message: 'Error adding to cart', error });
    }
});

userRouter.patch('/remove-fromCart/:productId', auth, checkAuthorization(['buyer']), async (req, res) => {
    const productId = req.params.productId;
  
    try {
      const user = await userModel.findById(req.loggedUser.userId);

      user.cart = user.cart.filter((item) => !item.productId.equals(productId));
  
      await user.save();
      res.json({ message: 'Product removed from cart.', cart: user.cart });
    } catch (error) {
      res.status(500).json({ message: 'Error removing from cart', error });
    }
});
  
userRouter.get('/get-cartItem',auth, checkAuthorization(['buyer']), async (req, res) => {
    const { userId } = req.loggedUser;
  
    try {
      const user = await userModel
        .findById(userId)
        .populate('cart.productId')
        .exec();

      res.status(200).json({
        msg: 'Cart fetched successfully',
        cart: user.cart || [], // Return an empty array if the cart is null/undefined
      });
    } catch (error) {
      res.status(500).json({ msg: 'Error fetching cart', error: error.message });
    }
});
  

module.exports = userRouter;